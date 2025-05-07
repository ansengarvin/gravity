import React from "react";

interface googleSVGProps {
    color?: string;
    dim?: string;
    children: React.ReactNode;
}

// All google icon SVGs have this format.
export function GoogleSVG(props: googleSVGProps) {
    const { color="black", dim = "100%", children } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={dim} viewBox="0 -960 960 960" width={dim} fill={color}>
            {children}
        </svg>
    );
}
