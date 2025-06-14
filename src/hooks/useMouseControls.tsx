import { useRef } from "react";
import { Camera } from "../lib/webGL/camera";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export function useMouseControls(cameraRef: React.RefObject<Camera>, cameraSensitivity: number) {
    const isDragging = useRef(false);
    const lastMousePosition = useRef<{ x: number; y: number } | null>(null);
    const followedBodyRadius = useSelector((state: RootState) => state.information.followedBodyRadius);

    /*
        Mouse Controls
    */
    // Zoom in and out on mouse wheel
    const handleMouseWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
        const minZoom = followedBodyRadius ? followedBodyRadius * 5 : 0.0001;
        const maxZoom = 50;
        let dynamicSensitivity = 0.005;
        if (cameraRef.current.zoom > -1) {
            dynamicSensitivity = 0.0005;
        } else if (cameraRef.current.zoom > -0.5) {
            dynamicSensitivity = 0.00005;
        }

        cameraRef.current!.zoom -= event.deltaY * dynamicSensitivity;
        cameraRef.current!.zoom = Math.min(Math.max(cameraRef.current!.zoom, -1 * maxZoom), -1 * minZoom);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        isDragging.current = true;
        const rect = event.currentTarget.getBoundingClientRect();
        lastMousePosition.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging.current || !lastMousePosition.current) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const currentMousePosition = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };

        const deltaX = currentMousePosition.x - lastMousePosition.current.x;
        const deltaY = currentMousePosition.y - lastMousePosition.current.y;

        cameraRef.current!.yaw -= deltaX * cameraSensitivity;
        cameraRef.current!.pitch -= deltaY * cameraSensitivity;

        // Clamp pitch between -90 and 90
        cameraRef.current!.pitch = Math.max(
            Math.min(cameraRef.current!.pitch, Math.PI / 2 - 0.001),
            -Math.PI / 2 + 0.001,
        );

        lastMousePosition.current = currentMousePosition;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        lastMousePosition.current = null;
    };

    return { handleMouseWheel, handleMouseDown, handleMouseMove, handleMouseUp };
}
