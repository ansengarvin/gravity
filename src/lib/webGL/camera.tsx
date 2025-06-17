import { mat4, vec3, vec4 } from "gl-matrix";
import { MousePosition } from "../../hooks/useMouseControls";

export interface Ray {
    origin: vec3;
    direction: vec3;
}

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

    public getRayFromMouse(normalizedMousePosition: MousePosition | null, projectionMatrix: mat4): Ray | null {
        if (!normalizedMousePosition) {
            return null;
        }
        const clipCoords = vec4.fromValues(normalizedMousePosition.x, normalizedMousePosition.y, -1.0, 1.0);

        const inverseProjection = mat4.invert(mat4.create(), projectionMatrix);
        const eyeCoords = vec4.transformMat4(vec4.create(), clipCoords, inverseProjection);
        // Point forward
        eyeCoords[2] = -1.0;
        // Direction vector
        eyeCoords[3] = 0.0;

        // Convert to world space
        const inverseView = mat4.invert(mat4.create(), this.getViewMatrix());
        const worldCoords = vec4.transformMat4(vec4.create(), eyeCoords, inverseView);

        // Create ray
        const ray: Ray = {
            origin: this.getPosition(),
            direction: vec3.normalize(vec3.create(), vec3.fromValues(worldCoords[0], worldCoords[1], worldCoords[2])),
        };

        return ray;
    }
}
