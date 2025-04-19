import { mat4 } from "gl-matrix";
import { getRandomFloat } from "../../random/random";
import { Buffers } from "../webGL/buffers";
import { ProgramInfo } from "../webGL/programInfo";
import { setNormalAttribute, setPositionAttribute } from "../webGL/attributes";
import React from "react";
import { LeaderboardBody } from "../../components/Leaderboard";
import { Camera } from "../webGL/camera";

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

    public bodyFollowedRef: React.RefObject<number>;
    public updateBodyFollowed: (newBodyFollowed: number) => void;
    private cameraRef: React.RefObject<Camera>;

    constructor(
        settings: UniverseSettings,
        cameraRef: React.RefObject<Camera>,
        bodyFollowedRef: React.RefObject<number>,
        updateBodyFollowed: (newBodyFollowed: number) => void,
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

        this.numActive = this.settings.numBodies;
        this.cameraRef = cameraRef;
        this.bodyFollowedRef = bodyFollowedRef;
        this.updateBodyFollowed = updateBodyFollowed;

        this.initialize();
    }

    public radius_from_mass(mass: number): number {
        // The radius to mass ratio is extremely unrealistic for this simulation.
        // If it weren't, we wouldn't be able to see most of the bodies.
        return Math.pow(mass, 1 / 3) * 0.1;
        //return 1;
    }

    public initialize(): void {
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
            this.colorsR[i] = getRandomFloat(0.0, 0.5);
            this.colorsG[i] = getRandomFloat(0.0, 0.5);
            this.colorsB[i] = getRandomFloat(0.0, 0.5);
        }
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

                    // Deactivate the less massive body
                    this.bodiesActive[less_massive] = 0;

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

                    // Decrement numactive
                    this.numActive--;
                }
            }
        }

        // Update the camera position to the current position of the followed body
        if (this.bodyFollowedRef.current !== -1) {
            this.cameraRef.current.setTarget(
                this.positionsX[this.bodyFollowedRef.current],
                this.positionsY[this.bodyFollowedRef.current],
                this.positionsZ[this.bodyFollowedRef.current],
            );
        }
    }

    public draw(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers, indexCount: number) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        const fieldOfView = (45 * Math.PI) / 180; // in radians
        const canvas = gl.canvas as HTMLCanvasElement;
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;

        /*
            Binding buffers
        */
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        setPositionAttribute(gl, buffers, programInfo);
        setNormalAttribute(gl, buffers, programInfo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        gl.useProgram(programInfo.program);

        /*
            Create Projection Matrix
        */
        const projectionMatrix = mat4.create();

        // note: glMatrix always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        // Set the shader uniform for projection matrix
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);

        // Create a view matrix for the camera
        // const cameraMatrix = mat4.create();
        // mat4.translate(
        //     cameraMatrix, // destination matrix
        //     cameraMatrix, // matrix to translate
        //     [0.0, 0.0, this.cameraRef.current.zoom], // amount to translate
        // );
        const cameraMatrix = this.cameraRef.current.getViewMatrix();

        for (let i = 0; i < this.settings.numBodies; i++) {
            if (!this.bodiesActive[i]) {
                continue;
            }
            const modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, [this.positionsX[i], this.positionsY[i], this.positionsZ[i]]);
            mat4.scale(modelMatrix, modelMatrix, [this.radii[i], this.radii[i], this.radii[i]]);

            // Create model view matrix
            const modelViewMatrix = mat4.create();
            mat4.multiply(modelViewMatrix, cameraMatrix, modelMatrix);

            // Create normal matrix
            const normalMatrix = mat4.create();
            mat4.invert(normalMatrix, modelViewMatrix);
            mat4.transpose(normalMatrix, normalMatrix);

            // Sets shader uniforms for model normals
            gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
            gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix);
            gl.uniform4fv(programInfo.uniformLocations.uFragColor, [
                this.colorsR[i],
                this.colorsG[i],
                this.colorsB[i],
                1.0,
            ]);
            {
                const type = gl.UNSIGNED_SHORT;
                const offset = 0;
                gl.drawElements(gl.TRIANGLES, indexCount, type, offset);
            }
        }
    }

    public getMassRankings(): Array<LeaderboardBody> {
        const massRankings = new Array(this.settings.numBodies);
        for (let i = 0; i < this.settings.numBodies; i++) {
            // Skip inactive bodies
            if (!this.bodiesActive[i]) {
                continue;
            }
            massRankings[i] = {
                index: i,
                mass: this.masses[i],
                color: `rgb(${this.colorsR[i] * 255}, ${this.colorsG[i] * 255}, ${this.colorsB[i] * 255})`,
                pos: {
                    x: this.positionsX[i],
                    y: this.positionsY[i],
                    z: this.positionsZ[i],
                },
            };
        }

        massRankings.sort((a, b) => b.mass - a.mass);

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
}
