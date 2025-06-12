import { vec3, vec4 } from "gl-matrix";
import { LeaderboardBody } from "../../redux/informationSlice";
import { UniverseSettings } from "../../redux/universeSettingsSlice";
import { HSLtoRGB } from "../colors/colorConversions";
import { MassThresholds } from "../defines/physics";
import { RngState } from "../../random/RngState";
import { removeFromArray } from "../ds/arrays";

const G = 4 * Math.PI * Math.PI; // Gravitational constant for 1yr, 1AU, 1 solar mass

export class Universe {
    public settings: UniverseSettings;
    private rng: RngState;

    // Uint8Array and Float32Array are guaranteed to be contiguous in memory, which makes them more performant (cache locality).
    public bodiesActive: Uint8Array;

    public positionsX: Float32Array;
    public positionsY: Float32Array;
    public positionsZ: Float32Array;
    public velocitiesX: Float32Array;
    public velocitiesY: Float32Array;
    public velocitiesZ: Float32Array;
    public accelerationsX: Float32Array;
    public accelerationsY: Float32Array;
    public accelerationsZ: Float32Array;
    public angularVelocities: Float32Array; // Angular velocities for rotation
    public axialTilts: Float32Array;
    public masses: Float32Array;
    public radii: Float32Array;
    public colorsR: Float32Array;
    public colorsG: Float32Array;
    public colorsB: Float32Array;
    public numActive: number;
    public orbitalIndices: Float32Array;
    public orbitalDistances: Float32Array;
    public numSattelites: Float32Array;
    public stars: Float32Array;
    public numStars: number;
    public temperatures: Float32Array;
    public timeElapsed: number;
    public centerStar: number | null;
    public numFeatureChannels: number;
    public planetFeatureTextureData: Uint8Array; // Placeholder for planet feature texture data

    constructor(settings: UniverseSettings) {
        this.settings = settings;
        this.rng = new RngState(this.settings.seed);

        this.bodiesActive = new Uint8Array(this.settings.numBodies);
        this.positionsX = new Float32Array(this.settings.numBodies);
        this.positionsY = new Float32Array(this.settings.numBodies);
        this.positionsZ = new Float32Array(this.settings.numBodies);

        this.velocitiesX = new Float32Array(this.settings.numBodies);
        this.velocitiesY = new Float32Array(this.settings.numBodies);
        this.velocitiesZ = new Float32Array(this.settings.numBodies);

        this.accelerationsX = new Float32Array(this.settings.numBodies);
        this.accelerationsY = new Float32Array(this.settings.numBodies);
        this.accelerationsZ = new Float32Array(this.settings.numBodies);

        this.angularVelocities = new Float32Array(this.settings.numBodies);
        this.axialTilts = new Float32Array(this.settings.numBodies);

        this.masses = new Float32Array(this.settings.numBodies);
        this.radii = new Float32Array(this.settings.numBodies);
        this.temperatures = new Float32Array(this.settings.numBodies);

        this.colorsR = new Float32Array(this.settings.numBodies);
        this.colorsG = new Float32Array(this.settings.numBodies);
        this.colorsB = new Float32Array(this.settings.numBodies);

        // Stores the index of the body that each body orbits
        this.orbitalIndices = new Float32Array(this.settings.numBodies);
        this.orbitalDistances = new Float32Array(this.settings.numBodies);
        this.numSattelites = new Float32Array(this.settings.numBodies);

        this.stars = new Float32Array(this.settings.numBodies);
        this.numStars = 0;

        this.numActive = this.settings.numBodies;
        this.timeElapsed = 0;
        this.centerStar = null;

        this.numFeatureChannels = 4;
        this.planetFeatureTextureData = new Uint8Array(this.settings.numBodies * 4 * this.numFeatureChannels);

        this.initialize();
    }

    public radius_from_mass(mass: number): number {
        // The radius to mass ratio is extremely unrealistic for this simulation.
        // If it weren't, we wouldn't be able to see most of the bodies.
        return Math.pow(mass, 1 / 3) * 0.1;
        //return 1;
    }

