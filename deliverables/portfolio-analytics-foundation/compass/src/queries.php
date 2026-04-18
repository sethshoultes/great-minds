<?php
/**
 * Compass Metrics Queries
 *
 * Core metric calculations for portfolio analytics:
 * - Daily Active Users (DAU)
 * - Retention Curves (D1, D7, D30)
 * - Revenue Per User (RPU)
 * - Monthly Recurring Revenue (MRR)
 * - Churn Rate
 */

// Get database path from environment or use default
function get_db_path() {
    $db_path = getenv('COMPASS_DB_PATH');
    if (!$db_path) {
        $db_path = dirname(__DIR__) . '/db/compass.db';
    }
    return $db_path;
}

/**
 * Get database connection
 */
function get_db() {
    $db_path = get_db_path();
    try {
        $db = new SQLite3($db_path);
        $db->busyTimeout(5000);
        return $db;
    } catch (Exception $e) {
        error_log("Compass: Database connection error - " . $e->getMessage());
        return null;
    }
}

/**
 * Calculate Daily Active Users (DAU)
 *
 * @param string $product Product identifier (pinned, dash, etc.)
 * @param int $date_range Number of days to look back (default 30)
 * @return array Array with DAU count and trend data
 */
function compass_calculate_dau($product, $date_range = 30) {
    $db = get_db();
    if (!$db) {
        return ['dau' => 0, 'error' => 'Database connection failed'];
    }

    try {
        // Calculate current period DAU
        $stmt = $db->prepare('
            SELECT COUNT(DISTINCT user_hash) as dau
            FROM events
            WHERE product = :product
            AND timestamp >= datetime("now", "-" || :days || " days")
        ');
        $stmt->bindValue(':product', $product, SQLITE3_TEXT);
        $stmt->bindValue(':days', $date_range, SQLITE3_INTEGER);
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);
        $current_dau = (int)$row['dau'];

        // Calculate previous period DAU for trend comparison
        $stmt = $db->prepare('
            SELECT COUNT(DISTINCT user_hash) as dau
            FROM events
            WHERE product = :product
            AND timestamp >= datetime("now", "-" || :days_end || " days")
            AND timestamp < datetime("now", "-" || :days_start || " days")
        ');
        $stmt->bindValue(':product', $product, SQLITE3_TEXT);
        $stmt->bindValue(':days_start', $date_range, SQLITE3_INTEGER);
        $stmt->bindValue(':days_end', $date_range * 2, SQLITE3_INTEGER);
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);
        $previous_dau = (int)$row['dau'];

        // Calculate trend
        $trend = 0;
        if ($previous_dau > 0) {
            $trend = (($current_dau - $previous_dau) / $previous_dau) * 100;
        }

        $db->close();

        return [
            'dau' => $current_dau,
            'previous_dau' => $previous_dau,
            'trend_percent' => round($trend, 1)
        ];

    } catch (Exception $e) {
        error_log("Compass: DAU calculation error - " . $e->getMessage());
        if ($db) $db->close();
        return ['dau' => 0, 'error' => $e->getMessage()];
    }
}

/**
 * Calculate Retention Curves (D1, D7, D30)
 *
 * @param string $product Product identifier
 * @return array Retention percentages for D1, D7, D30
 */
