import { mat4 } from "gl-matrix";
import { getRandomFloat } from "../../random/random";
import { Buffers } from "../webGL/buffers";
import { ProgramInfo } from "../webGL/programInfo";
import { setNormalAttribute, setPositionAttribute } from "../webGL/attributes";
import React from "react";
import { LeaderboardBody } from "../../components/leaderboard/LeaderboardBody";
import { Camera } from "../webGL/camera";
import { sortQuery } from "../defines/sortQuery";

const G = 4 * Math.PI * Math.PI; // Gravitational constant

export interface UniverseSettings {
    seed: string;
    timeStep: number;
    numBodies: number; // THe number of starting bodies in the universe
    size: number; // The size of the universe in astronomical units
}

export class Universe {
    public settings: UniverseSettings;

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
    public masses: Float32Array;
    public radii: Float32Array;
    public colorsR: Float32Array;
    public colorsG: Float32Array;
    public colorsB: Float32Array;
    public numActive: number;
    public orbitalIndices: Float32Array;
    public orbitalDistances: Float32Array;

    public bodyFollowedRef: React.RefObject<number>;
    public updateBodyFollowed: (newBodyFollowed: number) => void;
    private sortByRef: React.RefObject<sortQuery>;

    constructor(
        settings: UniverseSettings,
        bodyFollowedRef: React.RefObject<number>,
        updateBodyFollowed: (newBodyFollowed: number) => void,
        sortByRef: React.RefObject<sortQuery>,
    ) {
        this.settings = settings;
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

        this.masses = new Float32Array(this.settings.numBodies);
        this.radii = new Float32Array(this.settings.numBodies);

        this.colorsR = new Float32Array(this.settings.numBodies);
        this.colorsG = new Float32Array(this.settings.numBodies);
        this.colorsB = new Float32Array(this.settings.numBodies);

        this.orbitalIndices = new Float32Array(this.settings.numBodies);
        this.orbitalDistances = new Float32Array(this.settings.numBodies);

        this.numActive = this.settings.numBodies;
        this.bodyFollowedRef = bodyFollowedRef;
        this.updateBodyFollowed = updateBodyFollowed;
        this.sortByRef = sortByRef;

        this.initialize();
    }

    public radius_from_mass(mass: number): number {
        // The radius to mass ratio is extremely unrealistic for this simulation.
        // If it weren't, we wouldn't be able to see most of the bodies.
        return Math.pow(mass, 1 / 3) * 0.1;
        //return 1;
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

        // Masses are in solar masses
        // For reference, the Sun's mass is 1 solar mass.
        const min_mass = 0.001; // 0.1 solar masses
        const max_mass = 0.1; // 1 solar mass

        for (let i = 0; i < this.settings.numBodies; i++) {
            // this.positionsX[i] = getRandomFloat(min_position, max_position);
            // this.positionsY[i] = getRandomFloat(-1, 1);
            // this.positionsZ[i] = getRandomFloat(min_position, max_position);

            const pos = this.getRandomDiskStartingPosition(min_position, max_position);
            this.positionsX[i] = pos.x;
            this.positionsY[i] = pos.y;
            this.positionsZ[i] = pos.z;

            // this.velocitiesX[i] = getRandomFloat(min_velocity, max_velocity);
            // this.velocitiesY[i] = getRandomFloat(min_velocity, max_velocity);
            // this.velocitiesZ[i] = getRandomFloat(min_velocity, max_velocity);

            const initialAngularVelocity = this.getInitialAngularVelocity(
                this.positionsX[i],
                this.positionsY[i],
                this.positionsZ[i],
            );
            const multiplier = 10;
            this.velocitiesX[i] = initialAngularVelocity.x * multiplier;
            this.velocitiesY[i] = initialAngularVelocity.y * multiplier;
            this.velocitiesZ[i] = initialAngularVelocity.z * multiplier;

            this.bodiesActive[i] = 1;

            this.masses[i] = getRandomFloat(min_mass, max_mass);
            this.radii[i] = this.radius_from_mass(this.masses[i]);
        }

        // Set colors
        for (let i = 0; i < this.settings.numBodies; i++) {
            this.colorsR[i] = getRandomFloat(0.1, 0.85);
            this.colorsG[i] = getRandomFloat(0.1, 0.85);
            this.colorsB[i] = getRandomFloat(0.1, 0.85);
        }

        this.orbitalIndices.fill(-1);
        this.orbitalDistances.fill(-1);
    }

    private clear(): void {
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
        this.colorsR.fill(0);
        this.colorsG.fill(0);
        this.colorsB.fill(0);
        this.orbitalIndices.fill(-1);
        this.orbitalDistances.fill(-1);
    }

