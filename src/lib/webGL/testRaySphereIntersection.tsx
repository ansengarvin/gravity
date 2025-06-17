import { vec3 } from "gl-matrix";
import { Ray } from "./camera";

export function testRaySphereIntersection(ray: Ray, sphereCenter: vec3, sphereRadius: number): number | null {
    // Origin to center of sphere
    let oc = vec3.subtract(vec3.create(), ray.origin, sphereCenter);
    let a = vec3.dot(ray.direction, ray.direction);
    let b = 2 * vec3.dot(oc, ray.direction);
    let c = vec3.dot(oc, oc) - sphereRadius * sphereRadius;

    let discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return null;
    }

    let t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    let t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    if (t1 > 0 && t2 > 0) {
        return Math.min(t1, t2);
    } else if (t1 > 0) {
        return t1;
    } else if (t2 > 0) {
        return t2;
    } else {
        return null;
    }
}
