# PREFLIGHT PLUGIN — TECHNICAL IMPLEMENTATION GUIDE
## Code Patterns & Architecture Details for Build Phase

**Purpose:** Bridge gap between decisions.md and actual implementation
**Audience:** PHP developers building the plugin
**Date:** 2026-04-05

---

## 1. BACKUP IMPLEMENTATION (class-preflight-backup.php)

### Core Requirement: Fail-Safe Design
The backup must either succeed completely or fail loudly. Silent failures are unacceptable.

### Code Pattern: ZipArchive with Verification

```php
<?php
class Preflight_Backup {

    const BACKUP_DIR = '/preflight-backups';
    const MAX_BACKUPS_PER_PLUGIN = 3;
    const MIN_DISK_SPACE = 104857600; // 100MB

    /**
     * Create backup before update
     *
     * @param string $plugin_slug Plugin identifier (e.g., 'woocommerce/woocommerce.php')
     * @return array ['success' => bool, 'path' => string|null, 'error' => string|null]
     */
    public function create_backup( $plugin_slug ) {
        // Step 1: Validate preconditions
        if ( ! $this->check_preconditions( $plugin_slug ) ) {
            return [
                'success' => false,
                'path'    => null,
                'error'   => $this->last_error,
            ];
        }

        // Step 2: Calculate backup path
        $backup_dir = WP_CONTENT_DIR . self::BACKUP_DIR;
        $plugin_name = $this->get_plugin_name( $plugin_slug );
        $backup_file = $backup_dir . '/' . $plugin_name . '-' . time() . '.zip';

        // Step 3: Create backup file
        $zip = new ZipArchive();
        $open_result = $zip->open( $backup_file, ZipArchive::CREATE | ZipArchive::OVERWRITE );

        if ( $open_result !== true ) {
            $this->last_error = "Cannot create backup file: " . $this->get_zip_error( $open_result );
            return [ 'success' => false, 'path' => null, 'error' => $this->last_error ];
        }

        // Step 4: Add plugin files to zip
        $plugin_dir = $this->get_plugin_dir( $plugin_slug );
        if ( ! $this->add_directory_to_zip( $zip, $plugin_dir, $plugin_name ) ) {
            $zip->close();
            unlink( $backup_file );
            return [ 'success' => false, 'path' => null, 'error' => $this->last_error ];
        }

        // Step 5: Verify and close zip
        if ( ! $zip->close() ) {
            unlink( $backup_file );
            $this->last_error = "Failed to finalize backup file";
            return [ 'success' => false, 'path' => null, 'error' => $this->last_error ];
        }

        // Step 6: Verify backup integrity
        if ( ! $this->verify_backup( $backup_file ) ) {
            unlink( $backup_file );
            return [ 'success' => false, 'path' => null, 'error' => $this->last_error ];
        }

        // Step 7: Auto-prune old backups
        $this->prune_old_backups( $plugin_name, $backup_file );

        // Success
        return [ 'success' => true, 'path' => $backup_file, 'error' => null ];
    }

    /**
     * Validate preconditions before attempting backup
     */
    private function check_preconditions( $plugin_slug ) {
        // Check if plugin is symlinked (unsupported)
        if ( is_link( $this->get_plugin_dir( $plugin_slug ) ) ) {
            $this->last_error = "Preflight cannot backup symlinked plugins. Backup skipped.";
            return false;
        }

        // Check backup directory is writable
        $backup_dir = WP_CONTENT_DIR . self::BACKUP_DIR;
        if ( ! is_dir( $backup_dir ) ) {
            if ( ! mkdir( $backup_dir, 0755, true ) ) {
                $this->last_error = "Cannot create backup directory. Check file permissions.";
                return false;
            }
        }

        if ( ! is_writable( $backup_dir ) ) {
            $this->last_error = "Backup directory is not writable. Check file permissions.";
            return false;
        }

        // Check available disk space
        $free_space = disk_free_space( $backup_dir );
        if ( $free_space === false || $free_space < self::MIN_DISK_SPACE ) {
            $this->last_error = sprintf(
                "Insufficient disk space. Need 100MB free, have %sMB available.",
                round( $free_space / 1048576 )
            );
            return false;
        }

        // Check ZipArchive is available
        if ( ! extension_loaded( 'zip' ) ) {
            $this->last_error = "PHP ZipArchive extension not available. Contact your hosting provider.";
            return false;
        }

        return true;
    }

    /**
     * Verify backup can be extracted and accessed
     */
    private function verify_backup( $backup_file ) {
        $zip = new ZipArchive();
        $open_result = $zip->open( $backup_file );

        if ( $open_result !== true ) {
            $this->last_error = "Backup verification failed: Cannot open backup file";
            return false;
        }

        // Verify we can read file list
        $file_count = $zip->numFiles;
        if ( $file_count === 0 ) {
            $zip->close();
            $this->last_error = "Backup verification failed: Backup is empty";
            return false;
        }

        // Sample verification: Can we read the first file?
        $first_file = $zip->getNameIndex( 0 );
        if ( $first_file === false ) {
            $zip->close();
            $this->last_error = "Backup verification failed: Cannot read file index";
            return false;
        }

        $zip->close();
        return true;
    }

    /**
     * Auto-prune old backups, keeping only latest 3
     */
    private function prune_old_backups( $plugin_name, $keep_file ) {
        $backup_dir = WP_CONTENT_DIR . self::BACKUP_DIR;

        // Find all backups for this plugin
        $pattern = $backup_dir . '/' . preg_quote( $plugin_name ) . '-*.zip';
        $backups = glob( $pattern );

        if ( ! $backups || count( $backups ) <= self::MAX_BACKUPS_PER_PLUGIN ) {
            return;
        }

        // Sort by modification time, keep newest
        usort( $backups, function( $a, $b ) {
            return filemtime( $b ) <=> filemtime( $a );
        });

        // Delete oldest beyond max
        foreach ( array_slice( $backups, self::MAX_BACKUPS_PER_PLUGIN ) as $old_backup ) {
            if ( $old_backup !== $keep_file ) {
                unlink( $old_backup );
            }
        }
    }

    /**
     * Restore backup (rollback)
     */
    public function restore_backup( $plugin_slug, $backup_file ) {
        // Validation
        if ( ! file_exists( $backup_file ) ) {
            return [ 'success' => false, 'error' => 'Backup file not found' ];
        }

        $plugin_dir = $this->get_plugin_dir( $plugin_slug );

        // Remove current plugin directory
        if ( ! $this->remove_directory_recursive( $plugin_dir ) ) {
            return [ 'success' => false, 'error' => 'Cannot remove current plugin' ];
        }

        // Extract backup
        $zip = new ZipArchive();
        if ( $zip->open( $backup_file ) !== true ) {
            return [ 'success' => false, 'error' => 'Cannot open backup file' ];
        }

        // Extract to parent of plugin directory
        $extract_to = dirname( $plugin_dir );
        if ( ! $zip->extractTo( $extract_to ) ) {
            $zip->close();
            return [ 'success' => false, 'error' => 'Cannot extract backup' ];
        }

        $zip->close();

        // Verify restoration
        if ( ! is_dir( $plugin_dir ) ) {
            return [ 'success' => false, 'error' => 'Restoration verification failed' ];
        }

        return [ 'success' => true, 'error' => null ];
    }

    // Helper methods...
}
```

