<?php
/**
 * Compass Event Ingestion Endpoint
 *
 * Receives event data via HTTP POST and stores in SQLite database.
 * Validates all inputs and rejects PII.
 *
 * Usage:
 *   curl -X POST http://localhost/compass/src/ingest.php \
 *     -H "Content-Type: application/json" \
 *     -d '{"product":"pinned","event":"note_created","user_hash":"abc123...","timestamp":"2026-04-16T10:00:00Z","properties":{},"revenue_cents":0}'
 */

header('Content-Type: application/json');

// Error logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Get database path from environment or use default
$db_path = getenv('COMPASS_DB_PATH');
if (!$db_path) {
    $db_path = dirname(__DIR__) . '/db/compass.db';
}

// Valid products
$valid_products = ['pinned', 'dash', 'localgenius', 'shipyard', 'great-minds'];

// Load events configuration
$events_config = json_decode(file_get_contents(dirname(__DIR__) . '/config/events.json'), true);
if (!$events_config) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load events configuration']);
    exit;
}

/**
 * Validate request and return parsed data or error
 */
function validate_request($events_config, $valid_products) {
    // Check Content-Type
    $content_type = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
    if (strpos($content_type, 'application/json') === false) {
        return ['error' => 'Content-Type must be application/json', 'code' => 400];
    }

    // Parse JSON body
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['error' => 'Invalid JSON: ' . json_last_error_msg(), 'code' => 400];
    }

    // Validate required fields
    $required_fields = ['product', 'event', 'user_hash', 'timestamp'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            return ['error' => "Missing required field: $field", 'code' => 400];
        }
    }

    // Validate product
    if (!in_array($data['product'], $valid_products)) {
        return ['error' => 'Invalid product. Must be one of: ' . implode(', ', $valid_products), 'code' => 400];
    }

    // Validate event exists in config for this product
    $product_events = $events_config[$data['product']] ?? [];
    $event_exists = false;
    foreach ($product_events as $event_def) {
        if ($event_def['event'] === $data['event']) {
            $event_exists = true;
            break;
        }
    }

    if (!$event_exists) {
        return ['error' => "Invalid event '{$data['event']}' for product '{$data['product']}'", 'code' => 400];
    }

    // Validate user_hash format (SHA-256 = 64 hex characters)
    if (!preg_match('/^[a-f0-9]{64}$/i', $data['user_hash'])) {
        return ['error' => 'Invalid user_hash format. Must be 64 hex characters (SHA-256)', 'code' => 400];
    }

    // Validate timestamp format (ISO 8601)
    $timestamp = $data['timestamp'];
    if (!preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/', $timestamp)) {
        return ['error' => 'Invalid timestamp format. Must be ISO 8601 (e.g., 2026-04-16T10:00:00Z)', 'code' => 400];
    }

    // Check for PII patterns in properties
    $properties = $data['properties'] ?? [];
    $properties_json = json_encode($properties);

    // Reject if email pattern detected
    if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $properties_json)) {
        error_log("Compass: PII rejected - email pattern detected in event");
        return ['error' => 'PII detected: email addresses not allowed', 'code' => 400];
    }

    // Reject if phone pattern detected
    if (preg_match('/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/', $properties_json)) {
        error_log("Compass: PII rejected - phone pattern detected in event");
        return ['error' => 'PII detected: phone numbers not allowed', 'code' => 400];
    }

    // Check for suspicious PII field names
    $pii_fields = ['email', 'phone', 'address', 'ssn', 'name', 'ip_address', 'ip'];
    foreach ($properties as $key => $value) {
        $key_lower = strtolower($key);
        foreach ($pii_fields as $pii_field) {
            if (strpos($key_lower, $pii_field) !== false) {
                error_log("Compass: PII rejected - suspicious field name: $key");
                return ['error' => "PII detected: field name '$key' not allowed", 'code' => 400];
            }
        }
    }

    // Set defaults
    $data['properties'] = $properties;
    $data['revenue_cents'] = isset($data['revenue_cents']) ? (int)$data['revenue_cents'] : 0;

    return ['data' => $data];
}

/**
 * Insert event into database
 */
function insert_event($db_path, $data) {
    try {
        $db = new SQLite3($db_path);
        $db->busyTimeout(5000); // Wait up to 5 seconds for locks

        $stmt = $db->prepare('
            INSERT INTO events (product, event, user_hash, timestamp, properties_json, revenue_cents)
            VALUES (:product, :event, :user_hash, :timestamp, :properties_json, :revenue_cents)
        ');

        $stmt->bindValue(':product', $data['product'], SQLITE3_TEXT);
        $stmt->bindValue(':event', $data['event'], SQLITE3_TEXT);
        $stmt->bindValue(':user_hash', $data['user_hash'], SQLITE3_TEXT);
        $stmt->bindValue(':timestamp', $data['timestamp'], SQLITE3_TEXT);
        $stmt->bindValue(':properties_json', json_encode($data['properties']), SQLITE3_TEXT);
        $stmt->bindValue(':revenue_cents', $data['revenue_cents'], SQLITE3_INTEGER);

        $result = $stmt->execute();
        $event_id = $db->lastInsertRowID();
        $db->close();

        return ['event_id' => $event_id];

    } catch (Exception $e) {
        error_log("Compass: Database error - " . $e->getMessage());
        return ['error' => 'Database error', 'code' => 500];
    }
}

// Main execution
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit;
}

// Validate request
$validation = validate_request($events_config, $valid_products);
if (isset($validation['error'])) {
    http_response_code($validation['code']);
    echo json_encode(['error' => $validation['error']]);
    exit;
}

// Insert event
$result = insert_event($db_path, $validation['data']);
if (isset($result['error'])) {
    http_response_code($result['code']);
    echo json_encode(['error' => $result['error']]);
    exit;
}

// Success
http_response_code(200);
echo json_encode([
    'success' => true,
    'event_id' => $result['event_id'],
    'message' => 'Event recorded successfully'
]);
