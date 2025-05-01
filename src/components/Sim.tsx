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
import fragLightGlobal from "../assets/shaders/lightGlobal.frag.glsl?raw"
import vertLightGlobal from "../assets/shaders/lightGlobal.vert.glsl?raw"
import fragLightStars from "../assets/shaders/lightStars.frag.glsl?raw"
import vertLightStars from "../assets/shaders/lightStars.vert.glsl?raw"

import { mat4, vec3 } from "gl-matrix";
import { setNormalAttribute, setPositionAttribute } from "../lib/webGL/attributes";
import { useMouseControls } from "../hooks/useMouseControls";

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
    starLightRef: React.RefObject<boolean>;
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
        sortByRef,
        starLightRef,
    } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const settings: UniverseSettings = {
        seed: "irrelevant",
        timeStep: 1.0 / 12.0, // time step in years (1 month)
        numBodies: 500,
        size: 20, // The size of the universe in astronomical units
        starThreshold: 0.8
    };

    const cameraRef = useRef<Camera>(new Camera(0, 0, 0, 0, 0, -20));
    const {handleMouseWheel, handleMouseDown, handleMouseMove, handleMouseUp} = useMouseControls(cameraRef, cameraSensititivy);

    const universe = useRef<Universe>(new Universe(settings, bodyFollowedRef, updateBodyFollowed, sortByRef));

    const programInfoRef = useRef<ProgramInfo>(null);

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
            /*****************************
             * Initialize shader programs
             *****************************/
            // Initialize shader program where light is generated from stars
            const starlightShaderProgram = initShaderProgram(gl, vertLightStars, fragLightStars);
            if (!starlightShaderProgram) {
                console.error("Failed to initialize shader program");
                return;
            }
            const starlightShaderProgramInfo: ProgramInfo = {
                name: "starlight",
                program: starlightShaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(starlightShaderProgram, "aVertexPosition"),
                    vertexColor: gl.getAttribLocation(starlightShaderProgram, "aVertexColor"),
                    vertexNormal: gl.getAttribLocation(starlightShaderProgram, "aVertexNormal"),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(starlightShaderProgram, "uProjectionMatrix"),
                    modelMatrix: gl.getUniformLocation(starlightShaderProgram, "uModelMatrix"),
                    viewMatrix: gl.getUniformLocation(starlightShaderProgram, "uViewMatrix"),
                    modelViewMatrix: gl.getUniformLocation(starlightShaderProgram, "uModelViewMatrix"),
                    normalMatrix: gl.getUniformLocation(starlightShaderProgram, "uNormalMatrix"),
                    uFragColor: gl.getUniformLocation(starlightShaderProgram, "uFragColor"),
                    uStarLocations: gl.getUniformLocation(starlightShaderProgram, "uStarLocations"),
                    uNumStars: gl.getUniformLocation(starlightShaderProgram, "uNumStars"),
                    uIsStar: gl.getUniformLocation(starlightShaderProgram, "uIsStar"),
                },
            };

            // Initialize shader program where light is generated from the camera
            const camlightShaderProgram = initShaderProgram(gl, vertLightGlobal, fragLightGlobal);
            if (!camlightShaderProgram) {
                console.error("Failed to initialize shader program B");
                return;
            }
            const camlightProgramInfo: ProgramInfo = {
                name: "camlight",
                program: camlightShaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(camlightShaderProgram, "aVertexPosition"),
                    vertexColor: gl.getAttribLocation(camlightShaderProgram, "aVertexColor"),
                    vertexNormal: gl.getAttribLocation(camlightShaderProgram, "aVertexNormal"),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(camlightShaderProgram, "uProjectionMatrix"),
                    modelMatrix: gl.getUniformLocation(camlightShaderProgram, "uModelMatrix"),
                    viewMatrix: gl.getUniformLocation(camlightShaderProgram, "uViewMatrix"),
                    modelViewMatrix: gl.getUniformLocation(camlightShaderProgram, "uModelViewMatrix"),
                    normalMatrix: gl.getUniformLocation(camlightShaderProgram, "uNormalMatrix"),
                    uFragColor: gl.getUniformLocation(camlightShaderProgram, "uFragColor"),
                    uStarLocations: gl.getUniformLocation(camlightShaderProgram, "uStarLocations"),
                    uNumStars: gl.getUniformLocation(camlightShaderProgram, "uNumStars"),
                    uIsStar: gl.getUniformLocation(camlightShaderProgram, "uIsStar"),
                },
            }

            programInfoRef.current = camlightProgramInfo;

            /*****************************
             * Load Model Buffers
             *****************************/
            const sphere = await getModel("uvSphereSmooth.glb");
            const buffers = initBuffers(gl, sphere);
            if (!buffers) {
                console.error("Failed to initialize buffers");
                return;
            }

            /*

            */
            let then = 0;
            let accumulatedTime = 0;
            function render(now: number) {
                now *= 0.001; // convert to seconds
                const deltaTime = now - then;
                then = now;
                accumulatedTime += deltaTime;

                if (starLightRef.current === true && programInfoRef.current?.name !== "starlight") {
                    programInfoRef.current = starlightShaderProgramInfo;
                } else if (starLightRef.current === false && programInfoRef.current?.name !== "camlight") {
                    programInfoRef.current = camlightProgramInfo;
                }

                if (!programInfoRef.current) {
                    console.error("Program info not found");
                    return;
                }

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

                /*
                    Render scene from universe
                */
                if (!gl) {
                    console.error("WebGL context not found");
                    return;
                }

                gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
                gl.clearDepth(1.0); // Clear everything
                gl.enable(gl.DEPTH_TEST); // Enable depth testing
                gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        
                // Clear the canvas before we start drawing on it.
        
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
                // Create a perspective matrix, a special matrix that is
                // used to simulate the distortion of perspective in a camera.
                // Our field of view is 45 degrees, with a width/height
                // ratio that matches the display size of the canvas
                // and we only want to see objects between 0.1 units
                // and 100 units away from the camera.
        
                const fieldOfView = (45 * Math.PI) / 180; // in radians
                const canvas = gl.canvas as HTMLCanvasElement;
                const aspect = canvas.clientWidth / canvas.clientHeight;
                const zNear = 0.1;
                const zFar = 100.0;
        
                /*
                    Binding buffers
                */
                // Tell WebGL how to pull out the positions from the position
                // buffer into the vertexPosition attribute.
                setPositionAttribute(gl, buffers, programInfoRef.current);
                setNormalAttribute(gl, buffers, programInfoRef.current);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
                gl.useProgram(programInfoRef.current.program);
        
                /*
                    Create Projection Matrix
                */
                const projectionMatrix = mat4.create();
        
                // note: glMatrix always has the first argument
                // as the destination to receive the result.
                mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        
                // Set the shader uniform for projection matrix
                gl.uniformMatrix4fv(programInfoRef.current.uniformLocations.projectionMatrix, false, projectionMatrix);
        
                // Create a view matrix for the camera
        
                // Update the camera position to the current position of the followed body
                if (bodyFollowedRef.current !== -1) {
                    cameraRef.current.setTarget(
                        universe.current.positionsX[bodyFollowedRef.current],
                        universe.current.positionsY[bodyFollowedRef.current],
                        universe.current.positionsZ[bodyFollowedRef.current],
                    );
                }
                const cameraMatrix = cameraRef.current.getViewMatrix();
        
                for (let i = 0; i < universe.current.settings.numBodies; i++) {
                    if (!universe.current.bodiesActive[i]) {
                        continue;
                    }
                    const modelMatrix = mat4.create();
                    mat4.translate(modelMatrix, modelMatrix, [universe.current.positionsX[i], universe.current.positionsY[i], universe.current.positionsZ[i]]);
                    mat4.scale(modelMatrix, modelMatrix, [universe.current.radii[i], universe.current.radii[i], universe.current.radii[i]]);
        
                    // Create model view matrix
                    const modelViewMatrix = mat4.create();
                    mat4.multiply(modelViewMatrix, cameraMatrix, modelMatrix);
        
                    // Create normal matrix
                    const normalMatrix = mat4.create();
                    mat4.invert(normalMatrix, modelViewMatrix);
                    mat4.transpose(normalMatrix, normalMatrix);
        
                    // Sets shader uniforms for model normals
                    gl.uniformMatrix4fv(programInfoRef.current.uniformLocations.modelMatrix, false, modelMatrix);
                    gl.uniformMatrix4fv(programInfoRef.current.uniformLocations.viewMatrix, false, cameraMatrix);
                    gl.uniformMatrix4fv(programInfoRef.current.uniformLocations.modelViewMatrix, false, modelViewMatrix);
                    gl.uniformMatrix4fv(programInfoRef.current.uniformLocations.normalMatrix, false, normalMatrix);
                    gl.uniform4fv(programInfoRef.current.uniformLocations.uFragColor, [
                        universe.current.colorsR[i],
                        universe.current.colorsG[i],
                        universe.current.colorsB[i],
                        1.0,
                    ]);
                    const isStar = universe.current.isStar(i) ? 1 : 0;

                    // Gets each of the stars' locations for the purpose of creating a lighting shader
                    const starLocs: Array<vec3> = universe.current.getStarLocations();
                    const flattenedStarLocs = starLocs.flatMap((vec) => [vec[0], vec[1], vec[2]]);
                    const numStars = starLocs.length;

                    gl.uniform3fv(programInfoRef.current.uniformLocations.uStarLocations, flattenedStarLocs);
                    gl.uniform1i(programInfoRef.current.uniformLocations.uNumStars, numStars);

                    gl.uniform1i(programInfoRef.current.uniformLocations.uIsStar, isStar);
                    {
                        const type = gl.UNSIGNED_SHORT;
                        const offset = 0;
                        gl.drawElements(gl.TRIANGLES, sphere.indexCount, type, offset);
                    }
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