### Critical Error Handling Pattern

```php
// DON'T do this:
$zip->addFile( $file );
// If it fails silently, you don't know

// DO this instead:
if ( ! $zip->addFile( $file, $local_path ) ) {
    $this->last_error = "Failed to add file to backup: " . $file;
    return false;
}
```

---

## 2. MUTEX LOCKING FOR RACE CONDITIONS (class-preflight-core.php)

### Core Requirement: Sequential Updates Only
Prevent parallel updates from racing. Use WordPress transients for mutex.

### Code Pattern: Update Lock Management

```php
<?php
class Preflight_Core {

    const LOCK_KEY = 'preflight_update_lock';
    const LOCK_TIMEOUT = 120; // seconds

    /**
     * Hook into upgrader_pre_install
     * Prevent parallel updates using transient-based lock
     */
    public function hook_pre_install( $return, $package, $upgrader ) {
        // Check if another update is in progress
        $lock = get_transient( self::LOCK_KEY );

        if ( $lock ) {
            // Lock exists - queue this update instead of proceeding
            $plugin = isset( $upgrader->plugin ) ? $upgrader->plugin : null;

            if ( $plugin ) {
                wp_schedule_single_event( time() + 5, 'preflight_retry_update', [ $plugin ] );
            }

            return new WP_Error(
                'preflight_locked',
                'Another Preflight update is in progress. This update will retry in 5 seconds.'
            );
        }

        // Acquire lock
        set_transient( self::LOCK_KEY, 1, self::LOCK_TIMEOUT );

        // Perform preflight checks
        $checks = $this->run_preflight_checks( $package, $upgrader );

        if ( is_wp_error( $checks ) ) {
            delete_transient( self::LOCK_KEY );
            return $checks;
        }

        // Create backup
        $backup_result = $this->backup->create_backup( $upgrader->plugin ?? '' );

        if ( ! $backup_result['success'] ) {
            delete_transient( self::LOCK_KEY );
            return new WP_Error( 'preflight_backup_failed', $backup_result['error'] );
        }

        // Store backup path for rollback decision later
        set_transient( 'preflight_current_backup', $backup_result['path'], self::LOCK_TIMEOUT );

        return $return;
    }

    /**
     * Hook into upgrader_post_install
     * Run health check and decide whether to rollback
     */
    public function hook_post_install( $return, $package, $upgrader ) {
        try {
            // Get backup path
            $backup_path = get_transient( 'preflight_current_backup' );

            // Run health check
            $health = $this->health->check_site_health();

            if ( ! $health['healthy'] ) {
                // Auto-rollback
                $rollback = $this->backup->restore_backup( $upgrader->plugin ?? '', $backup_path );

                if ( $rollback['success'] ) {
                    $this->send_rollback_notification( $upgrader->plugin, 'Auto-rollback executed' );
                } else {
                    $this->send_rollback_notification( $upgrader->plugin, 'Rollback FAILED: ' . $rollback['error'] );
                }

                return new WP_Error( 'preflight_health_check_failed', 'Update rolled back' );
            }

            // Success - clean up
            delete_transient( 'preflight_current_backup' );

        } finally {
            // Always release lock, even on error
            delete_transient( self::LOCK_KEY );
        }

        return $return;
    }

    /**
     * Handle lock timeout (if previous process died)
     */
    public function maybe_clear_stale_lock() {
        // Called periodically (or on cron)
        $lock = get_transient( self::LOCK_KEY );

        // If lock exists, transient API will auto-expire after LOCK_TIMEOUT
        // No manual clearing needed - just verify system is responsive
    }
}
```