function compass_calculate_retention_curves($product) {
    $db = get_db();
    if (!$db) {
        return ['d1' => 0, 'd7' => 0, 'd30' => 0, 'error' => 'Database connection failed'];
    }

    try {
        // Get cohort start dates (first event per user)
        $cohort_query = '
            SELECT user_hash, MIN(DATE(timestamp)) as cohort_date
            FROM events
            WHERE product = :product
            GROUP BY user_hash
        ';

        $retention = ['d1' => 0, 'd7' => 0, 'd30' => 0];

        foreach ([1, 7, 30] as $day) {
            // Calculate retention for this day
            $stmt = $db->prepare('
                WITH cohorts AS (
                    ' . $cohort_query . '
                ),
                returned_users AS (
                    SELECT DISTINCT c.user_hash
                    FROM cohorts c
                    INNER JOIN events e ON e.user_hash = c.user_hash AND e.product = :product
                    WHERE DATE(e.timestamp) = DATE(c.cohort_date, "+' . $day . ' days")
                    AND c.cohort_date <= DATE("now", "-' . $day . ' days")
                )
                SELECT
                    COUNT(DISTINCT c.user_hash) as cohort_size,
                    COUNT(DISTINCT r.user_hash) as returned_count
                FROM cohorts c
                LEFT JOIN returned_users r ON r.user_hash = c.user_hash
                WHERE c.cohort_date <= DATE("now", "-' . $day . ' days")
            ');

            $stmt->bindValue(':product', $product, SQLITE3_TEXT);
            $result = $stmt->execute();
            $row = $result->fetchArray(SQLITE3_ASSOC);

            $cohort_size = (int)$row['cohort_size'];
            $returned_count = (int)$row['returned_count'];

            if ($cohort_size > 0) {
                $retention['d' . $day] = round(($returned_count / $cohort_size) * 100, 1);
            }
        }

        $db->close();
        return $retention;

    } catch (Exception $e) {
        error_log("Compass: Retention calculation error - " . $e->getMessage());
        if ($db) $db->close();
        return ['d1' => 0, 'd7' => 0, 'd30' => 0, 'error' => $e->getMessage()];
    }
}

/**
 * Calculate Revenue Per User (RPU)
 *
 * @param string $product Product identifier
 * @param int $date_range Number of days to look back (default 30)
 * @return array Revenue per user in cents and trend data
 */
function compass_calculate_revenue_per_user($product, $date_range = 30) {
    $db = get_db();
    if (!$db) {
        return ['rpu_cents' => 0, 'error' => 'Database connection failed'];
    }

    try {
        // Calculate current period
        $stmt = $db->prepare('
            SELECT
                SUM(revenue_cents) as total_revenue,
                COUNT(DISTINCT user_hash) as user_count
            FROM events
            WHERE product = :product
            AND timestamp >= datetime("now", "-" || :days || " days")
        ');
        $stmt->bindValue(':product', $product, SQLITE3_TEXT);
        $stmt->bindValue(':days', $date_range, SQLITE3_INTEGER);
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);

        $total_revenue = (int)$row['total_revenue'];
        $user_count = (int)$row['user_count'];
        $current_rpu = ($user_count > 0) ? $total_revenue / $user_count : 0;

        // Calculate previous period for trend
        $stmt = $db->prepare('
            SELECT
                SUM(revenue_cents) as total_revenue,
                COUNT(DISTINCT user_hash) as user_count
            FROM events
            WHERE product = :product
            AND timestamp >= datetime("now", "-" || :days_end || " days")
            AND timestamp < datetime("now", "-" || :days_start || " days")
        ');
        $stmt->bindValue(':product', $product, SQLITE3_TEXT);
        $stmt->bindValue(':days_start', $date_range, SQLITE3_INTEGER);
        $stmt->bindValue(':days_end', $date_range * 2, SQLITE3_INTEGER);
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);

        $prev_revenue = (int)$row['total_revenue'];
        $prev_users = (int)$row['user_count'];
        $previous_rpu = ($prev_users > 0) ? $prev_revenue / $prev_users : 0;

        // Calculate trend
        $trend = 0;
        if ($previous_rpu > 0) {
            $trend = (($current_rpu - $previous_rpu) / $previous_rpu) * 100;
        }

        $db->close();

        return [
            'rpu_cents' => round($current_rpu),
            'total_revenue_cents' => $total_revenue,
            'user_count' => $user_count,
            'previous_rpu_cents' => round($previous_rpu),
            'trend_percent' => round($trend, 1)
        ];

    } catch (Exception $e) {
        error_log("Compass: RPU calculation error - " . $e->getMessage());
        if ($db) $db->close();
        return ['rpu_cents' => 0, 'error' => $e->getMessage()];
    }
}

/**
 * Calculate Monthly Recurring Revenue (MRR)
 *
 * @param string $product Product identifier
 * @return array MRR in cents and trend data
 */
function compass_calculate_mrr($product) {
    $db = get_db();
    if (!$db) {
        return ['mrr_cents' => 0, 'error' => 'Database connection failed'];
    }

    try {
        // Get revenue from last 30 days
        $stmt = $db->prepare('
            SELECT SUM(revenue_cents) as monthly_revenue
            FROM events
            WHERE product = :product
            AND timestamp >= datetime("now", "-30 days")
        ');
        $stmt->bindValue(':product', $product, SQLITE3_TEXT);
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);
        $mrr = (int)$row['monthly_revenue'];

        $db->close();

        return [
            'mrr_cents' => $mrr,
            'mrr_dollars' => round($mrr / 100, 2)
        ];

    } catch (Exception $e) {
        error_log("Compass: MRR calculation error - " . $e->getMessage());
        if ($db) $db->close();
        return ['mrr_cents' => 0, 'error' => $e->getMessage()];
    }
}

/**
 * Calculate Churn Rate (users who haven't returned in 30 days)
 *
 * @param string $product Product identifier
 * @return array Churn rate percentage
 */
function compass_calculate_churn($product) {
    $db = get_db();
    if (!$db) {
        return ['churn_percent' => 0, 'error' => 'Database connection failed'];
    }

    try {
        // Get users who were active 30-60 days ago
        $stmt = $db->prepare('
            SELECT COUNT(DISTINCT user_hash) as cohort_size
            FROM events
            WHERE product = :product
            AND timestamp >= datetime("now", "-60 days")
            AND timestamp < datetime("now", "-30 days")
        ');
        $stmt->bindValue(':product', $product, SQLITE3_TEXT);
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);
        $cohort_size = (int)$row['cohort_size'];

        // Get users from that cohort who returned in last 30 days
        $stmt = $db->prepare('
            SELECT COUNT(DISTINCT e1.user_hash) as returned_count
            FROM events e1
            WHERE e1.product = :product
            AND e1.timestamp >= datetime("now", "-30 days")
            AND e1.user_hash IN (
                SELECT DISTINCT user_hash
                FROM events
                WHERE product = :product
                AND timestamp >= datetime("now", "-60 days")
                AND timestamp < datetime("now", "-30 days")
            )
        ');
        $stmt->bindValue(':product', $product, SQLITE3_TEXT);
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);
        $returned_count = (int)$row['returned_count'];

        // Calculate churn
        $churned_count = $cohort_size - $returned_count;
        $churn_percent = ($cohort_size > 0) ? ($churned_count / $cohort_size) * 100 : 0;

        $db->close();

        return [
            'churn_percent' => round($churn_percent, 1),
            'cohort_size' => $cohort_size,
            'churned_count' => $churned_count,
            'retained_count' => $returned_count
        ];

    } catch (Exception $e) {
        error_log("Compass: Churn calculation error - " . $e->getMessage());
        if ($db) $db->close();
        return ['churn_percent' => 0, 'error' => $e->getMessage()];
    }
}

/**
 * Get all metrics for a product
 *
 * @param string $product Product identifier
 * @return array All metrics combined
 */
function compass_get_all_metrics($product) {
    return [
        'product' => $product,
        'dau' => compass_calculate_dau($product),
        'retention' => compass_calculate_retention_curves($product),
        'revenue' => compass_calculate_revenue_per_user($product),
        'mrr' => compass_calculate_mrr($product),
        'churn' => compass_calculate_churn($product),
        'generated_at' => date('Y-m-d H:i:s')
    ];
}
