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
 * Encodes text by processing it in 4-character chunks.
 */
function encodeText(text) {
    const results = [];
    for (let i = 0; i < text.length; i += 4) {
        const chunk = text.substring(i, i + 4);
        results.push(encodeChunk(chunk));
    }
    return results;
}

module.exports = {
    encodeChunk,
    encodeText,
};