### Why Transients for Mutex?

- ✅ Built-in WordPress, no external dependency
- ✅ Automatically expires (prevents deadlock)
- ✅ Works on all hosting (shared, VPS, multisite)
- ✅ Survives across HTTP requests

---

## 3. HEALTH CHECK IMPLEMENTATION (class-preflight-health.php)

### Core Requirement: Detect Real Failures, Not False Positives

### Code Pattern: Multi-Layer Health Verification

```php
<?php
class Preflight_Health {

    const DEFAULT_TIMEOUT = 5;
    const MIN_TIMEOUT = 3;
    const MAX_TIMEOUT = 30;

    /**
     * Perform comprehensive health check
     * Returns: ['healthy' => bool, 'reason' => string]
     */
    public function check_site_health() {
        $timeout = $this->get_timeout_setting();

        // Layer 1: Database connectivity
        $db_healthy = $this->check_database();
        if ( ! $db_healthy ) {
            return [
                'healthy' => false,
                'reason'  => 'Database connectivity lost',
            ];
        }

        // Layer 2: Homepage loads (HTTP 200)
        $homepage_healthy = $this->check_homepage( $timeout );
        if ( ! $homepage_healthy ) {
            return [
                'healthy' => false,
                'reason'  => 'Homepage failed to load',
            ];
        }

        // Layer 3: Login page loads
        $login_healthy = $this->check_login_page( $timeout );
        if ( ! $login_healthy ) {
            return [
                'healthy' => false,
                'reason'  => 'Login page failed to load',
            ];
        }

        // Layer 4: Check debug log for new fatals
        $no_fatals = $this->check_debug_log();
        if ( ! $no_fatals ) {
            return [
                'healthy' => false,
                'reason'  => 'Fatal errors detected in debug log',
            ];
        }

        return [ 'healthy' => true, 'reason' => 'All checks passed' ];
    }

    /**
     * Database connectivity check
     * Fast synchronous check, no HTTP required
     */
    private function check_database() {
        global $wpdb;

        try {
            // Simple query - verifies DB is responsive
            $result = $wpdb->get_var( 'SELECT 1' );
            return $result === '1' || $result === 1;
        } catch ( Exception $e ) {
            return false;
        }
    }

    /**
     * Check homepage loads without errors
     */
    private function check_homepage( $timeout ) {
        $url = home_url( '/' );

        // Use HEAD request first (faster)
        $response = wp_remote_head( $url, [
            'timeout'    => $timeout,
            'sslverify'  => apply_filters( 'https_local_ssl_verify', false ),
        ]);

        if ( is_wp_error( $response ) ) {
            // HEAD might not be supported, fall back to GET
            return $this->check_homepage_get( $url, $timeout );
        }

        // Verify HTTP 200
        $status = wp_remote_retrieve_response_code( $response );
        return $status === 200;
    }

    /**
     * Fallback: GET request for homepage
     */
    private function check_homepage_get( $url, $timeout ) {
        $response = wp_remote_get( $url, [
            'timeout'    => $timeout,
            'sslverify'  => apply_filters( 'https_local_ssl_verify', false ),
            'redirection' => 0, // Don't follow redirects
        ]);

        if ( is_wp_error( $response ) ) {
            return false;
        }

        // Verify HTTP 200
        $status = wp_remote_retrieve_response_code( $response );
        if ( $status !== 200 ) {
            return false;
        }

        // Verify response contains actual content (not error page)
        $body = wp_remote_retrieve_body( $response );
        if ( empty( $body ) ) {
            return false;
        }

        // Check for common fatal error patterns
        return ! $this->contains_fatal_error( $body );
    }

    /**
     * Check login page (requires authentication)
     */
    private function check_login_page( $timeout ) {
        $url = wp_login_url();

        $response = wp_remote_get( $url, [
            'timeout'    => $timeout,
            'sslverify'  => apply_filters( 'https_local_ssl_verify', false ),
        ]);

        if ( is_wp_error( $response ) ) {
            return false;
        }

        // Check for login form in response
        $body = wp_remote_retrieve_body( $response );

        // Verify contains "wp-login" or similar
        return ( strpos( $body, 'wp-login' ) !== false ||
                 strpos( $body, 'wordpress-login' ) !== false );
    }

    /**
     * Detect fatal errors in response body
     */
    private function contains_fatal_error( $body ) {
        $fatal_patterns = [
            'Fatal error',
            'Parse error',
            'Allowed memory',
            'Maximum execution time',
            'Call to undefined function',
        ];

        foreach ( $fatal_patterns as $pattern ) {
            if ( stripos( $body, $pattern ) !== false ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check debug.log for new fatal errors
     */
    private function check_debug_log() {
        $debug_log = WP_CONTENT_DIR . '/debug.log';

        if ( ! file_exists( $debug_log ) ) {
            return true; // No debug log = no errors reported
        }

        // Only check last 100 lines
        $lines = $this->tail_file( $debug_log, 100 );

        foreach ( $lines as $line ) {
            if ( stripos( $line, 'Fatal error' ) !== false ||
                 stripos( $line, 'Parse error' ) !== false ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get last N lines of file efficiently
     */
    private function tail_file( $file, $lines ) {
        $f = fopen( $file, 'rb' );
        if ( ! $f ) {
            return [];
        }

        fseek( $f, -2, SEEK_END );

        $file_lines = [];
        $line_count = 0;

        while ( $line_count < $lines && ftell( $f ) > 0 ) {
            $char = fgetc( $f );
            if ( $char === "\n" ) {
                $line_count++;
            }
            fseek( $f, -2, SEEK_CUR );
        }

        // Read from current position to end
        while ( ! feof( $f ) ) {
            $line = fgets( $f );
            if ( ! empty( $line ) ) {
                $file_lines[] = $line;
            }
        }

        fclose( $f );
        return $file_lines;
    }

    /**
     * Get timeout setting (with validation)
     */
    private function get_timeout_setting() {
        $timeout = (int) get_option( 'preflight_health_timeout', self::DEFAULT_TIMEOUT );

        // Enforce bounds
        $timeout = min( max( $timeout, self::MIN_TIMEOUT ), self::MAX_TIMEOUT );

        return $timeout;
    }
}
```

