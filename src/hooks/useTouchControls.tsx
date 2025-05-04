import { useRef } from "react";
import { Camera } from "../lib/webGL/camera";

export function useTouchControls(cameraRef: React.RefObject<Camera>, cameraSensitivity: number) {
    const isDragging = useRef(false);
    const lastTouchPosition = useRef<{ x: number; y: number } | null>(null);

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
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
        lastTouchPosition.current = null;
    };

    return { handleTouchStart, handleTouchMove, handleTouchEnd };
}