    public radius_from_mass_piecewise(mass: number): number {
        function f(x: number): number {
            return 800 * x + 0.005;
        }

        function g(x: number): number {
            return 1.8 * (x - MassThresholds.GAS_GIANT) + f(MassThresholds.GAS_GIANT);
        }

        function h(x: number): number {
            return 0.45 * (x - MassThresholds.BROWN_DWARF) + g(MassThresholds.BROWN_DWARF);
        }

        function j(x: number): number {
            return 0.025 * (x - MassThresholds.STAR) + h(MassThresholds.STAR);
        }

        function k(x: number): number {
            return 0.156 * (Math.pow(x, 0.57) - MassThresholds.SOLAR) + j(MassThresholds.SOLAR);
        }

        if (mass <= MassThresholds.GAS_GIANT) {
            return f(mass);
        } else if (mass <= MassThresholds.BROWN_DWARF) {
            return g(mass);
        } else if (mass <= MassThresholds.STAR) {
            return h(mass);
        } else if (mass <= MassThresholds.SOLAR) {
            return j(mass);
        } else {
            return k(mass);
        }
    }

    public radius_from_mass_B(mass: number): number {
        const earthMassInSolarMasses = 3.003e-6;
        const jupiterMassInSolarMasses = 0.0009543;
        const earthRadiusAU = 4.2635e-5;
        const jupiterRadiusAU = 0.0004778945;
        const sunRadiusAU = 0.00465047;

        if (mass < 0.003) {
            const massInEarthMasses = mass / earthMassInSolarMasses;
            const radiusInEarthRadii = Math.pow(massInEarthMasses, 0.28);
            return radiusInEarthRadii * earthRadiusAU * 2.5; // mild exaggeration
        } else if (mass < 0.08) {
            const massInJupiterMasses = mass / jupiterMassInSolarMasses;
            const radiusInJupiterRadii = 1.0 - 0.035 * Math.log10(massInJupiterMasses);
            return radiusInJupiterRadii * jupiterRadiusAU * 2; // slight boost
        } else {
            const radiusInSolarRadii = Math.pow(mass, 0.8);
            return radiusInSolarRadii * sunRadiusAU * 1.25; // subtle boost
        }
    }

    public initialize(): void {
        this.numActive = this.settings.numBodies;
        // Seed the random number generator with the provided seed
        const min_position = (-1.0 * this.settings.size) / 2;
        const max_position = this.settings.size / 2;

        // Velocities are in astronomical units per year
        // For reference, the Earth's total velocity is about 6.283 AU/year.
        // const min_velocity = 0.0;
        // const max_velocity = 3;

        for (let i = 0; i < this.settings.numBodies; i++) {
            const pos = this.getRandomDiskStartingPosition(min_position, max_position);
            this.positionsX[i] = pos.x;
            this.positionsY[i] = pos.y;
            this.positionsZ[i] = pos.z;

            const initialAngularVelocity = this.getInitialVelocityKepler(
                this.positionsX[i],
                this.positionsY[i],
                this.positionsZ[i],
                this.settings.starInCenter ? this.settings.centerStarMass : 1,
            );
            this.velocitiesX[i] = initialAngularVelocity.vX;
            this.velocitiesY[i] = initialAngularVelocity.vY;
            this.velocitiesZ[i] = initialAngularVelocity.vZ;

            this.bodiesActive[i] = 1;

            //this.masses[i] = this.rng.getRandomF32(this.settings.minMass, this.settings.maxMass);
            this.masses[i] = this.rng.getPowerLawF32(
                this.settings.minMass,
                this.settings.maxMass,
                this.settings.massBiasExponent,
            );
            this.radii[i] = this.radius_from_mass_piecewise(this.masses[i]);

            // Get rotation
            this.angularVelocities[i] = this.getInitialRotationSpeed(this.masses[i]);

            const meanTilt = this.settings.axialTiltMean;
            const stdDev = this.settings.axialTiltStdev;
            this.axialTilts[i] = this.rng.getGaussianF32(meanTilt, stdDev); // Axial tilt in radians

            this.setPlanetaryFeatureData();
        }

        // Set star in center if applicable
        if (this.settings.starInCenter) {
            const centerBody = this.rng.getRandomI32(0, this.settings.numBodies - 1);
            this.masses[centerBody] = this.settings.centerStarMass;
            this.radii[centerBody] = this.radius_from_mass_piecewise(this.masses[centerBody]);
            this.positionsX[centerBody] = 0;
            this.positionsY[centerBody] = 0;
            this.positionsZ[centerBody] = 0;
            this.velocitiesX[centerBody] = 0;
            this.velocitiesY[centerBody] = 0;
            this.velocitiesZ[centerBody] = 0;
            this.bodiesActive[centerBody] = 1;
            this.centerStar = centerBody;
        }

        // Set colors
        // HSL to RGB conversion: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
        for (let i = 0; i < this.settings.numBodies; i++) {
            // Generating bright, saturated colors is easier in HSL
            const H = this.rng.getRandomF32(0, 360);
            const S = this.rng.getRandomF32(0.8, 0.9);
            const L = 0.8;

            // Convert HSL to RGB
            const colorRGB = HSLtoRGB(H, S, L);
            this.colorsR[i] = colorRGB.r;
            this.colorsG[i] = colorRGB.g;
            this.colorsB[i] = colorRGB.b;
        }

        /*
            Set all stars
        */
        this.stars.fill(-1);
        this.numStars = 0;
        for (let i = 0; i < this.settings.numBodies; i++) {
            if (this.masses[i] >= MassThresholds.STAR) {
                this.stars[this.numStars] = i;
                this.numStars++;
            }
        }

        this.setOrbitalInformation();
    }