    public reset(): void {
        this.clear();
        this.initialize();
    }

    public updateEuler(deltaTime: number) {
        const dt = deltaTime * this.settings.timeStep;

        // Zero out all accelerations
        // Each fill operation, evidently, is done in O(n) time.
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
                    this.radii[most_massive] = this.radius_from_mass(this.masses[most_massive]);
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

                const energy = this.getSpecificOrbitalEnergy(i, j);
                if (energy < lowestEnergy) {
                    lowestEnergy = energy;
                    this.orbitalIndices[i] = j;
                }
            }
            if (this.orbitalIndices[i] !== -1) {
                this.orbitalDistances[i] = Math.sqrt(
                    (this.positionsX[i] - this.positionsX[this.orbitalIndices[i]]) ** 2 +
                        (this.positionsY[i] - this.positionsY[this.orbitalIndices[i]]) ** 2 +
                        (this.positionsZ[i] - this.positionsZ[this.orbitalIndices[i]]) ** 2,
                );
            }
        }
    }

    public distanceToFollowedBody(idx: number): number {
        /**
         * Absolute distance to the followed body. Returns -1 if there is no followed body.
         */
        if (this.bodyFollowedRef.current == -1) {
            return -1;
        }

        const dTargetX = this.positionsX[idx] - this.positionsX[this.bodyFollowedRef.current];
        const dTargetY = this.positionsY[idx] - this.positionsY[this.bodyFollowedRef.current];
        const dTargetZ = this.positionsZ[idx] - this.positionsZ[this.bodyFollowedRef.current];

        return Math.sqrt(dTargetX ** 2 + dTargetY ** 2 + dTargetZ ** 2);
    }

    public getRankings(): Array<LeaderboardBody> {
        const massRankings = new Array<LeaderboardBody>(this.settings.numBodies);
        for (let i = 0; i < this.settings.numBodies; i++) {
            // Skip inactive bodies
            if (!this.bodiesActive[i]) {
                continue;
            }

            massRankings[i] = {
                index: i,
                mass: this.masses[i],
                color: `rgb(${this.colorsR[i] * 255}, ${this.colorsG[i] * 255}, ${this.colorsB[i] * 255})`,
                dOrigin: Math.sqrt(this.positionsX[i] ** 2 + this.positionsY[i] ** 2 + this.positionsZ[i] ** 2),
                dTarget: this.distanceToFollowedBody(i),
                orbiting: this.orbitalIndices[i],
                dOrbit: this.orbitalDistances[i],
                orbitColor: `rgb(${this.colorsR[this.orbitalIndices[i]] * 255}, ${this.colorsG[this.orbitalIndices[i]] * 255}, ${this.colorsB[this.orbitalIndices[i]] * 255})`,
            };
        }

        massRankings.sort((a, b) => {
            switch (this.sortByRef.current) {
                case sortQuery.name:
                    return a.index - b.index;
                case sortQuery.mass:
                    return b.mass - a.mass;
                case sortQuery.dOrigin:
                    return b.dOrigin - a.dOrigin;
                case sortQuery.dTarget:
                    return a.dTarget - b.dTarget;
                case sortQuery.orbiting:
                    if (a.orbiting === -1 && b.orbiting === -1) return 0;
                    if (a.orbiting === -1) return 1;
                    if (b.orbiting === -1) return -1;
                    return a.orbiting - b.orbiting;
                case sortQuery.dOrbit:
                    return a.dOrbit - b.dOrbit;
                default:
                    return b.mass - a.mass;
            }
        });

        return massRankings;
    }

    private getInitialAngularVelocity(x: number, y: number, z: number): { x: number; y: number; z: number } {
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

    // private getRandomSphericalStartingPosition(min: number, max: number): { x: number; y: number; z: number } {
    //     const theta = getRandomFloat(0, Math.PI * 2); // Random angle around the z-axis
    //     const phi = getRandomFloat(0, Math.PI); // Random angle from the z-axis
    //     const radius = getRandomFloat(min, max); // Random radius

    //     return {
    //         x: radius * Math.sin(phi) * Math.cos(theta),
    //         y: radius * Math.sin(phi) * Math.sin(theta),
    //         z: radius * Math.cos(phi),
    //     };
    // }

    private getRandomDiskStartingPosition(min: number, max: number): { x: number; y: number; z: number } {
        const theta = getRandomFloat(0, Math.PI * 2); // Random angle around the z-axis
        const phi = getRandomFloat(0, Math.PI); // Random angle from the z-axis
        const radius = getRandomFloat(min, max); // Random radius

        return {
            x: radius * Math.sin(phi) * Math.cos(theta),
            y: getRandomFloat(-1, 1), // Random y position
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

        return (0.5*v*v)-(U/r);
    }
}
