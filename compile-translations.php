<?php

/**
 * Compile PO files to MO files
 *
 * This script compiles all .po files in the languages directory to .mo files
 */

require_once __DIR__ . '/vendor/autoload.php';

use Sepia\PoParser\Parser;
use Sepia\PoParser\SourceHandler\FileSystem;

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

		// Parse PO file
		$parser = new Parser(new FileSystem($poFile));
		$catalog = $parser->parse();

		// Compile to MO
		$compiler = new Sepia\PoParser\PoCompiler();
		file_put_contents($moFile, $compiler->compile($catalog));
		echo "  ✓ Successfully compiled\n";
	} catch (Exception $e) {
		echo "  ✗ Error: " . $e->getMessage() . "\n";
	}
}

echo "\nDone!\n";