    private clear(): void {
        this.rng = new RngState(this.settings.seed);
        this.bodiesActive.fill(0);
        this.positionsX.fill(0);
        this.positionsY.fill(0);
        this.positionsZ.fill(0);
        this.velocitiesX.fill(0);
        this.velocitiesY.fill(0);
        this.velocitiesZ.fill(0);
        this.accelerationsX.fill(0);
        this.accelerationsY.fill(0);
        this.accelerationsZ.fill(0);
        this.masses.fill(0);
        this.radii.fill(0);
        this.angularVelocities.fill(0);
        this.axialTilts.fill(0);
        this.colorsR.fill(0);
        this.colorsG.fill(0);
        this.colorsB.fill(0);
        this.orbitalIndices.fill(-1);
        this.orbitalDistances.fill(-1);
        this.numActive = 0;
        this.numSattelites.fill(0);
        this.timeElapsed = 0;
        this.centerStar = null;
        this.stars.fill(-1);
        this.numStars = 0;
        this.temperatures.fill(0);
        this.planetFeatureTextureData.fill(0);
    }

    public reset(): void {
        this.clear();
        this.initialize();
    }

    public updateSmallRandom(deltaTime: number) {
        const dt = deltaTime * this.settings.timeStep;

        this.timeElapsed += dt;

        const motionScale = 50;
        const displacement = motionScale * dt;

        let numUpdated = 0;
        while (numUpdated <= 10) {
            const i = this.rng.getRandomI32(0, this.settings.numBodies - 1);
            if (!this.bodiesActive[i]) {
                continue;
            }
            numUpdated++;
            this.positionsX[i] += this.rng.getRandomF32(-1, 1) * displacement;
            this.positionsY[i] += this.rng.getRandomF32(-1, 1) * displacement;
            this.positionsZ[i] += this.rng.getRandomF32(-1, 1) * displacement;
        }
    }

    /**
     *
     * Updates the universe with brownian motion (e.g. totally random, incremental motion).
     * Included as a low-computation diagnostic tool for performance comparisons.
     */
    public updateBrownian(deltaTime: number) {
        const dt = deltaTime * this.settings.timeStep;

        this.timeElapsed += dt;

        const motionScale = 10;
        const displacement = motionScale * dt;

        for (let i = 0; i < this.settings.numBodies; i++) {
            if (!this.bodiesActive[i]) {
                continue;
            }
            this.positionsX[i] += this.rng.getRandomF32(-1, 1) * displacement;
            this.positionsY[i] += this.rng.getRandomF32(-1, 1) * displacement;
            this.positionsZ[i] += this.rng.getRandomF32(-1, 1) * displacement;
        }
    }

