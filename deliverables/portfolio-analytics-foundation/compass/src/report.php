<?php
/**
 * Compass Daily Text Summary Generator
 *
 * Generates brutal, honest summaries in Compass voice.
 * No hedging. No jargon. Just truth.
 *
 * Voice Guidelines:
 * - Direct and confident, never hedge ("suggests", "might", "potentially")
 * - Actionable decisions, not observations
 * - Brutal honesty about product health
 * - Example: "Pinned is dying. 62% never returned. Kill it or pivot."
 * - NOT: "Retention metrics suggest suboptimal engagement patterns."
 */

require_once __DIR__ . '/queries.php';

/**
 * Determine product health based on metrics
 */
function diagnose_health($dau, $retention, $trend) {
    // Dead: Low DAU and terrible retention
    if ($dau['dau'] < 10 && $retention['d7'] < 10) {
        return 'dead';
    }

    // Dying: Negative trend and poor retention
    if ($trend < -20 && $retention['d7'] < 20) {
        return 'dying';
    }

    // Declining: Negative trend
    if ($trend < -10) {
        return 'declining';
    }

    // Stagnant: No growth, mediocre retention
    if (abs($trend) < 5 && $retention['d7'] < 40) {
        return 'stagnant';
    }

    // Growing: Positive trend and decent retention
    if ($trend > 10 && $retention['d7'] > 30) {
        return 'growing';
    }

    // Healthy: Good retention
    if ($retention['d7'] > 40) {
        return 'healthy';
    }

    return 'neutral';
}

/**
 * Get action recommendation based on health
 */
function recommend_action($health, $product, $dau, $retention, $revenue) {
    switch ($health) {
        case 'dead':
            return "Kill it. Don't waste another week.";

        case 'dying':
            return "Pivot now or kill it. Current trajectory is death.";

        case 'declining':
            if ($retention['d7'] < 20) {
                return "Fix retention or abandon. Users aren't sticking.";
            } else {
                return "Stop the bleeding. Find what changed and fix it.";
            }

        case 'stagnant':
            if ($dau['dau'] > 50) {
                return "Unlock growth. You have users but no momentum.";
            } else {
                return "Go big or go home. Half-measures won't cut it.";
            }

        case 'growing':
            if ($retention['d1'] < 60) {
                return "Double down on onboarding. You're growing but losing too many on day 1.";
            } else {
                return "Pour gas on the fire. This is working.";
            }

        case 'healthy':
            if ($revenue['rpu_cents'] > 0 && $revenue['trend_percent'] > 0) {
                return "Print money. Keep doing what you're doing.";
            } else {
                return "Great product. Now monetize it.";
            }

        default:
            return "Need more data. Check back tomorrow.";
    }
}

/**
 * Format trend for display
 */
function format_trend($trend) {
    if ($trend > 0) {
        return '+' . round($trend) . '%';
    } elseif ($trend < 0) {
        return round($trend) . '%';
    } else {
        return 'flat';
    }
}

/**
 * Format currency
 */
function format_currency($cents) {
    return '$' . number_format($cents / 100, 2);
}

/**
 * Generate summary for a single product
 */
