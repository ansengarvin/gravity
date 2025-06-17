import { useRef } from "react";
import { Camera } from "../lib/webGL/camera";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { controlsDispatch } from "../redux/controlsSlice";

export interface MousePosition {
    x: number;
    y: number;
}

export function useMouseControls(cameraRef: React.RefObject<Camera>, cameraSensitivity: number) {
    const isDragging = useRef(false);
    const lastMousePosition = useRef<MousePosition | null>(null);
    const followedBodyRadius = useSelector((state: RootState) => state.information.followedBodyRadius);
    const currentMousePosition = useRef<MousePosition | null>(null);
    const normalizedMousePosition = useRef<MousePosition | null>(null);
    const bodyHovered = useRef<number>(-1);
    const bodyHoveredMouseDown = useRef<number | null>(null);

    //const controls = useSelector((state: RootState) => state.controls);
    const dispatch = useAppDispatch();

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
        bodyHoveredMouseDown.current = bodyHovered.current;
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        currentMousePosition.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };

        normalizedMousePosition.current = {
            x: (currentMousePosition.current.x / rect.width) * 2 - 1,
            y: -(currentMousePosition.current.y / rect.height) * 2 + 1,
        };

        if (!isDragging.current || !lastMousePosition.current) return;

        const deltaX = currentMousePosition.current.x - lastMousePosition.current.x;
        const deltaY = currentMousePosition.current.y - lastMousePosition.current.y;

        cameraRef.current!.yaw -= deltaX * cameraSensitivity;
        cameraRef.current!.pitch -= deltaY * cameraSensitivity;

        // Clamp pitch between -90 and 90
        cameraRef.current!.pitch = Math.max(
            Math.min(cameraRef.current!.pitch, Math.PI / 2 - 0.001),
            -Math.PI / 2 + 0.001,
        );

        lastMousePosition.current = currentMousePosition.current;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        lastMousePosition.current = null;
        console.log("md", bodyHoveredMouseDown.current);
        console.log("h", bodyHovered.current);
        if (bodyHoveredMouseDown.current !== -1 && bodyHoveredMouseDown.current === bodyHovered.current) {
            // Set body followed
            dispatch(controlsDispatch.setBodyFollowed(bodyHoveredMouseDown.current));
            bodyHoveredMouseDown.current = null;
        }
    };

    return {
        bodyHovered,
        normalizedMousePosition,
        handleMouseWheel,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    };
}