    /**
     *
     * Updates the universe via simple Euler integration by halving the O(n^2) function calls, where possible.
     * If we were to ever implement multithreading in the future, this would be a bad candidate for parallelization:
     * If JS parallelization is similar to OpenMP, then it would require that both inner and outer loops have the same dimensions.
     */
    public updateEulerHalved(deltaTime: number) {
        const dt = deltaTime * this.settings.timeStep;

        this.timeElapsed += dt;

        // Zero out all accelerations
        // Each fill operation is done in O(n) time.
        this.accelerationsX.fill(0);
        this.accelerationsY.fill(0);
        this.accelerationsZ.fill(0);

        // Calculate acceleration
        for (let i = 0; i < this.settings.numBodies; i++) {
            if (!this.bodiesActive[i]) continue;

            for (let j = i + 1; j < this.settings.numBodies; j++) {
                if (i === j || !this.bodiesActive[j]) continue;

                // Calculate displacement
                const dX = this.positionsX[j] - this.positionsX[i];
                const dY = this.positionsY[j] - this.positionsY[i];
                const dZ = this.positionsZ[j] - this.positionsZ[i];

                // Calculates the magnitude of displacement
                const distSq = dX * dX + dY * dY + dZ * dZ;
                const dist = Math.sqrt(distSq);

                // Calculates the unit vector of the displacement
                const unitDisplacementX = dX / dist;
                const unitDisplacementY = dY / dist;
                const unitDisplacementZ = dZ / dist;

                // Calculates the accelerations
                const acceleration = (G * this.masses[j]) / dist;

                this.accelerationsX[i] += acceleration * unitDisplacementX;
                this.accelerationsY[i] += acceleration * unitDisplacementY;
                this.accelerationsZ[i] += acceleration * unitDisplacementZ;
            }
        }

        // Calculate new velocities and positions
        for (let i = 0; i < this.settings.numBodies; i++) {
            if (!this.bodiesActive[i]) {
                continue;
            }
            this.velocitiesX[i] += this.accelerationsX[i] * dt;
            this.velocitiesY[i] += this.accelerationsY[i] * dt;
            this.velocitiesZ[i] += this.accelerationsZ[i] * dt;

            this.positionsX[i] += this.velocitiesX[i] * dt;
            this.positionsY[i] += this.velocitiesY[i] * dt;
            this.positionsZ[i] += this.velocitiesZ[i] * dt;
        }

        // Handle collisions
        for (let i = 0; i < this.settings.numBodies; i++) {
            if (!this.bodiesActive[i]) {
                continue;
            }
            for (let j = 0; j < this.settings.numBodies; j++) {
                if (i === j || !this.bodiesActive[j]) {
                    continue;
                }

                // Calculate displacement
                const displacementX = this.positionsX[j] - this.positionsX[i];
                const displacementY = this.positionsY[j] - this.positionsY[i];
                const displacementZ = this.positionsZ[j] - this.positionsZ[i];

                // Calculates the magnitude of displacement
                const displacementMagSq =
                    displacementX * displacementX + displacementY * displacementY + displacementZ * displacementZ;
                const displacementMag = Math.sqrt(displacementMagSq);

                // Check for collision
                if (displacementMag < this.radii[i] + this.radii[j]) {
                    const most_massive = this.masses[i] > this.masses[j] ? i : j;
                    const less_massive = this.masses[i] > this.masses[j] ? j : i;

                    // Merge the masses
                    this.masses[most_massive] += this.masses[less_massive];
                    this.radii[most_massive] = this.radius_from_mass_piecewise(this.masses[most_massive]);
                    this.velocitiesX[most_massive] =
                        (this.velocitiesX[most_massive] * this.masses[most_massive] +
                            this.velocitiesX[less_massive] * this.masses[less_massive]) /
                        this.masses[most_massive];
                    this.velocitiesY[most_massive] =
                        (this.velocitiesY[most_massive] * this.masses[most_massive] +
                            this.velocitiesY[less_massive] * this.masses[less_massive]) /
                        this.masses[most_massive];
                    this.velocitiesZ[most_massive] =
                        (this.velocitiesZ[most_massive] * this.masses[most_massive] +
                            this.velocitiesZ[less_massive] * this.masses[less_massive]) /
                        this.masses[most_massive];

                    /*
                        Deactivate the less massive body.
                    */
                    this.numActive--;
                    this.bodiesActive[less_massive] = 0;
                    if (less_massive === i) {
                        break;
                    }
                }
            }
        }

        /*
            Handle specific orbital energy
        */
        this.setOrbitalInformation();
    }

