const fs = require('fs');
const csv = require('csv-parser');

const sourceFile = 'input_countries.csv';
const canadaOutput = 'canada.txt';
const usaOutput = 'usa.txt';

// a:: Checking and removing existing output files
if (fs.existsSync(canadaOutput)) {
    fs.unlinkSync(canadaOutput);
    console.log(`Removed old file: ${canadaOutput}`);
}

if (fs.existsSync(usaOutput)) {
    fs.unlinkSync(usaOutput);
    console.log(`Removed old file: ${usaOutput}`);
}

// b: Stream CSV data and filter records
const fileStream = fs.createReadStream(sourceFile);
const canadaStream = fs.createWriteStream(canadaOutput);
const usaStream = fs.createWriteStream(usaOutput);

// adding headers
canadaStream.write('Country   , Year   , Population\n');
usaStream.write('Country   , Year   , Population\n');

fileStream
    .pipe(csv())
    .on('data', (record) => {
        let countryName = record.country.trim().toLowerCase();
        let rowData = `${record.country.padEnd(10)}, ${record.year.padEnd(6)}, ${record.population}\n`;

        if (countryName === 'canada') {
            canadaStream.write(rowData);
        } else if (countryName === 'united states') {
            usaStream.write(rowData);
        }
    })
    .on('end', () => {
        console.log('Finished processing CSV data.');
        canadaStream.end();
        usaStream.end();
    });