function compass_generate_summary($product) {
    $metrics = compass_get_all_metrics($product);

    $dau = $metrics['dau'];
    $retention = $metrics['retention'];
    $revenue = $metrics['revenue'];
    $churn = $metrics['churn'];

    // Handle errors
    if (isset($dau['error']) || isset($retention['error']) || isset($revenue['error'])) {
        return "[$product] Error: Database unavailable. Check logs.\n";
    }

    // Handle no data
    if ($dau['dau'] == 0) {
        return "[$product] No data yet. Start tracking events.\n";
    }

    // Diagnose health
    $health = diagnose_health($dau, $retention, $dau['trend_percent']);
    $action = recommend_action($health, $product, $dau, $retention, $revenue);

    // Format output
    $output = strtoupper($product) . "\n";
    $output .= str_repeat('─', 50) . "\n";

    // DAU line
    $trend = format_trend($dau['trend_percent']);
    $output .= "DAU: {$dau['dau']} ({$trend})\n";

    // Retention line
    $output .= "Retention: D1={$retention['d1']}% | D7={$retention['d7']}% | D30={$retention['d30']}%\n";

    // Revenue line (only if non-zero)
    if ($revenue['total_revenue_cents'] > 0) {
        $rpu = format_currency($revenue['rpu_cents']);
        $total = format_currency($revenue['total_revenue_cents']);
        $rev_trend = format_trend($revenue['trend_percent']);
        $output .= "Revenue: {$rpu}/user | {$total} total ({$rev_trend})\n";
    }

    // Churn line (only if we have cohort data)
    if ($churn['cohort_size'] > 0) {
        $output .= "Churn: {$churn['churn_percent']}% ({$churn['churned_count']} of {$churn['cohort_size']} users)\n";
    }

    // Health diagnosis
    $output .= "\n";
    $health_label = strtoupper($health);
    $output .= "Diagnosis: {$health_label}\n";

    // Action recommendation
    $output .= "Decision: {$action}\n";

    return $output . "\n";
}

/**
 * Generate full portfolio summary
 */
function compass_generate_portfolio_summary($products = null) {
    if ($products === null) {
        $products = ['pinned', 'dash', 'localgenius', 'shipyard', 'great-minds'];
    }

    $output = "";
    $output .= "╔════════════════════════════════════════════════════╗\n";
    $output .= "║           COMPASS DAILY PORTFOLIO REPORT           ║\n";
    $output .= "║              " . date('l, F j, Y') . "              ║\n";
    $output .= "╚════════════════════════════════════════════════════╝\n\n";

    foreach ($products as $product) {
        $output .= compass_generate_summary($product);
    }

    // Portfolio totals
    $output .= str_repeat('═', 50) . "\n";
    $output .= "PORTFOLIO TOTALS\n";
    $output .= str_repeat('─', 50) . "\n";

    $total_dau = 0;
    $total_revenue = 0;
    $product_count = 0;
    $healthy_count = 0;

    foreach ($products as $product) {
        $metrics = compass_get_all_metrics($product);
        if (!isset($metrics['dau']['error']) && $metrics['dau']['dau'] > 0) {
            $total_dau += $metrics['dau']['dau'];
            $total_revenue += $metrics['revenue']['total_revenue_cents'];
            $product_count++;

            $health = diagnose_health($metrics['dau'], $metrics['retention'], $metrics['dau']['trend_percent']);
            if (in_array($health, ['healthy', 'growing'])) {
                $healthy_count++;
            }
        }
    }

    $output .= "Total DAU: {$total_dau}\n";
    $output .= "Total Revenue: " . format_currency($total_revenue) . "\n";
    $output .= "Healthy Products: {$healthy_count}/{$product_count}\n\n";

    // Portfolio health
    if ($product_count == 0) {
        $output .= "Portfolio Status: NO DATA\n";
        $output .= "Action: Start tracking events across all products.\n\n";
    } elseif ($healthy_count == 0) {
        $output .= "Portfolio Status: CRISIS\n";
        $output .= "Action: Every product is struggling. Emergency triage needed.\n\n";
    } elseif ($healthy_count < $product_count / 2) {
        $output .= "Portfolio Status: STRUGGLING\n";
        $output .= "Action: Most products failing. Focus resources on winners.\n\n";
    } else {
        $output .= "Portfolio Status: OPERATING\n";
        $output .= "Action: Kill the losers. Double down on winners.\n\n";
    }

    $output .= "Generated: " . date('Y-m-d H:i:s T') . "\n";
    $output .= "Data freshness: Last 30 days\n\n";

    $output .= "─────────────────────────────────────────────────────\n";
    $output .= "This is Compass. It tells the truth.\n";
    $output .= "Act on it or ignore it. But don't pretend you didn't know.\n";

    return $output;
}

// CLI execution
if (php_sapi_name() === 'cli') {
    if (isset($argv[1])) {
        // Single product mode
        $product = $argv[1];
        echo compass_generate_summary($product);
    } else {
        // Full portfolio mode
        echo compass_generate_portfolio_summary();
    }
}
