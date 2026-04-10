<?php
/**
 * LocalGenius Admin Settings
 *
 * Handles the admin settings page for LocalGenius configuration.
 * Minimal settings per Decision 13: business type + location only.
 *
 * @package LocalGenius
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class LocalGenius_Admin
 *
 * Admin settings page and options management.
 */
class LocalGenius_Admin {

	/**
	 * Initialize admin hooks.
	 */
	public static function init(): void {
		add_action( 'admin_menu', [ self::class, 'add_settings_page' ] );
		add_action( 'admin_init', [ self::class, 'register_settings' ] );
		add_action( 'admin_enqueue_scripts', [ self::class, 'enqueue_admin_assets' ] );
		add_filter( 'plugin_action_links_' . plugin_basename( LOCALGENIUS_PLUGIN_FILE ), [ self::class, 'add_settings_link' ] );
	}

	/**
	 * Add settings page under Settings menu.
	 */
	public static function add_settings_page(): void {
		add_options_page(
			__( 'LocalGenius Settings', 'localgenius' ),
			__( 'LocalGenius', 'localgenius' ),
			'manage_options',
			'localgenius',
			[ self::class, 'render_settings_page' ]
		);
	}

	/**
	 * Register plugin settings.
	 */
	public static function register_settings(): void {
		register_setting(
			'localgenius_settings',
			'localgenius_business_type',
			[
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => '',
			]
		);

		register_setting(
			'localgenius_settings',
			'localgenius_location',
			[
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => '',
			]
		);

		register_setting(
			'localgenius_settings',
			'localgenius_additional_info',
			[
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_textarea_field',
				'default'           => '',
			]
		);

		add_settings_section(
			'localgenius_main_section',
			'',
			'__return_empty_string',
			'localgenius'
		);

		add_settings_field(
			'localgenius_business_type',
			__( 'Business Type', 'localgenius' ),
			[ self::class, 'render_business_type_field' ],
			'localgenius',
			'localgenius_main_section'
		);

		add_settings_field(
			'localgenius_location',
			__( 'Location', 'localgenius' ),
			[ self::class, 'render_location_field' ],
			'localgenius',
			'localgenius_main_section'
		);

		add_settings_field(
			'localgenius_additional_info',
			__( 'Additional Info', 'localgenius' ),
			[ self::class, 'render_additional_info_field' ],
			'localgenius',
			'localgenius_main_section'
		);
	}

	/**
	 * Enqueue admin CSS and JS.
	 *
	 * @param string $hook_suffix The current admin page.
	 */
	public static function enqueue_admin_assets( string $hook_suffix ): void {
		if ( 'settings_page_localgenius' !== $hook_suffix ) {
			return;
		}

		wp_enqueue_style(
			'localgenius-admin',
			LOCALGENIUS_PLUGIN_URL . 'admin/css/admin.css',
			[],
			LOCALGENIUS_VERSION
		);
	}

	/**
	 * Add settings link on plugins page.
	 *
	 * @param array $links Existing plugin action links.
	 * @return array Modified links array.
	 */
	public static function add_settings_link( array $links ): array {
		$settings_link = sprintf(
			'<a href="%s">%s</a>',
			esc_url( admin_url( 'options-general.php?page=localgenius' ) ),
			esc_html__( 'Settings', 'localgenius' )
		);
		array_unshift( $links, $settings_link );
		return $links;
	}

	/**
	 * Render the settings page.
	 */
	public static function render_settings_page(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		require_once LOCALGENIUS_PLUGIN_DIR . 'admin/views/settings-page.php';
	}

	/**
	 * Render business type dropdown field.
	 */
	public static function render_business_type_field(): void {
		require_once LOCALGENIUS_PLUGIN_DIR . 'includes/class-faq-templates.php';
		$current = get_option( 'localgenius_business_type', '' );
		$types   = LocalGenius_FAQ_Templates::get_business_types();
		?>
		<select name="localgenius_business_type" id="localgenius_business_type" class="localgenius-select">
			<option value=""><?php esc_html_e( 'Select your business type...', 'localgenius' ); ?></option>
			<?php foreach ( $types as $slug => $label ) : ?>
				<option value="<?php echo esc_attr( $slug ); ?>" <?php selected( $current, $slug ); ?>>
					<?php echo esc_html( $label ); ?>
				</option>
			<?php endforeach; ?>
		</select>
		<p class="description"><?php esc_html_e( 'This helps us answer common questions for your type of business.', 'localgenius' ); ?></p>
		<?php
	}

	/**
	 * Render location text field.
	 */
	public static function render_location_field(): void {
		$current = get_option( 'localgenius_location', '' );
		?>
		<input
			type="text"
			name="localgenius_location"
			id="localgenius_location"
			value="<?php echo esc_attr( $current ); ?>"
			class="regular-text localgenius-input"
			placeholder="<?php esc_attr_e( 'Austin, TX', 'localgenius' ); ?>"
		/>
		<p class="description"><?php esc_html_e( 'Your city or neighborhood helps personalize responses.', 'localgenius' ); ?></p>
		<?php
	}

	/**
	 * Render additional info textarea field.
	 */
	public static function render_additional_info_field(): void {
		$current = get_option( 'localgenius_additional_info', '' );
		?>
		<textarea
			name="localgenius_additional_info"
			id="localgenius_additional_info"
			class="large-text localgenius-textarea"
			rows="3"
			placeholder="<?php esc_attr_e( 'Anything special about your business? Special hours, unique services, etc.', 'localgenius' ); ?>"
		><?php echo esc_textarea( $current ); ?></textarea>
		<p class="description"><?php esc_html_e( 'Optional. Add any extra details that might help answer customer questions.', 'localgenius' ); ?></p>
		<?php
	}

	/**
	 * Get the widget status for display.
	 *
	 * @return array Status array with 'active', 'message', and 'stats'.
	 */
	public static function get_widget_status(): array {
		$business_type = get_option( 'localgenius_business_type', '' );
		$total_questions = (int) get_option( 'localgenius_question_count', 0 );
		$cache_hits = (int) get_option( 'localgenius_cache_hits', 0 );
		$last_question = get_option( 'localgenius_last_question', 0 );

		$status = [
			'active'  => ! empty( $business_type ),
			'message' => '',
			'stats'   => [
				'total_questions' => $total_questions,
				'cache_hits'      => $cache_hits,
				'cache_rate'      => $total_questions > 0 ? round( ( $cache_hits / $total_questions ) * 100 ) : 0,
				'last_question'   => $last_question > 0 ? human_time_diff( $last_question ) . ' ago' : 'Never',
			],
		];

		if ( $status['active'] ) {
			$status['message'] = __( 'Your widget is live and answering questions!', 'localgenius' );
		} else {
			$status['message'] = __( 'Select a business type to activate your widget.', 'localgenius' );
		}

		return $status;
	}
}
