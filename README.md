# Art+Logic Programming Challenge - Weird Text Format Encoder

## Problem

Encode bundles of 4 characters by scrambling them into 32-bit integer values using a specific bit interleaving pattern.

## Solution

The algorithm takes 4 characters, converts them to bytes, and rearranges the bits using an interleaving pattern where bits from each byte are placed at positions: `bit_position * 4 + byte_index`.

## Setup

```bash
npm install
```

## Tests

```bash
npm test
```
