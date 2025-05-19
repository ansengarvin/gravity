/*
    TypeScript implementation of Xoshiro128++ RNG.
    Source:
        https://prng.di.unimi.it/xoshiro128plusplus.c
    I was going to use Xoshiro256++, but JS doesn't support some important bitwise operation on big integers.
    The drawbacks to using 128++ largely affect large-scale parallelism, which is not a problem for this application.
*/

export class RngState {
    private state: Uint32Array;

    constructor(seed: number) {}

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

    private jump() {
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

    private longJump() {
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

    // See: https://prng.di.unimi.it/splitmix64.c
    private splitMix64(x: bigint): number {
        let z: bigint = (x += 0x9e3779b97f4a7c15n);
        z = (z ^ (z >> BigInt(30))) * 0xbf58476d1ce4e5b9n;
        z = (z ^ (z >> BigInt(27))) * 0x94d049bb133111ebn;
        z = z ^ (z >> BigInt(31));
        z = z >> BigInt(32);
        return this.upper32Bits(z);
    }

    /**
     * For Xoshiro to work, it's vitally important that all numbers are unsigned 32 bit integers.
     * It's advised to always end bit-wise operations with >>> 0 to convert them back into unsigned bits.
     * Source: https://stackoverflow.com/questions/6798111/bitwise-operations-on-32-bit-unsigned-ints
     */
    private toUint32(n: number) {
        return n >>> 0;
    }

    private upper32Bits(x: bigint): number {
        return Number((x >> 32n) & 0xffffffffn);
    }

    private stringToUtf8Bytes(str: string) {
        return new TextEncoder().encode(str);
    }

    // See: https://en.wikipedia.org/wiki/MD5
    private MD5(message: string): Uint32Array {
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
            K[i] = Math.floor(Math.pow(2, 32) * Math.abs(Math.sin(i + 1)));
        }

        // Initialize variables
        let a0 = 0x67452301;
        let b0 = 0xefcdab89;
        let c0 = 0x98badcfe;
        let d0 = 0x10325476;

        // Append 1 bit to message

        return result;
    }
}
