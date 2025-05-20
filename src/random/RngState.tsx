/*
    TypeScript implementation of Xoshiro128++ RNG.
    Source:
        https://prng.di.unimi.it/xoshiro128plusplus.c
    I was going to use Xoshiro256++, but JS doesn't support some important bitwise operation on big integers.
    The drawbacks to using 128++ largely affect large-scale parallelism, which is not a problem for this application.
*/

export class RngState {
    private state: Uint32Array;

    constructor(seed: string) {
        this.state = new Uint32Array(4);
        const md5 = MD5(seed);
        const sm64 = new SplitMix64(BigInt("0x" + md5));
        this.state[0] = sm64.next32();
        this.state[1] = sm64.next32();
        this.state[2] = sm64.next32();
        this.state[3] = sm64.next32();
    }

    private rotl(x: number, k: number): number {
        return this.toUint32((x << k) | (x >>> (32 - k)));
    }

    private next() {
        const result = this.toUint32(this.toUint32(this.rotl(this.state[0] + this.state[3], 7)) + this.state[0]);

        const t = this.toUint32(this.state[1] << 9);

        this.state[2] = this.toUint32(this.state[2] ^ this.state[0]);
        this.state[3] = this.toUint32(this.state[3] ^ this.state[1]);
        this.state[1] = this.toUint32(this.state[1] ^ this.state[2]);
        this.state[0] = this.toUint32(this.state[0] ^ this.state[3]);

        this.state[2] = this.toUint32(this.state[2] ^ t);

        this.state[3] = this.toUint32(this.rotl(this.state[3], 11));

        return result;
    }

    public jump() {
        const JUMP = new Uint32Array([0x8764000b, 0xf542d2d3, 0x6fa035c3, 0x77f2db5b]);

        let s0 = 0;
        let s1 = 0;
        let s2 = 0;
        let s3 = 0;
        for (let i = 0; i < JUMP.length; i++) {
            for (let b = 0; b < 32; b++) {
                // No need for UINT32_C(1) because JS converts it under the hood.
                if (JUMP[i] & (1 << b)) {
                    s0 ^= this.state[0];
                    s1 ^= this.state[1];
                    s2 ^= this.state[2];
                    s3 ^= this.state[3];
                }
                this.next();
            }
        }

        this.state[0] = this.toUint32(s0);
        this.state[1] = this.toUint32(s1);
        this.state[2] = this.toUint32(s2);
        this.state[3] = this.toUint32(s3);
    }

    public longJump() {
        const LONG_JUMP = new Uint32Array([0xb523952e, 0x0b6f099f, 0xccf5a0ef, 0x1c580662]);

        let s0 = 0;
        let s1 = 0;
        let s2 = 0;
        let s3 = 0;
        for (let i = 0; i < LONG_JUMP.length; i++) {
            for (let b = 0; b < 32; b++) {
                if (LONG_JUMP[i] & (1 << b)) {
                    s0 ^= this.state[0];
                    s1 ^= this.state[1];
                    s2 ^= this.state[2];
                    s3 ^= this.state[3];
                }
                this.next();
            }
        }

        this.state[0] = this.toUint32(s0);
        this.state[1] = this.toUint32(s1);
        this.state[2] = this.toUint32(s2);
        this.state[3] = this.toUint32(s3);
    }

    /**
     *
     * @param min Minimum value, inclusive
     * @param max Maximum value, inclusive
     * @returns A number between [min, max]
     */
    public getRandomF32(min: number, max: number): number {
        return (this.next() / 0xffffffff) * (max - min) + min;
    }

    /**
     *
     * @param min Minimum value, inclusive
     * @param max Maximum value, inclusive
     * @returns An integer between [min, max]
     */
    public getRandomI32(min: number, max: number): number {
        max = max + 1;
        return Math.floor(this.getRandomF32(min, max));
    }

    // See: https://prng.di.unimi.it/splitmix64.c

    /**
     * For Xoshiro to work, it's vitally important that all numbers are unsigned 32 bit integers.
     * It's advised to always end bit-wise operations with >>> 0 to convert them back into unsigned bits.
     * Source: https://stackoverflow.com/questions/6798111/bitwise-operations-on-32-bit-unsigned-ints
     */
    private toUint32(n: number) {
        return n >>> 0;
    }
}

export class SplitMix64 {
    private x: bigint;

    constructor(seed: bigint) {
        this.x = seed;
    }

    private upper32Bits(x: bigint): number {
        return Number((x >> 32n) & 0xffffffffn);
    }

