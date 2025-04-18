import { useEffect, useRef } from "react";
import { ProgramInfo } from "./lib/webGL/programInfo";
import { initShaderProgram } from "./lib/webGL/shaders";
import { initBuffers } from "./lib/webGL/buffers";
import { getModel } from "./lib/gltf/model";
import { Universe, UniverseSettings } from "./lib/universe/universe";

const ticksPerSecond = 60;
const secondsPerTick = 1 / ticksPerSecond;

export function Sim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
            const sphere = await getModel('uvsphere.glb');

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
                    vertexPosition: gl.getAttribLocation(
                        shaderProgram,
                        "aVertexPosition",
                    ),
                    vertexColor: gl.getAttribLocation(
                        shaderProgram,
                        "aVertexColor",
                    ),
                    vertexNormal: gl.getAttribLocation(
                        shaderProgram,
                        "aVertexNormal",
                    ),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(
                        shaderProgram,
                        "uProjectionMatrix",
                    ),
                    modelViewMatrix: gl.getUniformLocation(
                        shaderProgram,
                        "uModelViewMatrix",
                    ),
                    normalMatrix: gl.getUniformLocation(
                        shaderProgram,
                        "uNormalMatrix",
                    ),
                    uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
                },
            };

            const buffers = initBuffers(gl, sphere);

            const settings: UniverseSettings = {
                seed: "irrelevant",
                timeStep: 1.0 / 12.0, // time step in years (1 month)
                numBodies: 100,
                size: 20, // The size of the universe in astronomical units
            }

            const universe = new Universe(settings);
            universe.initialize();

            console.log(universe.positionsX)
            let then = 0;
            let accumulatedTime = 0;
            function render(now: number) {
                now *= 0.001; // convert to seconds
                const deltaTime = now - then;
                then = now;
                accumulatedTime += deltaTime;

                //Update the universe simulation
                while (accumulatedTime >= secondsPerTick) {
                    universe.updateEuler(secondsPerTick);
                    accumulatedTime -= secondsPerTick;
                }

                if (gl) {
                    universe.draw(
                        gl,
                        programInfo,
                        buffers,
                        sphere.indexCount,
                    )
                }

                requestAnimationFrame(render);
            }

            requestAnimationFrame(render);
        }

        initialize()
    }, []); // Runs once when the component mounts

    return <canvas ref={canvasRef} width="1000" height="750"></canvas>;
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
  varying highp vec3 vTransformedNormal;
  varying highp vec4 vPosition;

  void main(void) {
    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
    highp vec4 vColor = vec4(94.0, 156.0, 255.0, 255.0) / 255.0;

    highp vec3 normal = normalize(vTransformedNormal);
    highp float directional = max(dot(normal, directionalVector), 0.0);

    highp vec3 lighting = ambientLight + (directionalLightColor * directional);
    gl_FragColor = vec4(vColor.rgb * lighting, vColor.a);
  }
`;
