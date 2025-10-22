<?php

/**
 * Compile PO files to MO files
 *
 * This script compiles all .po files in the languages directory to .mo files
 */

require_once __DIR__ . '/vendor/autoload.php';

use Gettext\Translations;
use Gettext\Generators\Mo;

$languagesDir = __DIR__ . '/languages';

// Get all .po files
$poFiles = glob($languagesDir . '/*.po');

if (empty($poFiles)) {
	echo "No .po files found in languages directory.\n";
	exit(1);
}

foreach ($poFiles as $poFile) {
	$moFile = str_replace('.po', '.mo', $poFile);

	try {
		echo "Compiling: " . basename($poFile) . " -> " . basename($moFile) . "\n";

		// Load PO file
		$translations = Translations::fromPoFile($poFile);

		// Generate MO file
		$translations->toMoFile($moFile);

		echo "  ✓ Successfully compiled (" . filesize($moFile) . " bytes)\n";
	} catch (Exception $e) {
		echo "  ✗ Error: " . $e->getMessage() . "\n";
	}
}

echo "\nDone!\n";
