/**
 * Encodes a 4-character string into a 32-bit integer using bit interleaving.
 */
function encodeChunk(input) {
    // Pad input to exactly 4 characters
    const paddedInput = (input + '\0\0\0\0').substring(0, 4);

    // Convert to bytes
    const bytes = [];
    for (let i = 0; i < 4; i++) {
        bytes[i] = paddedInput.charCodeAt(i);
    }

    // Create 32-bit value
    const rawValue =
        (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];

    const inputBytes = [
        rawValue & 0xff,
        (rawValue >> 8) & 0xff,
        (rawValue >> 16) & 0xff,
        (rawValue >> 24) & 0xff,
    ];

    let encoded = 0;

    // Bit interleaving: output_position = bit_position * 4 + byte_index
    for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
        for (let byteIndex = 0; byteIndex < 4; byteIndex++) {
            const bit = (inputBytes[byteIndex] >> bitPosition) & 1;
            const outputPosition = bitPosition * 4 + byteIndex;
            encoded |= bit << outputPosition;
        }
    }

    return encoded >>> 0;
}

/**
 * Decodes a 32-bit integer back into a 4-character string using bit de-interleaving.
 */
function decodeChunk(encoded) {
    // Ensure we're working with a 32-bit unsigned integer
    encoded = encoded >>> 0;

    const outputBytes = [0, 0, 0, 0];

    // Reverse the bit interleaving: output_position = bit_position * 4 + byte_index
    for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
        for (let byteIndex = 0; byteIndex < 4; byteIndex++) {
            const outputPosition = bitPosition * 4 + byteIndex;
            const bit = (encoded >> outputPosition) & 1;
            outputBytes[byteIndex] |= bit << bitPosition;
        }
    }

    // Convert back to 32-bit value in little-endian format
    const rawValue =
        (outputBytes[3] << 24) | (outputBytes[2] << 16) | (outputBytes[1] << 8) | outputBytes[0];

    // Extract the original bytes
    const originalBytes = [
        rawValue & 0xff,
        (rawValue >> 8) & 0xff,
        (rawValue >> 16) & 0xff,
        (rawValue >> 24) & 0xff,
    ];

    // Convert bytes back to characters
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += String.fromCharCode(originalBytes[i]);
    }

    // Remove null padding characters
    return result.replace(/\0+$/, '');
}

/**
 * Encodes text by processing it in 4-character chunks.
 */
function encode(text) {
    const results = [];
    for (let i = 0; i < text.length; i += 4) {
        const chunk = text.substring(i, i + 4);
        results.push(encodeChunk(chunk));
    }
    return results;
}

/**
 * Decodes an array of integers back into the original text string.
 */
function decode(encodedArray) {
    let result = '';
    for (const encoded of encodedArray) {
        result += decodeChunk(encoded);
    }
    return result;
}

module.exports = {
    encodeChunk,
    decodeChunk,
    encode,
    decode,
};
