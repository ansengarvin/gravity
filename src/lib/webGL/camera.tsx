import { mat4, vec3 } from "gl-matrix";

export class Camera {
    // X, Y, and Z represent the central point the camera orbits around
    private target: {
        x: number;
        y: number;
        z: number;
    };
    // Pitch and yaw represent the camera's rotation around the X and Y axes respectively
    public pitch: number;
    public yaw: number;
    // Zoom represents the distance from the camera to the center point
    public zoom: number;

    constructor(x: number, y: number, z: number, pitch: number, yaw: number, zoom: number) {
        this.target = {
            x: x,
            y: y,
            z: z,
        };
        this.pitch = pitch;
        this.yaw = yaw;
        this.zoom = zoom;
    }

    public getPosition(): vec3 {
        const position = vec3.create();
        const offsetX = this.zoom * Math.cos(this.pitch) * Math.sin(this.yaw);
        const offsetY = this.zoom * Math.sin(this.pitch);
        const offsetZ = this.zoom * Math.cos(this.pitch) * Math.cos(this.yaw);

        vec3.set(position, this.target.x + offsetX, this.target.y + offsetY, this.target.z + offsetZ);

        return position;
    }

    public setTarget(x: number, y: number, z: number): void {
        this.target.x = x;
        this.target.y = y;
        this.target.z = z;
    }

    public getTarget(): vec3 {
        return vec3.fromValues(this.target.x, this.target.y, this.target.z);
    }

    public getViewMatrix(): mat4 {
        const viewMatrix = mat4.create();
        const cameraPosition = this.getPosition();
        const target = vec3.fromValues(this.target.x, this.target.y, this.target.z);
        const up = vec3.fromValues(0, 1, 0);
        mat4.lookAt(viewMatrix, cameraPosition, target, up);
        return viewMatrix;
    }

    public setAll(x: number, y: number, z: number, pitch: number, yaw: number, zoom: number): void {
        this.target = {
            x: x,
            y: y,
            z: z,
        };
        this.pitch = pitch;
        this.yaw = yaw;
        this.zoom = zoom;
    }
}