### Timeout Handling Pattern

```php
// DON'T ignore timeouts
$response = wp_remote_get( $url, ['timeout' => 5] );
if ( is_wp_error( $response ) ) {
    return false; // Treat as failure
}

// DO distinguish timeout from other errors
if ( is_wp_error( $response ) ) {
    $code = $response->get_error_code();

    if ( $code === 'http_request_timeout' ) {
        // Log as warning, maybe retry with longer timeout
        // Don't auto-rollback on timeout alone
        return [ 'healthy' => true, 'warning' => 'Health check timeout' ];
    } else {
        // Real failure
        return false;
    }
}
```

---

## 4. WORDPRESS.ORG COMPLIANCE CHECKLIST

### Security Pattern: Input Validation → Sanitization → Escaping

```php
<?php
// ============================================
// PATTERN: Settings Form with Full Security
// ============================================

// 1. ADMIN FORM (in plugin settings page)
if ( isset( $_POST['preflight_timeout'] ) ) {
    // Step 1: Check nonce
    check_admin_referer( 'preflight_settings_nonce' );

    // Step 2: Check capability
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( 'Unauthorized' );
    }

    // Step 3: Sanitize input
    $timeout = absint( $_POST['preflight_timeout'] ?? 5 );

    // Step 4: Validate range
    $timeout = min( max( $timeout, 3 ), 30 );

    // Step 5: Save
    update_option( 'preflight_health_timeout', $timeout );

    wp_redirect( admin_url( 'admin.php?page=preflight' ) );
    exit;
}

// 2. HTML FORM RENDERING
?>
<form method="post">
    <?php wp_nonce_field( 'preflight_settings_nonce' ); ?>

    <label for="timeout">Health Check Timeout (seconds)</label>
    <input
        type="number"
        id="timeout"
        name="preflight_timeout"
        min="3"
        max="30"
        value="<?php echo esc_attr( get_option( 'preflight_health_timeout', 5 ) ); ?>"
    />
</form>

<?php
// ============================================
// PATTERN: Displaying Admin Notices
// ============================================

// DON'T do this:
echo '<div class="notice">' . $message . '</div>';

// DO do this:
echo '<div class="notice notice-' . esc_attr( $type ) . '">';
echo '<p>' . wp_kses_post( $message ) . '</p>';
echo '</div>';

// ============================================
// PATTERN: Database Operations
// ============================================

global $wpdb;

// DON'T use string concatenation:
$result = $wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE ID = " . $_GET['id'] );

// DO use prepared statements:
$result = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->posts} WHERE ID = %d",
        absint( $_GET['id'] )
    )
);
?>
```