    /**
     *
     * Updates the universe via simple Euler integration.
     * O(n^2) complexity.
     */
    public updateEulerOld(deltaTime: number) {
        const dt = deltaTime * this.settings.timeStep;

        this.timeElapsed += dt;

        // Zero out all accelerations
        // Each fill operation is done in O(n) time.
        this.accelerationsX.fill(0);
        this.accelerationsY.fill(0);
        this.accelerationsZ.fill(0);

        // Calculate acceleration
        for (let i = 0; i < this.settings.numBodies; i++) {
            if (!this.bodiesActive[i]) {
                continue;
            }
            for (let j = 0; j < this.settings.numBodies; j++) {
                if (i === j || !this.bodiesActive[j]) {
                    continue;
                }

                // Calculate displacement
                const displacementX = this.positionsX[j] - this.positionsX[i];
                const displacementY = this.positionsY[j] - this.positionsY[i];
                const displacementZ = this.positionsZ[j] - this.positionsZ[i];

                // Calculates the magnitude of displacement
                const displacementMagSq =
                    displacementX * displacementX + displacementY * displacementY + displacementZ * displacementZ;
                const displacementMag = Math.sqrt(displacementMagSq);

                // Calculates the unit vector of the displacement
                const unitDisplacementX = displacementX / displacementMag;
                const unitDisplacementY = displacementY / displacementMag;
                const unitDisplacementZ = displacementZ / displacementMag;

                // Calculates the accelerations
                const acceleration = (G * this.masses[j]) / displacementMagSq;
                this.accelerationsX[i] += acceleration * unitDisplacementX;
                this.accelerationsY[i] += acceleration * unitDisplacementY;
                this.accelerationsZ[i] += acceleration * unitDisplacementZ;
            }
        }

        // Calculate new velocities and positions
        for (let i = 0; i < this.settings.numBodies; i++) {
            if (!this.bodiesActive[i]) {
                continue;
            }
            this.velocitiesX[i] += this.accelerationsX[i] * dt;
            this.velocitiesY[i] += this.accelerationsY[i] * dt;
            this.velocitiesZ[i] += this.accelerationsZ[i] * dt;

            this.positionsX[i] += this.velocitiesX[i] * dt;
            this.positionsY[i] += this.velocitiesY[i] * dt;
            this.positionsZ[i] += this.velocitiesZ[i] * dt;
        }

        // Handle collisions
        for (let i = 0; i < this.settings.numBodies; i++) {
            if (!this.bodiesActive[i]) {
                continue;
            }
            for (let j = 0; j < this.settings.numBodies; j++) {
                if (i === j || !this.bodiesActive[j]) {
                    continue;
                }

                // Calculate displacement
                const displacementX = this.positionsX[j] - this.positionsX[i];
                const displacementY = this.positionsY[j] - this.positionsY[i];
                const displacementZ = this.positionsZ[j] - this.positionsZ[i];

                // Calculates the magnitude of displacement
                const displacementMagSq =
                    displacementX * displacementX + displacementY * displacementY + displacementZ * displacementZ;
                const displacementMag = Math.sqrt(displacementMagSq);

                // Check for collision
                if (displacementMag < this.radii[i] + this.radii[j]) {
                    const most_massive = this.masses[i] > this.masses[j] ? i : j;
                    const less_massive = this.masses[i] > this.masses[j] ? j : i;

                    // Merge the masses
                    this.masses[most_massive] += this.masses[less_massive];
                    this.radii[most_massive] = this.radius_from_mass_piecewise(this.masses[most_massive]);
                    this.velocitiesX[most_massive] =
                        (this.velocitiesX[most_massive] * this.masses[most_massive] +
                            this.velocitiesX[less_massive] * this.masses[less_massive]) /
                        this.masses[most_massive];
                    this.velocitiesY[most_massive] =
                        (this.velocitiesY[most_massive] * this.masses[most_massive] +
                            this.velocitiesY[less_massive] * this.masses[less_massive]) /
                        this.masses[most_massive];
                    this.velocitiesZ[most_massive] =
                        (this.velocitiesZ[most_massive] * this.masses[most_massive] +
                            this.velocitiesZ[less_massive] * this.masses[less_massive]) /
                        this.masses[most_massive];

                    /*
                        Deactivate the less massive body.
                    */
                    this.numActive--;
                    this.bodiesActive[less_massive] = 0;
                    if (less_massive === i) {
                        break;
                    }
                    /*
                        If less massive body is a star, remove it from the stars array.
                    */
                    if (this.masses[less_massive] >= MassThresholds.STAR) {
                        this.stars = removeFromArray(less_massive, this.stars);
                        this.numStars--;
                    }

                    /*
                        Add to array of stars if more massive body has passed the threshold
                    */
                    if (this.masses[most_massive] >= MassThresholds.STAR && !this.inStarArray(most_massive)) {
                        this.stars[this.numStars] = most_massive;
                        this.numStars++;
                    }
                }
            }
        }

        /*
            Handle specific orbital energy
        */
        this.setOrbitalInformation();
    }

