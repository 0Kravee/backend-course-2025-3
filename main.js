const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .option('-i, --input <path>', 'path to input JSON file')
  .option('-o, --output <path>', 'path to output file')
  .option('-d, --display', 'display result in console')
  .parse(process.argv);

const options = program.opts();

// Check required parameter
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Check if input file exists
const inputPath = path.resolve(options.input);
if (!fs.existsSync(inputPath)) {
  console.error('Cannot find input file');
  process.exit(1);
}

// Read and parse NDJSON (one JSON object per line)
const rawData = fs.readFileSync(inputPath, 'utf-8');
const data = rawData
  .split('\n')
  .filter(line => line.trim() !== '')
  .map(line => JSON.parse(line));

// Format output - just stringify for now
const output = JSON.stringify(data, null, 2);

// Output handling
if (!options.output && !options.display) {
  process.exit(0);
}

if (options.display) {
  console.log(output);
}

if (options.output) {
  const outputPath = path.resolve(options.output);
  fs.writeFileSync(outputPath, output, 'utf-8');
}
