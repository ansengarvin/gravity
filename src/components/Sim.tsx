import { useEffect, useRef } from "react";
import { ProgramInfo } from "../lib/webGL/programInfo";
import { initShaderProgram } from "../lib/webGL/shaders";
import { initBuffers } from "../lib/webGL/buffers";
import { getModel } from "../lib/gltf/model";
import { Universe, UniverseSettings } from "../lib/universe/universe";
import { LeaderboardBody } from "./leaderboard/LeaderboardBody";
import { Camera } from "../lib/webGL/camera";
import styled from "@emotion/styled";
import { sortQuery } from "../lib/defines/sortQuery";

// Note: Vite allows us to import a raw file. This is okay in this instance, since glsl files are just text.
import fragA from "../assets/shaders/lightGlobal.frag.glsl?raw"
import vert from "../assets/shaders/basic.vert.glsl?raw"

const ticksPerSecond = 60;
const secondsPerTick = 1 / ticksPerSecond;
const cameraSensititivy = 0.01;

interface SimProps {
    height: string;
    width: string;
    setNumActive: React.Dispatch<React.SetStateAction<number>>;
    setLeaderboardBodies: React.Dispatch<React.SetStateAction<Array<LeaderboardBody>>>;
    bodyFollowedRef: React.RefObject<number>;
    updateBodyFollowed: (newBodiesFollowed: number) => void;
    resetSim: React.RefObject<boolean>;
    pausedRef: React.RefObject<boolean>;
    sortByRef: React.RefObject<sortQuery>;
}

export function Sim(props: SimProps) {
    const {
        height,
        width,
        setNumActive,
        setLeaderboardBodies,
        bodyFollowedRef,
        updateBodyFollowed,
        resetSim,
        pausedRef,
        sortByRef
    } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const settings: UniverseSettings = {
        seed: "irrelevant",
        timeStep: 1.0 / 12.0, // time step in years (1 month)
        numBodies: 500,
        size: 20, // The size of the universe in astronomical units
    };

    const isDragging = useRef(false);
    const lastMousePosition = useRef<{ x: number; y: number } | null>(null);

    const cameraRef = useRef<Camera>(new Camera(0, 0, 0, 0, 0, -20));
    const universe = useRef<Universe>(new Universe(settings, cameraRef, bodyFollowedRef, updateBodyFollowed, sortByRef));

    const handleMouseWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
        cameraRef.current.zoom -= event.deltaY * 0.01;
        cameraRef.current.zoom = Math.min(Math.max(cameraRef.current.zoom, -50), -5);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        isDragging.current = true;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            lastMousePosition.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging.current || !lastMousePosition.current) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            const currentMousePosition = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };

            const deltaX = currentMousePosition.x - lastMousePosition.current.x;
            const deltaY = currentMousePosition.y - lastMousePosition.current.y;

            cameraRef.current.yaw -= deltaX * cameraSensititivy;
            cameraRef.current.pitch -= deltaY * cameraSensititivy;

            // Clamp pitch between -90 and 90
            if (cameraRef.current.pitch >= Math.PI / 2) {
                cameraRef.current.pitch = Math.PI / 2 - 0.001;
            }
            if (cameraRef.current.pitch < -Math.PI / 2) {
                cameraRef.current.pitch = -Math.PI / 2 + 0.001;
            }

            // Update the last mouse position
            lastMousePosition.current = currentMousePosition;

            // Add logic to handle dragging, e.g., panning the universe
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        lastMousePosition.current = null;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas element not found");
            return;
        }

        const gl = canvas.getContext("webgl");
        if (!gl) {
            alert("Unable to initialize WebGL.");
            return;
        }

        const initialize = async () => {
            /*
            Get the UV sphere model
            */
            const sphere = await getModel("uvSphereSmooth.glb");

            // Initialize a shader program; this is where all the lighting
            // for the vertices and so forth is established.
            const shaderProgram = initShaderProgram(gl, vert, fragA);

            if (!shaderProgram) {
                console.error("Failed to initialize shader program");
                return;
            }

            // Collect all the info needed to use the shader program.
            // Look up which attribute our shader program is using
            // for aVertexPosition and look up uniform locations.
            const programInfo: ProgramInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                    vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
                    vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                    modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                    normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
                    uFragColor: gl.getUniformLocation(shaderProgram, "uFragColor"),
                },
            };

            const buffers = initBuffers(gl, sphere);

            let then = 0;
            let accumulatedTime = 0;
            function render(now: number) {
                now *= 0.001; // convert to seconds
                const deltaTime = now - then;
                then = now;
                accumulatedTime += deltaTime;

                if (resetSim.current) {
                    cameraRef.current.setAll(0, 0, 0, 0, 0, -20);
                    updateBodyFollowed(-1);
                    universe.current.reset();
                    resetSim.current = false;
                }

                //Update the universe simulation
                while (accumulatedTime >= secondsPerTick) {
                    if (!pausedRef.current) {
                        universe.current.updateEuler(secondsPerTick);
                    }
                    setNumActive(universe.current.numActive);
                    setLeaderboardBodies(universe.current.getRankings());
                    accumulatedTime -= secondsPerTick;
                }

                if (gl) {
                    universe.current.draw(gl, programInfo, buffers, sphere.indexCount);
                }

                requestAnimationFrame(render);
            }

            requestAnimationFrame(render);
        };

        initialize();
    }, []); // Runs once when the component mounts

    return (
        <SimCanvas
            ref={canvasRef}
            height={height}
            width={width}
            onWheel={handleMouseWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        />
    );
}

const SimCanvas = styled.canvas`
    height: 100%;
    width: 100%;
    display: block;
`;