    public next(): bigint {
        this.x += 0x9e3779b97f4a7c15n;
        let z: bigint = (this.x += 0x9e3779b97f4a7c15n);
        z = (z ^ (z >> BigInt(30))) * 0xbf58476d1ce4e5b9n;
        z = (z ^ (z >> BigInt(27))) * 0x94d049bb133111ebn;
        z = z ^ (z >> BigInt(31));
        z = z >> BigInt(32);
        return z;
    }

    public next32(): number {
        return this.upper32Bits(this.next());
    }
}

function stringToUtf8Bytes(str: string) {
    return new TextEncoder().encode(str);
}

function toUint32(n: number) {
    return n >>> 0;
}

function rotl(x: number, k: number): number {
    return toUint32((x << k) | (x >>> (32 - k)));
}

function MD5(message: string) {
    const result = new Uint32Array(4);

    // All variables are unsigned 32 bit integers and wrap modulo 2^32 when calculating
    const s = new Uint32Array(64);
    const K = new Uint32Array(64);

    // S specifies the per-shift amounts
    const s_0_15 = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22];
    const s_16_32 = [5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20];
    const s_32_47 = [4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23];
    const s_48_63 = [6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
    s.set(s_0_15, 0);
    s.set(s_16_32, 16);
    s.set(s_32_47, 32);
    s.set(s_48_63, 48);

    // Use binary integer part of the sines of integers (Radians) as constants
    for (let i = 0; i < 64; i++) {
        K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0;
    }

    // Initialize variables
    let a0 = 0x67452301;
    let b0 = 0xefcdab89;
    let c0 = 0x98badcfe;
    let d0 = 0x10325476;

    // Convert string to byte array and append 1 bit
    const bytes = stringToUtf8Bytes(message);

    const initialPadded = new Uint8Array(bytes.length + 1);
    initialPadded.set(bytes);
    initialPadded[bytes.length] = 0x80; // Append a single '1' bit (followed by 0 bits)

    // Append 0 bits until length is 448 mod 512 (e.g. 56 bytes)
    const finalBlockLength = initialPadded.length % 64;
    const numBytesToAdd = finalBlockLength > 56 ? 120 - finalBlockLength : 56 - finalBlockLength;
    const zeroesPadded = new Uint8Array(initialPadded.length + numBytesToAdd);
    zeroesPadded.set(initialPadded);

    for (let i = 0; i < numBytesToAdd; i++) {
        zeroesPadded[initialPadded.length + i] = 0x00;
    }

    // Add original length as 8 bytes at the end
    const finalPadded = new Uint8Array(zeroesPadded.length + 8);
    finalPadded.set(zeroesPadded);
    // MDA calls for modulo of 2^64, but my messages will never be anywhere close to that long.
    // Conversion to bigint is mandatory - JS only uses 32 bytes, but we need 64 to fit neeatly into the remaining 8 bytes.
    const originalLengthInBits = BigInt(bytes.length * 8);

    for (let i = 0; i < 8; i++) {
        // MD5 calls for little-endian order
        finalPadded[zeroesPadded.length + i] = Number(originalLengthInBits >> BigInt(8 * i)) & 0xff;
    }

    for (let i = 0; i < finalPadded.length / 64; i++) {
        const M = new Uint32Array(16);
        for (let j = 0; j < 16; j++) {
            M[j] = 0;
            for (let k = 0; k < 4; k++) {
                M[j] |= finalPadded[i * 64 + j * 4 + k] << (k * 8);
            }
        }

        let A = a0;
        let B = b0;
        let C = c0;
        let D = d0;

        for (let j = 0; j < 64; j++) {
            let F = 0;
            let g = 0;

            if (j < 16) {
                F = (B & C) | (~B & D);
                g = j;
            } else if (j < 32) {
                F = (D & B) | (~D & C);
                g = (5 * j + 1) % 16;
            } else if (j < 48) {
                F = B ^ C ^ D;
                g = (3 * j + 5) % 16;
            } else {
                F = C ^ (B | ~D);
                g = (7 * j) % 16;
            }
            F = F + A + K[j] + M[g];
            A = D;
            D = C;
            C = B;
            B = B + rotl(F, s[j]);
        }

        a0 = (a0 + A) >>> 0;
        b0 = (b0 + B) >>> 0;
        c0 = (c0 + C) >>> 0;
        d0 = (d0 + D) >>> 0;
    }

    // Output
    result[0] = a0;
    result[1] = b0;
    result[2] = c0;
    result[3] = d0;

    let hex = "";
    for (let i = 0; i < result.length; i++) {
        const word = result[i];
        hex += ((word >> 0) & 0xff).toString(16).padStart(2, "0");
        hex += ((word >> 8) & 0xff).toString(16).padStart(2, "0");
        hex += ((word >> 16) & 0xff).toString(16).padStart(2, "0");
        hex += ((word >> 24) & 0xff).toString(16).padStart(2, "0");
    }

    return hex;
}