### PHPCS Configuration (phpcs.xml)

```xml
<?xml version="1.0"?>
<ruleset name="Preflight">
    <config name="testVersion" value="7.4-"/>
    <rule ref="WordPress">
        <exclude name="WordPress.DB.DirectDatabaseQuery.DirectQuery"/>
        <exclude name="WordPress.DB.DirectDatabaseQuery.SchemaChange"/>
    </rule>
    <rule ref="WordPress.Files.FileName">
        <properties>
            <property name="strict_class_file_names" value="false"/>
        </properties>
    </rule>
</ruleset>
```

---

## 5. AUTO-UPDATE HOOK INTEGRATION

### Critical: Auto-Updates Fire in Cron Context

```php
<?php
// ============================================
// PATTERN: Cron-Safe Hooks
// ============================================

class Preflight_Auto_Updates {

    public function __construct() {
        // This hook fires for BOTH manual updates AND auto-updates (cron)
        add_filter( 'upgrader_pre_install', [ $this, 'preflight_check' ], 10, 2 );
        add_filter( 'upgrader_post_install', [ $this, 'health_check' ], 10, 2 );

        // Fallback hook for auto-updates (if pre/post don't fire)
        add_filter( 'wp_update_plugins', [ $this, 'intercept_auto_update' ] );
    }

    /**
     * Main pre-install hook
     * Fires BEFORE plugin update begins
     */
    public function preflight_check( $return, $package ) {
        // Safe to use here: can get plugin info, create backup
        $plugin = $this->get_plugin_from_package( $package );

        // Backup creation
        $backup = $this->backup->create_backup( $plugin );

        if ( ! $backup['success'] ) {
            // Block update on backup failure
            return new WP_Error( 'preflight_backup', $backup['error'] );
        }

        return $return;
    }

    /**
     * Main post-install hook
     * Fires AFTER plugin update completes
     */
    public function health_check( $return, $package ) {
        // Run health check and decide rollback
        $health = $this->health->check_site_health();

        if ( ! $health['healthy'] ) {
            // Auto-rollback
            $backup_path = get_transient( 'preflight_backup_path' );
            $this->backup->restore_backup( /* args */ );

            // Send notification (critical for cron context!)
            // User isn't watching - email is only notification
            $this->notify_admin_rollback();
        }

        return $return;
    }

    /**
     * Fallback hook for auto-update interception
     */
    public function intercept_auto_update( $updates ) {
        // If pre/post hooks don't fire, this catches auto-updates
        // Less reliable than upgrader_pre_install but better than nothing
        return $updates;
    }

    /**
     * Email notification (critical in cron context)
     */
    private function notify_admin_rollback() {
        $admin_email = get_option( 'admin_email' );

        $subject = '[Preflight] Auto-rollback executed on ' . get_bloginfo( 'name' );

        $message = sprintf(
            "Preflight detected a problem during plugin update and automatically rolled back the site.\n\n" .
            "Site: %s\n" .
            "Time: %s\n" .
            "Manual rollback available in WordPress admin: Plugins > Preflight",
            get_bloginfo( 'url' ),
            current_time( 'mysql' )
        );

        wp_mail( $admin_email, $subject, $message );
    }
}
```