    private setOrbitalInformation() {
        /**
         * Sets the orbital indices, orbital distances and number of sattelites for each body
         */
        this.numSattelites.fill(0);
        for (let i = 0; i < this.settings.numBodies; i++) {
            if (!this.bodiesActive[i]) {
                continue;
            }
            this.orbitalIndices[i] = -1;
            this.orbitalDistances[i] = -1;
            let lowestEnergy = 0;
            for (let j = 0; j < this.settings.numBodies; j++) {
                if (i === j || !this.bodiesActive[j]) {
                    continue;
                }

                // As a simplification, bodies cannot be consider to "orbit" bodies which are sufficiently
                if (this.masses[j] < this.masses[i] / 5.0) {
                    continue;
                }

                const energy = this.getSpecificOrbitalEnergy(i, j);
                if (energy < lowestEnergy) {
                    lowestEnergy = energy;
                    this.orbitalIndices[i] = j;
                }
            }
            if (this.orbitalIndices[i] !== -1) {
                this.numSattelites[this.orbitalIndices[i]]++;
                this.orbitalDistances[i] = Math.sqrt(
                    (this.positionsX[i] - this.positionsX[this.orbitalIndices[i]]) ** 2 +
                        (this.positionsY[i] - this.positionsY[this.orbitalIndices[i]]) ** 2 +
                        (this.positionsZ[i] - this.positionsZ[this.orbitalIndices[i]]) ** 2,
                );
            }
        }
    }

    public bodyDistance(a: number, b: number): number {
        /**
         * Absolute distance to the followed body. Returns -1 if there is no followed body.
         */

        const dTargetX = this.positionsX[b] - this.positionsX[a];
        const dTargetY = this.positionsY[b] - this.positionsY[a];
        const dTargetZ = this.positionsZ[b] - this.positionsZ[a];

        return Math.sqrt(dTargetX ** 2 + dTargetY ** 2 + dTargetZ ** 2);
    }

    public getActiveBodies(target: number): Array<LeaderboardBody> {
        const massRankings = new Array<LeaderboardBody>(this.numActive);
        let j = 0;
        for (let i = 0; i < this.settings.numBodies; i++) {
            // Skip inactive bodies
            if (!this.bodiesActive[i]) {
                continue;
            }

            const targetVX = target > -1 ? this.velocitiesX[target] : 0;
            const targetVY = target > -1 ? this.velocitiesY[target] : 0;
            const targetVZ = target > -1 ? this.velocitiesZ[target] : 0;
            const dVX = this.velocitiesX[i] - targetVX;
            const dVY = this.velocitiesY[i] - targetVY;
            const dVZ = this.velocitiesZ[i] - targetVZ;
            const vRel = Math.sqrt(dVX ** 2 + dVY ** 2 + dVZ ** 2);

            const targetAX = target > -1 ? this.accelerationsX[target] : 0;
            const targetAY = target > -1 ? this.accelerationsY[target] : 0;
            const targetAZ = target > -1 ? this.accelerationsZ[target] : 0;
            const dAX = this.accelerationsX[i] - targetAX;
            const dAY = this.accelerationsY[i] - targetAY;
            const dAZ = this.accelerationsZ[i] - targetAZ;
            const aRel = Math.sqrt(dAX ** 2 + dAY ** 2 + dAZ ** 2);

            massRankings[j] = {
                index: i,
                mass: this.masses[i],
                color: `rgb(${this.colorsR[i] * 255}, ${this.colorsG[i] * 255}, ${this.colorsB[i] * 255})`,
                dOrigin: Math.sqrt(this.positionsX[i] ** 2 + this.positionsY[i] ** 2 + this.positionsZ[i] ** 2),
                vOrigin: Math.sqrt(this.velocitiesX[i] ** 2 + this.velocitiesY[i] ** 2 + this.velocitiesZ[i] ** 2),
                aOrigin: Math.sqrt(
                    this.accelerationsX[i] ** 2 + this.accelerationsY[i] ** 2 + this.accelerationsZ[i] ** 2,
                ),
                dTarget: target > -1 ? this.bodyDistance(target, i) : -1,
                vTarget: target > -1 ? vRel : -1,
                aTarget: target > -1 ? aRel : -1,
                orbiting: this.orbitalIndices[i],
                numSatellites: this.numSattelites[i],
                dOrbit: this.orbitalDistances[i],
                orbitColor: `rgb(${this.colorsR[this.orbitalIndices[i]] * 255}, ${this.colorsG[this.orbitalIndices[i]] * 255}, ${this.colorsB[this.orbitalIndices[i]] * 255})`,
            };

            j++;
        }

        return massRankings;
    }

