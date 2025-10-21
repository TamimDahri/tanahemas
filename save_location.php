<?php
header('Content-Type: application/json');

// File to store coordinates
$file = 'locations.json';

// Get JSON from request
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['lat']) || !isset($input['lng'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

// Read existing data
$data = [];
if (file_exists($file)) {
    $data = json_decode(file_get_contents($file), true);
    if (!is_array($data)) $data = [];
}

// Add new entry
$newEntry = [
    'lat' => floatval($input['lat']),
    'lng' => floatval($input['lng']),
    'name' => $input['name'] ?? 'Unnamed Lot',
    'time' => date('Y-m-d H:i:s')
];

$data[] = $newEntry;

// Save back to file
if (file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true, 'message' => 'Saved successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save']);
}
?>