---

## 6. WP-CLI COMMAND IMPLEMENTATION

### Code Pattern: Simple, Single-Purpose Command

```php
<?php
if ( defined( 'WP_CLI' ) && WP_CLI ) {

    class Preflight_CLI {

        /**
         * Manually rollback a plugin
         *
         * ## OPTIONS
         * <plugin>
         * : Plugin slug (e.g., woocommerce)
         *
         * ## EXAMPLES
         * wp preflight rollback woocommerce
         */
        public function rollback( $args, $assoc_args ) {
            $plugin = $args[0];

            // Verify plugin exists
            if ( ! function_exists( 'get_plugin_data' ) ) {
                require_once ABSPATH . 'wp-admin/includes/plugin.php';
            }

            // Find latest backup
            $backup = $this->find_latest_backup( $plugin );

            if ( ! $backup ) {
                WP_CLI::error( "No backup found for plugin: $plugin" );
                return;
            }

            // Execute rollback
            $backup_obj = new Preflight_Backup();
            $result = $backup_obj->restore_backup( $plugin, $backup );

            if ( $result['success'] ) {
                WP_CLI::success( "Plugin rolled back successfully: $plugin" );
            } else {
                WP_CLI::error( $result['error'] );
            }
        }

        private function find_latest_backup( $plugin ) {
            $backup_dir = WP_CONTENT_DIR . '/preflight-backups';
            $pattern = $backup_dir . '/' . preg_quote( $plugin ) . '-*.zip';
            $backups = glob( $pattern );

            if ( ! $backups ) {
                return null;
            }

            usort( $backups, function( $a, $b ) {
                return filemtime( $b ) <=> filemtime( $a );
            });

            return $backups[0];
        }
    }

    WP_CLI::add_command( 'preflight rollback', [ 'Preflight_CLI', 'rollback' ] );
}
```

---

## KEY TAKEAWAYS FOR DEVELOPERS

### 1. Fail-Safe Philosophy
- Backup failure → block update (don't proceed blindly)
- Health check timeout → warn user (don't auto-rollback on timeout alone)
- Symlink detected → skip backup with clear message

### 2. Security is Not Optional
- Nonce on every form
- Sanitize every input
- Escape every output
- Capability check on every admin action

### 3. Shared Hosting Reality
- Symlinks exist and break things
- Memory limits are real (64MB shared hosting)
- File operations are slow (count seconds, not milliseconds)
- Long-running processes get killed (set `set_time_limit()`)

### 4. Testing Demands
- Test on actual shared hosting (not just local)
- Test across 4 PHP versions (7.4, 8.0, 8.1, 8.2)
- Test "Update All" with 10+ plugins (race condition detection)
- Test auto-updates (cron context is different from admin context)

### 5. WordPress.org Requirements
- Run PHPCS before submission (don't skip this)
- Zero JavaScript console errors
- No external API calls
- GPL v2 compatible licensing

---

*Implementation Guide for Preflight WordPress Plugin*
*Prepared by: Engineering Team*
*Updated: 2026-04-05*
