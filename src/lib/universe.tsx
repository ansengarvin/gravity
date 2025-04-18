import { getRandomFloat } from "../random/random";

export interface UniverseSettings {
    seed: string,
    numBodies: number
}

export class Universe {
    public settings: UniverseSettings;

    // Uint8Array and Float32Array are guaranteed to be contiguous in memory, which makes them more performant (cache locality).
    public bodies_active: Uint8Array;
    public positions_x: Float32Array;
    public positions_y: Float32Array;
    public positions_z: Float32Array;
    public velocities_x: Float32Array;
    public velocities_y: Float32Array;
    public velocities_z: Float32Array;
    public masses: Float32Array;
    public radii: Float32Array;
    public time: number = 0.0;

    constructor(settings: UniverseSettings) {
        this.settings = settings;
        this.bodies_active = new Uint8Array(this.settings.numBodies);
        this.positions_x = new Float32Array(this.settings.numBodies);
        this.positions_y = new Float32Array(this.settings.numBodies);
        this.positions_z = new Float32Array(this.settings.numBodies);

        this.velocities_x = new Float32Array(this.settings.numBodies);
        this.velocities_y = new Float32Array(this.settings.numBodies);
        this.velocities_z = new Float32Array(this.settings.numBodies);

        this.masses = new Float32Array(this.settings.numBodies);
        this.radii = new Float32Array(this.settings.numBodies);
    }

    public initialize() {
        // Seed the random number generator with the provided seed

        for (let i = 0; i < this.settings.numBodies; i++) {
            this.bodies_active[i] = 1;
            this.positions_x[i] = getRandomFloat(-1.0, 1.0);
            this.positions_y[i] = getRandomFloat(-1.0, 1.0);
            this.positions_z[i] = getRandomFloat(-1.0, 1.0);
            this.velocities_x[i] = getRandomFloat(-1.0, 1.0);
            this.velocities_y[i] = getRandomFloat(-1.0, 1.0);
            this.velocities_z[i] = getRandomFloat(-1.0, 1.0);
            this.masses[i] = getRandomFloat(0.1, 1.0);
            this.radii[i] = getRandomFloat(0.01, 0.05);
        }
    }
    
}