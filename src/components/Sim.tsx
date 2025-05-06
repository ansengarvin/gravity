import { useEffect, useRef } from "react";
import { CamlightProgramInfo, LightingMode, StarlightProgramInfo } from "../lib/webGL/shaderPrograms";
import { initShaderProgram } from "../lib/webGL/shaders";
import { initBuffers } from "../lib/webGL/buffers";
import { getModel } from "../lib/gltf/model";
import { Universe, UniverseSettings } from "../lib/universe/universe";
import { Camera } from "../lib/webGL/camera";
import styled from "@emotion/styled";

// Note: Vite allows us to import a raw file. This is okay in this instance, since glsl files are just text.
import fragLightGlobal from "../assets/shaders/camlight/camlight.frag.glsl?raw";
import vertLightGlobal from "../assets/shaders/camlight/camlight.vert.glsl?raw";
import fragLightStars from "../assets/shaders/starlight/starlight.frag.glsl?raw";
import vertLightStars from "../assets/shaders/starlight/starlight.vert.glsl?raw";

import { mat4, vec4 } from "gl-matrix";
import { setNormalAttribute, setPositionAttribute } from "../lib/webGL/attributes";
import { useMouseControls } from "../hooks/useMouseControls";
import { useTouchControls } from "../hooks/useTouchControls";
import { calculateUniformVectors } from "./DebugStats";
import { LeaderboardBody } from "./Leaderboard";

const ticksPerSecond = 60;
const secondsPerTick = 1 / ticksPerSecond;
const cameraSensititivy = 0.01;
const fieldOfView = (45 * Math.PI) / 180; // in radians
const zNear = 0.1;
const zFar = 100.0;

interface SimProps {
    // debug information
    setMaxVertexUniformVectors: React.Dispatch<React.SetStateAction<number>>;
    setMaxFragmentUniformVectors: React.Dispatch<React.SetStateAction<number>>;
    setMaxUniformBufferBindingPoints: React.Dispatch<React.SetStateAction<number>>;
    setNumActiveBodies: React.Dispatch<React.SetStateAction<number>>;
    setNumActiveUniforms: React.Dispatch<React.SetStateAction<number>>;
    setNumActiveUniformVectors: React.Dispatch<React.SetStateAction<number>>;
    setNumStars: React.Dispatch<React.SetStateAction<number>>;

    // leaderboard information
    setLeaderboardBodies: React.Dispatch<React.SetStateAction<Array<LeaderboardBody>>>;
    bodyFollowed: number;
    setBodyFollowed: React.Dispatch<React.SetStateAction<number>>;

    lightingMode: LightingMode;

    // miscellaneous controls
    resetSim: React.RefObject<boolean>;
    paused: boolean;
}

