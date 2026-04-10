<?php
/**
 * LocalGenius Settings Page Template
 *
 * Minimal settings page per Decision 13.
 * Business type dropdown + location + optional info.
 *
 * @package LocalGenius
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$status = LocalGenius_Admin::get_widget_status();
$homepage_data = get_option( 'localgenius_homepage_data', [] );
$business_name = isset( $homepage_data['business_name'] ) ? $homepage_data['business_name'] : get_bloginfo( 'name' );
$phone = isset( $homepage_data['phone'] ) ? $homepage_data['phone'] : '';
?>

<div class="wrap localgenius-settings">
	<h1 class="localgenius-title">
		<span class="localgenius-logo">LocalGenius</span>
	</h1>

	<div class="localgenius-status-card <?php echo $status['active'] ? 'is-active' : 'is-inactive'; ?>">
		<div class="localgenius-status-indicator"></div>
		<div class="localgenius-status-content">
			<h2><?php echo esc_html( $status['message'] ); ?></h2>
			<?php if ( $status['active'] && $status['stats']['total_questions'] > 0 ) : ?>
				<p class="localgenius-stats">
					<?php
					printf(
						/* translators: 1: total questions, 2: cache rate percentage */
						esc_html__( '%1$d questions answered (%2$d%% instant)', 'localgenius' ),
						$status['stats']['total_questions'],
						$status['stats']['cache_rate']
					);
					?>
					<span class="localgenius-stats-sep">&bull;</span>
					<?php
					printf(
						/* translators: %s: time since last question */
						esc_html__( 'Last activity: %s', 'localgenius' ),
						esc_html( $status['stats']['last_question'] )
					);
					?>
				</p>
			<?php endif; ?>
		</div>
	</div>

	<?php if ( ! empty( $business_name ) || ! empty( $phone ) ) : ?>
		<div class="localgenius-detected-info">
			<h3><?php esc_html_e( 'Detected from your website:', 'localgenius' ); ?></h3>
			<ul>
				<?php if ( ! empty( $business_name ) ) : ?>
					<li><strong><?php esc_html_e( 'Business Name:', 'localgenius' ); ?></strong> <?php echo esc_html( $business_name ); ?></li>
				<?php endif; ?>
				<?php if ( ! empty( $phone ) ) : ?>
					<li><strong><?php esc_html_e( 'Phone:', 'localgenius' ); ?></strong> <?php echo esc_html( $phone ); ?></li>
				<?php endif; ?>
			</ul>
			<p class="description"><?php esc_html_e( 'We use this info to personalize responses and provide a fallback contact method.', 'localgenius' ); ?></p>
		</div>
	<?php endif; ?>

	<form method="post" action="options.php" class="localgenius-form">
		<?php settings_fields( 'localgenius_settings' ); ?>

		<div class="localgenius-form-section">
			<h2><?php esc_html_e( 'Setup Your Widget', 'localgenius' ); ?></h2>
			<p class="localgenius-section-desc"><?php esc_html_e( 'Just two quick questions and your widget will be live.', 'localgenius' ); ?></p>

			<table class="form-table localgenius-form-table" role="presentation">
				<tbody>
					<tr>
						<th scope="row">
							<label for="localgenius_business_type"><?php esc_html_e( 'What type of business are you?', 'localgenius' ); ?></label>
						</th>
						<td>
							<?php LocalGenius_Admin::render_business_type_field(); ?>
						</td>
					</tr>
					<tr>
						<th scope="row">
							<label for="localgenius_location"><?php esc_html_e( 'Where are you located?', 'localgenius' ); ?></label>
						</th>
						<td>
							<?php LocalGenius_Admin::render_location_field(); ?>
						</td>
					</tr>
					<tr>
						<th scope="row">
							<label for="localgenius_additional_info"><?php esc_html_e( 'Anything else we should know?', 'localgenius' ); ?></label>
						</th>
						<td>
							<?php LocalGenius_Admin::render_additional_info_field(); ?>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<?php submit_button( __( 'Save Settings', 'localgenius' ), 'primary localgenius-submit' ); ?>
	</form>

	<?php if ( $status['active'] ) : ?>
		<div class="localgenius-preview-section">
			<h2><?php esc_html_e( 'Widget Preview', 'localgenius' ); ?></h2>
			<p class="description"><?php esc_html_e( 'This is how your widget appears to visitors.', 'localgenius' ); ?></p>

			<div class="localgenius-preview-frame">
				<div class="localgenius-preview-device">
					<div class="localgenius-preview-widget-demo">
						<div class="localgenius-preview-bubble">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="localgenius-preview-icon">
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
							</svg>
						</div>
						<p class="localgenius-preview-note"><?php esc_html_e( 'Widget appears in the bottom-right corner', 'localgenius' ); ?></p>
					</div>
				</div>
			</div>

			<p class="localgenius-preview-cta">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank" class="button">
					<?php esc_html_e( 'View Live Widget', 'localgenius' ); ?>
					<span class="dashicons dashicons-external" style="margin-left: 4px; line-height: 1.5;"></span>
				</a>
			</p>
		</div>
	<?php endif; ?>
</div>
