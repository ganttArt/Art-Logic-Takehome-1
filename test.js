const { describe, test, expect } = require('@jest/globals');
const { encodeChunk, decodeChunk, encode, decode } = require('./encoder');

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

describe('decodeChunk', () => {
    test('should decode all challenge test cases correctly', () => {
        expect(decodeChunk(124807030)).toBe('foo');
        expect(decodeChunk(250662636)).toBe(' foo');
        expect(decodeChunk(267939702)).toBe('foot');
        expect(decodeChunk(251930706)).toBe('BIRD');
        expect(decodeChunk(15794160)).toBe('....');
        expect(decodeChunk(252706800)).toBe('^^^^');
        expect(decodeChunk(266956663)).toBe('Woot');
        expect(decodeChunk(53490482)).toBe('no');
    });

    test('should be inverse of encodeChunk', () => {
        const testStrings = ['test', 'a', 'ab', 'abc', 'abcd', '', 'hello world'];

        testStrings.forEach(str => {
            const chunk = str.substring(0, 4); // Take first 4 chars like encodeChunk does
            const encoded = encodeChunk(chunk);
            const decoded = decodeChunk(encoded);
            expect(decoded).toBe(chunk);
        });
    });
});

describe('encode', () => {
    test('should encode example strings correctly', () => {
        expect(encode('tacocat')).toEqual([267487694, 125043731]);
        expect(encode('never odd or even')).toEqual([267657050, 233917524, 234374596, 250875466, 17830160]);
        expect(encode('lager, sir, is regal')).toEqual([267394382, 167322264, 66212897, 200937635, 267422503]);
        expect(encode('go hang a salami, I\'m a lasagna hog')).toEqual([200319795, 133178981, 234094669, 267441422, 78666124, 99619077, 267653454, 133178165, 124794470]);
        expect(encode('egad, a base tone denotes a bad age')).toEqual([267389735, 82841860, 267651166, 250793668, 233835785, 267665210, 99680277, 133170194, 124782119]);
    });

    test('should handle multiple chunks', () => {
        const result = encode('footBIRD');
        expect(result).toHaveLength(2);
        expect(result[0]).toBe(267939702); // "foot"
        expect(result[1]).toBe(251930706); // "BIRD"
    });

    test('should handle text not divisible by 4', () => {
        const result = encode('hello');
        expect(result).toHaveLength(2);
        // First chunk: "hell", second chunk: "o" (padded with null bytes)
    });

    test('should handle empty string', () => {
        const result = encode('');
        expect(result).toHaveLength(0);
    });
});

describe('decode', () => {
    test('should decode example arrays correctly', () => {
        expect(decode([267487694, 125043731])).toBe('tacocat');
        expect(decode([267657050, 233917524, 234374596, 250875466, 17830160])).toBe('never odd or even');
        expect(decode([267394382, 167322264, 66212897, 200937635, 267422503])).toBe('lager, sir, is regal');
        expect(decode([200319795, 133178981, 234094669, 267441422, 78666124, 99619077, 267653454, 133178165, 124794470])).toBe('go hang a salami, I\'m a lasagna hog');
        expect(decode([267389735, 82841860, 267651166, 250793668, 233835785, 267665210, 99680277, 133170194, 124782119])).toBe('egad, a base tone denotes a bad age');
    });

    test('should handle empty array', () => {
        expect(decode([])).toBe('');
    });

    test('should handle single integer', () => {
        const result = decode([267939702]);
        expect(result).toBe('foot');
    });
});

describe('encode/decode roundtrip', () => {
    test('should be perfect inverses for all test cases', () => {
        const testStrings = [
            'tacocat',
            'never odd or even',
            'lager, sir, is regal',
            'go hang a salami, I\'m a lasagna hog',
            'egad, a base tone denotes a bad age',
            'hello world',
            'a',
            'ab',
            'abc',
            'abcd',
            'abcde',
            '',
            'The quick brown fox jumps over the lazy dog',
            '1234567890',
            '!@#$%^&*()_+-=[]{}|;:,.<>?',
        ];

        testStrings.forEach(original => {
            const encoded = encode(original);
            const decoded = decode(encoded);
            expect(decoded).toBe(original);
        });
    });
});