export function Sim(props: SimProps) {
    const {
        setMaxVertexUniformVectors,
        setMaxFragmentUniformVectors,
        setMaxUniformBufferBindingPoints,
        setNumActiveBodies,
        setNumActiveUniforms,
        setNumActiveUniformVectors,
        setLeaderboardBodies,
        setNumStars,
        bodyFollowed,
        setBodyFollowed,
        lightingMode,
        resetSim,
        paused,
    } = props;

    // For now, hard-code universe settings. We will eventually want these to be user-controlled.
    const settings: UniverseSettings = {
        seed: "irrelevant",
        timeStep: 1.0 / 12.0, // time step in years (1 month)
        numBodies: 500,
        size: 20, // The size of the universe in astronomical units
        starThreshold: 0.8,
    };

    /*
        Camera and universe classes are placed inside of refs to ensure that they are not caught up in re-renders.
    */
    const cameraRef = useRef<Camera>(new Camera(0, 0, 0, 0, 0, -20));
    const { handleMouseWheel, handleMouseDown, handleMouseMove, handleMouseUp } = useMouseControls(
        cameraRef,
        cameraSensititivy,
    );
    const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchControls(cameraRef, cameraSensititivy);

    const universe = useRef<Universe>(new Universe(settings));

    /*
        The WebGL render function doesn't have access to state variables as they update, so we need to use refs
        and effects to update the refs. This ensures that the render function always has the latest values.
    */
    const pausedRef = useRef(paused);
    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    const bodyFollowedRef = useRef(bodyFollowed);
    useEffect(() => {
        setLeaderboardBodies(universe.current.getActiveBodies(bodyFollowed));
        bodyFollowedRef.current = bodyFollowed;
    }, [bodyFollowed]);

    const lightingModeRef = useRef(lightingMode);
    useEffect(() => {
        lightingModeRef.current = lightingMode;
    }, [lightingMode]);

    /*
        Set up WebGL Renderer
    */
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas element not found");
            return;
        }

        const gl = canvas.getContext("webgl2");
        if (!gl) {
            alert("Unable to initialize WebGL.");
            return;
        }

        const initialize = async () => {
            // Set sorted universe parameters initially
            setNumActiveBodies(universe.current.numActive);
            setLeaderboardBodies(universe.current.getActiveBodies(bodyFollowed));

            // Set unchanging webGL debug text
            setMaxVertexUniformVectors(gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
            setMaxFragmentUniformVectors(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
            setMaxUniformBufferBindingPoints(gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS));

            // Initialize all shader programs
            const camlightShaderProgram = initShaderProgram(gl, vertLightGlobal, fragLightGlobal);
            if (!camlightShaderProgram) {
                console.error("Failed to initialize camera light shader");
                return;
            }
            const camlightProgramInfo: CamlightProgramInfo = {
                program: camlightShaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(camlightShaderProgram, "aVertexPosition"),
                    vertexNormal: gl.getAttribLocation(camlightShaderProgram, "aVertexNormal"),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(camlightShaderProgram, "uProjectionMatrix"),
                    modelViewMatrix: gl.getUniformLocation(camlightShaderProgram, "uModelViewMatrix"),
                    normalMatrix: gl.getUniformLocation(camlightShaderProgram, "uNormalMatrix"),
                    uFragColor: gl.getUniformLocation(camlightShaderProgram, "uFragColor"),
                },
            };

            const starlightShaderProgram = initShaderProgram(gl, vertLightStars, fragLightStars);
            if (!starlightShaderProgram) {
                console.error("Failed to initialize shader program");
                return;
            }
            const starlightProgramInfo: StarlightProgramInfo = {
                program: starlightShaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(starlightShaderProgram, "aVertexPosition"),
                    vertexNormal: gl.getAttribLocation(starlightShaderProgram, "aVertexNormal"),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(starlightShaderProgram, "uProjectionMatrix"),
                    modelMatrix: gl.getUniformLocation(starlightShaderProgram, "uModelMatrix"),
                    modelViewMatrix: gl.getUniformLocation(starlightShaderProgram, "uModelViewMatrix"),
                    normalMatrix: gl.getUniformLocation(starlightShaderProgram, "uNormalMatrix"),
                    uFragColor: gl.getUniformLocation(starlightShaderProgram, "uFragColor"),
                    uStarLocations: gl.getUniformLocation(starlightShaderProgram, "uStarLocations"),
                    uNumStars: gl.getUniformLocation(starlightShaderProgram, "uNumStars"),
                    uIsStar: gl.getUniformLocation(starlightShaderProgram, "uIsStar"),
                },
            };
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
                Projection matrix does not need to change every render.
            */

            let then = 0;
            let accumulatedTime = 0;
            function render(now: number) {
                now *= 0.001; // convert to seconds
                const deltaTime = now - then;
                then = now;
                accumulatedTime += deltaTime;

                if (resetSim.current) {
                    cameraRef.current.setAll(0, 0, 0, 0, 0, -20);
                    setBodyFollowed(-1);
                    universe.current.reset();
                    resetSim.current = false;
                }

                //Update the universe simulation
                while (accumulatedTime >= secondsPerTick) {
                    if (!pausedRef.current) {
                        universe.current.updateEuler(secondsPerTick);
                        setNumActiveBodies(universe.current.numActive);
                        setLeaderboardBodies(universe.current.getActiveBodies(bodyFollowedRef.current));
                        setNumStars(universe.current.getNumStars());
                    } else {
                    }
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
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                // Create Projection Matrix (used by all shaders)
                const projectionMatrix = mat4.create();
                const canvas = gl.canvas as HTMLCanvasElement;
                const aspect = canvas.clientWidth / canvas.clientHeight;
                mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

                // Create View Matrix (used by all shaders)
                if (bodyFollowedRef.current !== -1) {
                    cameraRef.current.setTarget(
                        universe.current.positionsX[bodyFollowedRef.current],
                        universe.current.positionsY[bodyFollowedRef.current],
                        universe.current.positionsZ[bodyFollowedRef.current],
                    );
                }
                const viewMatrix = cameraRef.current.getViewMatrix();

                switch (lightingModeRef.current) {
                    case LightingMode.CAMLIGHT: {
                        // Bind Buffers
                        setPositionAttribute(gl, buffers, camlightProgramInfo.attribLocations);
                        setNormalAttribute(gl, buffers, camlightProgramInfo.attribLocations);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
                        gl.useProgram(camlightProgramInfo.program);

                        // Bind projection matrix
                        gl.uniformMatrix4fv(
                            camlightProgramInfo.uniformLocations.projectionMatrix,
                            false,
                            projectionMatrix,
                        );

                        break;
                    }
                    case LightingMode.STARLIGHT: {
                        // Bind Buffers
                        setPositionAttribute(gl, buffers, starlightProgramInfo.attribLocations);
                        setNormalAttribute(gl, buffers, starlightProgramInfo.attribLocations);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
                        gl.useProgram(starlightProgramInfo.program);

                        // Bind projection matrix
                        gl.uniformMatrix4fv(
                            starlightProgramInfo.uniformLocations.projectionMatrix,
                            false,
                            projectionMatrix,
                        );

                        // Data for calculating star light
                        const starData: Array<vec4> = universe.current.getStarData();
                        const flattenedStarLocs = starData.flatMap((vec) => [vec[0], vec[1], vec[2]]);
                        gl.uniform3fv(starlightProgramInfo.uniformLocations.uStarLocations, flattenedStarLocs);
                        const numStars = starData.length;
                        gl.uniform1i(starlightProgramInfo.uniformLocations.uNumStars, numStars);

                        break;
                    }
                }

                for (let i = 0; i < universe.current.settings.numBodies; i++) {
                    if (!universe.current.bodiesActive[i]) {
                        continue;
                    }

                    const modelMatrix = mat4.create();
                    mat4.translate(modelMatrix, modelMatrix, [
                        universe.current.positionsX[i],
                        universe.current.positionsY[i],
                        universe.current.positionsZ[i],
                    ]);
                    mat4.scale(modelMatrix, modelMatrix, [
                        universe.current.radii[i],
                        universe.current.radii[i],
                        universe.current.radii[i],
                    ]);

                    const modelViewMatrix = mat4.create();
                    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);

                    const normalMatrix = mat4.create();
                    mat4.invert(normalMatrix, modelViewMatrix);
                    mat4.transpose(normalMatrix, normalMatrix);

                    // Bind uniforms based on current lighting mode
                    switch (lightingModeRef.current) {
                        case LightingMode.CAMLIGHT: {
                            gl.uniformMatrix4fv(
                                camlightProgramInfo.uniformLocations.modelViewMatrix,
                                false,
                                modelViewMatrix,
                            );
                            gl.uniformMatrix4fv(camlightProgramInfo.uniformLocations.normalMatrix, false, normalMatrix);
                            gl.uniform4fv(camlightProgramInfo.uniformLocations.uFragColor, [
                                universe.current.colorsR[i],
                                universe.current.colorsG[i],
                                universe.current.colorsB[i],
                                1.0,
                            ]);

                            setNumActiveUniforms(
                                gl.getProgramParameter(camlightProgramInfo.program, gl.ACTIVE_UNIFORMS),
                            );
                            setNumActiveUniformVectors(calculateUniformVectors(gl, camlightProgramInfo.program));
                            break;
                        }
                        case LightingMode.STARLIGHT: {
                            gl.uniformMatrix4fv(starlightProgramInfo.uniformLocations.modelMatrix, false, modelMatrix);
                            gl.uniformMatrix4fv(
                                starlightProgramInfo.uniformLocations.modelViewMatrix,
                                false,
                                modelViewMatrix,
                            );
                            gl.uniformMatrix4fv(
                                starlightProgramInfo.uniformLocations.normalMatrix,
                                false,
                                normalMatrix,
                            );
                            const isStar = universe.current.isStar(i) ? 1 : 0;
                            gl.uniform1i(starlightProgramInfo.uniformLocations.uIsStar, isStar);
                            gl.uniform4fv(starlightProgramInfo.uniformLocations.uFragColor, [
                                universe.current.colorsR[i],
                                universe.current.colorsG[i],
                                universe.current.colorsB[i],
                                1.0,
                            ]);
                            setNumActiveUniforms(
                                gl.getProgramParameter(starlightProgramInfo.program, gl.ACTIVE_UNIFORMS),
                            );
                            setNumActiveUniformVectors(calculateUniformVectors(gl, starlightProgramInfo.program));
                            break;
                        }
                    }

                    // Draw each sphere
                    {
                        const type = gl.UNSIGNED_SHORT;
                        const offset = 0;
                        gl.drawElements(gl.TRIANGLES, sphere.indexCount, type, offset);
                    }
                }

                // set debug information

                requestAnimationFrame(render);
            }

            requestAnimationFrame(render);
        };

        initialize();
    }, []); // Runs once when the component mounts

    return (
        <SimCanvas
            ref={canvasRef}
            height={"1080px"}
            width={"1920px"}
            onWheel={handleMouseWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        />
    );
}

const SimCanvas = styled.canvas`
    height: 100%;
    width: 100%;
    display: block;
    touch-action: none;
`;