    public inStarArray(idx: number): boolean {
        for (let i = 0; i < this.numStars; i++) {
            if (this.stars[i] === idx) {
                return true;
            }
        }
        return false;
    }

    public getStars(): Array<number> {
        /**
         * Returns the array of stars.
         */
        return [...this.stars.slice(0, this.numStars)];
    }

    public getStarsData(): Array<vec4> {
        /**
         * Returns the data for each star in the universe.
         * The data is in the form of vec4, where the first three components are the position and the fourth is the mass.
         */
        const starData: Array<vec4> = [];
        for (let i = 0; i < this.numStars; i++) {
            const idx = this.stars[i];
            starData.push(
                vec4.fromValues(this.positionsX[idx], this.positionsY[idx], this.positionsZ[idx], this.masses[idx]),
            );
        }
        // Sort star data by mass
        starData.sort((a, b) => b[3] - a[3]); // Sort by mass in descending order
        return starData;
    }

    public getNumStars(): number {
        return this.numStars;
    }

    public getInitialVelocityOriginal(x: number, y: number, z: number): { x: number; y: number; z: number } {
        // Planets in the center move slower than planets on the edge of the universe.
        // The velocity is proportional to the distance from the center of the universe.
        const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
        const angularVelocityMagnitude = Math.sqrt(G / distanceFromCenter); // Gravitational acceleration
        // The angular velocity is perpendicular to the radius vector.
        // We can use the cross product to get the angular velocity vector.
        const angularVelocityX = -z * angularVelocityMagnitude * 0.05;
        const angularVelocityY = 0;
        const angularVelocityZ = x * angularVelocityMagnitude * 0.05; // No vertical component for simplicity
        return {
            x: angularVelocityX,
            y: angularVelocityY,
            z: angularVelocityZ,
        };
    }

    private getInitialRotationSpeed(mass: number): number {
        let basePeriodInDays: number;
        if (mass >= MassThresholds.STAR) {
            // Stars: 10-30 day rotation period
            basePeriodInDays = this.rng.getRandomF32(10, 30); // 10-30 days
        } else if (mass >= MassThresholds.GAS_GIANT) {
            //basePeriodInDays = this.rng.getRandomF32(0.375, 0.67); // 9-16 hours in days
            basePeriodInDays = this.rng.getPowerLawF32(1, 10, -1.0);
        } else {
            basePeriodInDays = this.rng.getPowerLawF32(1, 10, -1.0);
        }
        const basePeriodInYears = basePeriodInDays / 365.25; // Convert days to years
        const angularVelocity = (2 * Math.PI) / basePeriodInYears; // Convert period to angular velocity
        return angularVelocity; // Return angular velocity in radians per month
    }

