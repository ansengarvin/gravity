import { useEffect, useRef } from "react";
import { ProgramInfo } from "../lib/webGL/programInfo";
import { initShaderProgram } from "../lib/webGL/shaders";
import { initBuffers } from "../lib/webGL/buffers";
import { getModel } from "../lib/gltf/model";
import { Universe, UniverseCamera, UniverseSettings } from "../lib/universe/universe";

const ticksPerSecond = 60;
const secondsPerTick = 1 / ticksPerSecond;
const cameraSensititivy = 0.1;

interface SimProps {
    height: string,
    width: string
}

export function Sim(props: SimProps) {
    const {height, width} = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const settings: UniverseSettings = {
        seed: "irrelevant",
        timeStep: 1.0 / 12.0, // time step in years (1 month)
        numBodies: 500,
        size: 20, // The size of the universe in astronomical units
    };

    const cameraRef = useRef<UniverseCamera>({
        zoom: -10,
        pitch: 0.0,
        yaw: 0.0,
        x: 0.0,
        y: 0.0,
        z: 0.0,
    });

    const isDragging = useRef(false);
    const lastMousePosition = useRef<{ x: number; y: number } | null>(null);

    const universe = useRef<Universe>(new Universe(settings, cameraRef));

    const handleMouseWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
        cameraRef.current.zoom -= event.deltaY * 0.01;
        cameraRef.current.zoom = Math.min(Math.max(cameraRef.current.zoom, -50), -5);
        console.log(cameraRef.current.zoom);
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

            cameraRef.current.yaw += deltaX * cameraSensititivy;
            cameraRef.current.pitch += deltaY * cameraSensititivy;

            // Clamp pitch between -90 and 90
            if (cameraRef.current.pitch > Math.PI / 2) {
                cameraRef.current.pitch = Math.PI / 2;
            }
            if (cameraRef.current.pitch < -Math.PI / 2) {
                cameraRef.current.pitch = -Math.PI / 2;
            }

            console.log(`Mouse dragged by: (${deltaX}, ${deltaY})`);

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
            const sphere = await getModel("uvsphere.glb");

            // Initialize a shader program; this is where all the lighting
            // for the vertices and so forth is established.
            const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

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
                    uFragColor: gl.getUniformLocation(shaderProgram, "uFragColor")
                },
            };

            const buffers = initBuffers(gl, sphere);

            console.log(universe.current.positionsX);
            let then = 0;
            let accumulatedTime = 0;
            function render(now: number) {
                now *= 0.001; // convert to seconds
                const deltaTime = now - then;
                then = now;
                accumulatedTime += deltaTime;

                //Update the universe simulation
                while (accumulatedTime >= secondsPerTick) {
                    universe.current.updateEuler(secondsPerTick);
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
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onWheel={handleMouseWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        ></canvas>
    );
}

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec3 vTransformedNormal;
    varying highp vec4 vPosition;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTransformedNormal = mat3(uNormalMatrix) * aVertexNormal;
      vPosition = uModelViewMatrix * aVertexPosition;
    }
  `;

const fsSource = `
    uniform highp vec4 uFragColor;

    varying highp vec3 vTransformedNormal;
    varying highp vec4 vPosition;

    void main(void) {
        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

        highp vec3 normal = normalize(vTransformedNormal);
        highp float directional = max(dot(normal, directionalVector), 0.0);

        highp vec3 lighting = ambientLight + (directionalLightColor * directional);
        gl_FragColor = vec4(uFragColor.rgb * lighting, uFragColor.a);
    }
`;
