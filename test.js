const { describe, test, expect } = require('@jest/globals');
const { encodeChunk, encodeText } = require('./encoder');

describe('encodeChunk', () => {
    test('should encode all challenge test cases correctly', () => {
        expect(encodeChunk('foo')).toBe(124807030);
        expect(encodeChunk(' foo')).toBe(250662636);
        expect(encodeChunk('foot')).toBe(267939702);
        expect(encodeChunk('BIRD')).toBe(251930706);
        expect(encodeChunk('....')).toBe(15794160);
        expect(encodeChunk('^^^^')).toBe(252706800);
        expect(encodeChunk('Woot')).toBe(266956663);
        expect(encodeChunk('no')).toBe(53490482);
    });

    test('should handle empty string', () => {
        const result = encodeChunk('');
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThanOrEqual(0);
    });

    test('should handle single character', () => {
        const result = encodeChunk('A');
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThanOrEqual(0);
    });

    test('should handle strings longer than 4 characters by truncating', () => {
        const result1 = encodeChunk('foot');
        const result2 = encodeChunk('footer');
        // Both should produce the same result since 'footer' is truncated to 'foot'
        expect(result1).toBe(result2);
    });

    test('should pad short strings with null characters', () => {
        // "no" should be equivalent to "no\0\0" after padding
        const result = encodeChunk('no');
        expect(result).toBe(53490482);
    });
});

describe('encodeText', () => {
    test('should encode multiple chunks', () => {
        const result = encodeText('footBIRD');
        expect(result).toHaveLength(2);
        expect(result[0]).toBe(267939702); // "foot"
        expect(result[1]).toBe(251930706); // "BIRD"
    });

    test('should handle text not divisible by 4', () => {
        const result = encodeText('hello');
        expect(result).toHaveLength(2);
        // First chunk: "hell", second chunk: "o" (padded with null bytes)
    });

    test('should handle empty string', () => {
        const result = encodeText('');
        expect(result).toHaveLength(0);
    });
});
