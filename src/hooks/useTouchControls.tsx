import { useRef } from "react";
import { Camera } from "../lib/webGL/camera";

export function useTouchControls(cameraRef: React.RefObject<Camera>, cameraSensitivity: number) {
    const isDragging = useRef(false);
    const lastTouchPosition = useRef<{ x: number; y: number } | null>(null);
    const lastTouch2Position = useRef<{ x: number; y: number } | null>(null);

    /*
        Touch Controls
    */
    const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
        isDragging.current = true;
        const touch = event.touches[0];
        const rect = event.currentTarget.getBoundingClientRect();
        lastTouchPosition.current = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDragging.current || !lastTouchPosition.current) return;

        // One-Touch: Camera pans
        if (event.touches.length == 1) {
            const touch = event.touches[0];
            const rect = event.currentTarget.getBoundingClientRect();
            const currentMousePosition = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };

            const deltaX = currentMousePosition.x - lastTouchPosition.current.x;
            const deltaY = currentMousePosition.y - lastTouchPosition.current.y;

            cameraRef.current!.yaw -= deltaX * cameraSensitivity;
            cameraRef.current!.pitch -= deltaY * cameraSensitivity;

            // Clamp pitch between -90 and 90
            cameraRef.current!.pitch = Math.max(
                Math.min(cameraRef.current!.pitch, Math.PI / 2 - 0.001),
                -Math.PI / 2 + 0.001,
            );

            lastTouchPosition.current = currentMousePosition;
        }

        // Two-touch: Camera zooms
        else if (event.touches.length > 1) {
            const rect = event.currentTarget.getBoundingClientRect();

            const touch = event.touches[0];
            const touch2 = event.touches[1];

            // Initialize second touch position (not necessarily handled by touchStart)
            if (!lastTouch2Position.current) {
                lastTouch2Position.current = {
                    x: touch2.clientX - rect.left,
                    y: touch2.clientY - rect.top,
                };
            }

            const currentTouchPosition = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };
            const currentTouch2Position = {
                x: touch2.clientX - rect.left,
                y: touch2.clientY - rect.top,
            };

            // Calculate previous and current distance between touch points
            const prevDistance = Math.sqrt(
                Math.pow(lastTouchPosition.current.x - lastTouch2Position.current.x, 2) +
                    Math.pow(lastTouchPosition.current.y - lastTouch2Position.current.y, 2),
            );
            const currentDistance = Math.sqrt(
                Math.pow(currentTouchPosition.x - currentTouch2Position.x, 2) +
                    Math.pow(currentTouchPosition.y - currentTouch2Position.y, 2),
            );

            const zoomDelta = prevDistance - currentDistance;
            const minZoom = 1;
            const maxZoom = 50;
            cameraRef.current!.zoom -= zoomDelta * 0.01;
            cameraRef.current!.zoom = Math.min(Math.max(cameraRef.current!.zoom, -1 * maxZoom), -1 * minZoom);
            lastTouchPosition.current = currentTouchPosition;
            lastTouch2Position.current = currentTouch2Position;
        }
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
        lastTouchPosition.current = null;
    };

    return { handleTouchStart, handleTouchMove, handleTouchEnd };
}