    private getInitialVelocityKepler(
        x: number,
        y: number,
        z: number,
        M: number,
    ): { vX: number; vY: number; vZ: number } {
        // Planets in the center move slower than planets on the edge of the universe.
        // The velocity is proportional to the distance from the center of the universe.
        const positionVector = vec3.fromValues(x, y, z);
        const perpendicularUnitVector = vec3.create();
        vec3.cross(perpendicularUnitVector, positionVector, vec3.fromValues(0, 1, 0)); // Perpendicular to the position vector
        vec3.normalize(perpendicularUnitVector, perpendicularUnitVector); // Normalize the vector
        const distanceFromCenter = vec3.length(positionVector);
        const angularVelocityMagnitude = Math.sqrt((G * M) / distanceFromCenter); // Gravitational acceleration

        const velocityVector = vec3.create();
        vec3.scale(velocityVector, perpendicularUnitVector, angularVelocityMagnitude); // Scale the vector by the angular velocity

        return { vX: velocityVector[0], vY: velocityVector[1], vZ: velocityVector[2] };
    }

    // private getRandomSphericalStartingPosition(min: number, max: number): { x: number; y: number; z: number } {
    //     const theta = getRandomF32(0, Math.PI * 2); // Random angle around the z-axis
    //     const phi = getRandomF32(0, Math.PI); // Random angle from the z-axis
    //     const radius = getRandomF32(min, max); // Random radius

    //     return {
    //         x: radius * Math.sin(phi) * Math.cos(theta),
    //         y: radius * Math.sin(phi) * Math.sin(theta),
    //         z: radius * Math.cos(phi),
    //     };
    // }

    private getRandomDiskStartingPosition(min: number, max: number): { x: number; y: number; z: number } {
        const theta = this.rng.getRandomF32(0, Math.PI * 2); // Random angle around the z-axis
        const phi = this.rng.getRandomF32(0, Math.PI); // Random angle from the z-axis
        const radius = this.rng.getRandomF32(min, max); // Random radius

        return {
            x: radius * Math.sin(phi) * Math.cos(theta),
            y: this.rng.getRandomF32(-1, 1), // Random y position
            z: radius * Math.cos(phi),
        };
    }

    private getSpecificOrbitalEnergy(bodyA: number, bodyB: number) {
        // Relative velocities
        const vX = this.velocitiesX[bodyA] - this.velocitiesX[bodyB];
        const vY = this.velocitiesY[bodyA] - this.velocitiesY[bodyB];
        const vZ = this.velocitiesZ[bodyA] - this.velocitiesZ[bodyB];
        const v = Math.sqrt(vX * vX + vY * vY + vZ * vZ);

        // Relative distance
        const dX = this.positionsX[bodyA] - this.positionsX[bodyB];
        const dY = this.positionsY[bodyA] - this.positionsY[bodyB];
        const dZ = this.positionsZ[bodyA] - this.positionsZ[bodyB];
        const r = Math.sqrt(dX * dX + dY * dY + dZ * dZ);

        // Sum of standard gravitational patterns
        const U = G * (this.masses[bodyA] + this.masses[bodyB]);

        return 0.5 * v * v - U / r;
    }

    private setPlanetaryFeatureData() {
        /**
         * Sets the planetary feature texture data.
         * This is a placeholder for now, but can be used to set the texture data for each planet.
         */
        for (let i = 0; i < this.settings.numBodies; i++) {
            for (let j = 0; j < this.numFeatureChannels; j++) {
                const idx = i * this.numFeatureChannels + j;
                // Set the data for each planet
                // For now, we will just set the data to a random value between 0 and 1
                this.planetFeatureTextureData[idx] = this.rng.getRandomU8();
            }
        }
    }

    /*
        Getters
    */
    public getRadius(idx: number): number {
        return this.radii[idx];
    }
    public getMass(idx: number): number {
        return this.masses[idx];
    }
    public getPositionX(idx: number): number {
        return this.positionsX[idx];
    }
    public getPosition(idx: number): vec3 {
        return vec3.fromValues(this.positionsX[idx], this.positionsY[idx], this.positionsZ[idx]);
    }
    public getVelocity(idx: number): vec3 {
        return vec3.fromValues(this.velocitiesX[idx], this.velocitiesY[idx], this.velocitiesZ[idx]);
    }
    public getAcceleration(idx: number): vec3 {
        return vec3.fromValues(this.accelerationsX[idx], this.accelerationsY[idx], this.accelerationsZ[idx]);
    }
}
