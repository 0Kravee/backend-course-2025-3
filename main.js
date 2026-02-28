const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .option('-i, --input <path>', 'path to input JSON file')
  .option('-o, --output <path>', 'path to output file')
  .option('-d, --display', 'display result in console')
  .option('-c, --cylinders', 'display number of cylinders')
  .option('-m, --mpg <value>', 'show only cars with mpg below specified value', parseFloat)
  .parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

const inputPath = path.resolve(options.input);
if (!fs.existsSync(inputPath)) {
  console.error('Cannot find input file');
  process.exit(1);
}

const rawData = fs.readFileSync(inputPath, 'utf-8');
const data = rawData
  .split('\n')
  .filter(line => line.trim() !== '')
  .map(line => JSON.parse(line));

let result = data;
if (options.mpg !== undefined) {
  result = result.filter(car => car.mpg < options.mpg);
}

const lines = result.map(car => {
  let parts = [car.model];
  if (options.cylinders) {
    parts.push(car.cyl);
  }
  parts.push(car.mpg);
  return parts.join(' ');
});

const output = lines.join('\n');

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
