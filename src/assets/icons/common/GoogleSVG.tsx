import React from "react";

interface googleSVGProps {
    color: string;
    dim?: string; // If not provided, defaults to the size of the parent container
    children: React.ReactNode;
}

// All google icon SVGs have this format.
export function GoogleSVG(props: googleSVGProps) {
    const { color, dim, children } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={dim} viewBox="0 -960 960 960" width={dim} fill={color}>
            {children}
        </svg>
    );
}
