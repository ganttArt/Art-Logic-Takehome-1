#!/usr/bin/env node

const fs = require('fs');
const { encode, decode } = require('./encoder');

/**
 * Command-line interface for the Weird Text Format encoder/decoder.
 * 
 * Usage:
 *   node cli.js encode "text to encode"
 *   node cli.js decode "[123, 456, 789]"
 *   node cli.js encode -f input.txt
 *   node cli.js decode -f encoded.json
 */

function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (command !== 'encode' && command !== 'decode') {
        console.error('Error: Command must be either "encode" or "decode"');
        process.exit(1);
    }

    let input;

    // Check if reading from file
    if (args.includes('-f')) {
        const fileIndex = args.indexOf('-f');
        const filename = args[fileIndex + 1];

        if (!filename) {
            console.error('Error: No filename provided for -f option');
            process.exit(1);
        }

        try {
            input = fs.readFileSync(filename, 'utf8').trim();
        } catch (error) {
            console.error(`Error reading file ${filename}:`, error.message);
            process.exit(1);
        }
    }
    // Read from command line argument
    else {
        input = args[1];

        if (!input) {
            console.error(`Error: No ${command === 'encode' ? 'text' : 'encoded array'} provided`);
            process.exit(1);
        }
    }

    try {
        if (command === 'encode') {
            const result = encode(input);
            console.log(JSON.stringify(result));
        } else {
            // Parse the input as JSON array
            let encodedArray;
            try {
                encodedArray = JSON.parse(input);
            } catch (parseError) {
                console.error('Error: Invalid JSON format for encoded array');
                console.error('Expected format: [123, 456, 789]');
                process.exit(1);
            }

            if (!Array.isArray(encodedArray)) {
                console.error('Error: Input must be an array of integers');
                process.exit(1);
            }

            const result = decode(encodedArray);
            console.log(result);
        }
    } catch (error) {
        console.error(`Error during ${command}:`, error.message);
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled error:', error.message);
    process.exit(1);
});

if (require.main === module) {
    main();
}

module.exports = { main };
