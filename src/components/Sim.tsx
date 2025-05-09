import { useEffect, useRef } from "react";
import {
    BloomProgramInfo,
    CamlightProgramInfo,
    GaussianBlurProgramInfo,
    LightingMode,
    StarlightProgramInfo,
    TexQuadProgramInfo,
} from "../lib/webGL/shaderPrograms";
import { initShaderProgram } from "../lib/webGL/shaders";
import { initBuffers } from "../lib/webGL/buffers";
import { getModel, Model } from "../lib/gltf/model";
import { Universe, UniverseSettings } from "../lib/universe/universe";
import { Camera } from "../lib/webGL/camera";
import styled from "@emotion/styled";

// Note: Vite allows us to import a raw file. This is okay in this instance, since glsl files are just text.
import fragLightGlobal from "../assets/shaders/camlight/camlight.frag.glsl?raw";
import vertLightGlobal from "../assets/shaders/camlight/camlight.vert.glsl?raw";
import fragLightStars from "../assets/shaders/starlight/starlight.frag.glsl?raw";
import vertLightStars from "../assets/shaders/starlight/starlight.vert.glsl?raw";
import fragTexQuad from "../assets/shaders/texQuad/texQuad.frag.glsl?raw";
import vertTexQuad from "../assets/shaders/texQuad/texQuad.vert.glsl?raw";
import fragGaussianBlur from "../assets/shaders/gaussianBlur/gaussianBlur.frag.glsl?raw";
import vertGaussianBlur from "../assets/shaders/gaussianBlur/gaussianBlur.vert.glsl?raw";
import fragBloom from "../assets/shaders/bloom/bloom.frag.glsl?raw";
import vertBloom from "../assets/shaders/bloom/bloom.vert.glsl?raw";

import { mat4, vec4 } from "gl-matrix";
import {
    setNormalAttribute,
    setPositionAttribute,
    setPositionAttribute2D,
    setTexCoordAttribute,
} from "../lib/webGL/attributes";
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
    setMaxSamples: React.Dispatch<React.SetStateAction<number>>;
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
    resetSim: number;
    resetCam: number;
    paused: boolean;
    renderToTexture: boolean;
}

export function Sim(props: SimProps) {
    const {
        setMaxVertexUniformVectors,
        setMaxFragmentUniformVectors,
        setMaxUniformBufferBindingPoints,
        setMaxSamples,
        setNumActiveBodies,
        setNumActiveUniforms,
        setNumActiveUniformVectors,
        setLeaderboardBodies,
        setNumStars,
        bodyFollowed,
        setBodyFollowed,
        lightingMode,
        resetSim,
        resetCam,
        paused,
        renderToTexture,
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

    useEffect(() => {
        cameraRef.current.setAll(0, 0, 0, 0, 0, -20);
        setBodyFollowed(-1);
        universe.current.reset();
        setNumActiveBodies(universe.current.numActive);
        setLeaderboardBodies(universe.current.getActiveBodies(-1));
        setNumStars(universe.current.getNumStars());
    }, [resetSim]);

    useEffect(() => {
        cameraRef.current.setTarget(0, 0, 0);
    }, [resetCam]);

    const renderToTextureRef = useRef(renderToTexture);
    useEffect(() => {
        renderToTextureRef.current = renderToTexture;
    }, [renderToTexture]);

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

        const gl = canvas.getContext("webgl2", { antialias: false });
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
            setMaxSamples(gl.getParameter(gl.MAX_SAMPLES));

            /*
                Initialize all shader programs
            */
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
                    texCoords: gl.getAttribLocation(camlightShaderProgram, "aTexCoords"),
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
                    texCoords: gl.getAttribLocation(starlightShaderProgram, "aTexCoords"),
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

            // Initialize texture shader for simple texture quad
            const texQuadShaderProgram = initShaderProgram(gl, vertTexQuad, fragTexQuad);
            if (!texQuadShaderProgram) {
                console.error("Failed to initialize texture shader program");
                return;
            }
            const texQuadProgramInfo: TexQuadProgramInfo = {
                program: texQuadShaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(texQuadShaderProgram, "aVertexPosition"),
                    vertexNormal: gl.getAttribLocation(texQuadShaderProgram, "aVertexNormal"),
                    texCoords: gl.getAttribLocation(texQuadShaderProgram, "aTexCoords"),
                },
                uniformLocations: {
                    uScreenTex: gl.getUniformLocation(texQuadShaderProgram, "uScreenTex"),
                },
            };

            // Intitialize bloom shader
            const gaussianBlurShaderProgram = initShaderProgram(gl, vertGaussianBlur, fragGaussianBlur);
            if (!gaussianBlurShaderProgram) {
                console.error("Failed to initialize bloom shader program");
                return;
            }
            const gaussianBlurProgramInfo: GaussianBlurProgramInfo = {
                program: gaussianBlurShaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(gaussianBlurShaderProgram, "aVertexPosition"),
                    vertexNormal: gl.getAttribLocation(gaussianBlurShaderProgram, "aVertexNormal"),
                    texCoords: gl.getAttribLocation(gaussianBlurShaderProgram, "aTexCoords"),
                },
                uniformLocations: {
                    uImage: gl.getUniformLocation(gaussianBlurShaderProgram, "uImage"),
                    uHorizontal: gl.getUniformLocation(gaussianBlurShaderProgram, "uHorizontal"),
                },
            };

            const bloomShaderProgram = initShaderProgram(gl, vertBloom, fragBloom);
            if (!bloomShaderProgram) {
                console.error("Failed to initialize bloom shader program");
                return;
            }
            const bloomProgramInfo: BloomProgramInfo = {
                program: bloomShaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(bloomShaderProgram, "aVertexPosition"),
                    vertexNormal: gl.getAttribLocation(bloomShaderProgram, "aVertexNormal"),
                    texCoords: gl.getAttribLocation(bloomShaderProgram, "aTexCoords"),
                },
                uniformLocations: {
                    uScene: gl.getUniformLocation(bloomShaderProgram, "uScene"),
                    uBloom: gl.getUniformLocation(bloomShaderProgram, "uBloom"),
                },
            };

            /*****************************
             * Load Model Buffers
             *****************************/
            const sphere = await getModel("uvSphereSmooth.glb");
            const sphereBuffers = initBuffers(gl, sphere);
            if (!sphereBuffers) {
                console.error("Failed to initialize buffers");
                return;
            }

            // Create a simple quad
            const quadModel: Model = {
                // positions: new Float32Array([
                //     -1.0, 1.0, 0.0,
                //     -1.0, -1.0, 0.0,
                //     1.0, -1.0, 0.0,
                //     -1.0, 1.0, 0.0,
                //     1.0, -1.0, 0.0,
                //     1.0, 1.0, 0.0
                // ]),
                positions: new Float32Array([-1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
                texCoords: new Float32Array([0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
                indices: new Uint16Array(),
                normals: new Float32Array(),
                indexCount: 0,
            };
            const quadBuffers = initBuffers(gl, quadModel);

            /*
                Custom framebuffer intitialization
            */

            // Create a color attachment texture
            // Below code does not MSAA properly
            /*
            const sceneFrameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFrameBuffer);

            const textureColorBuffer = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, textureColorBuffer);
            const texWidth = canvas.width;
            const texHeight = canvas.height;
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureColorBuffer, 0);

            // Create a depth buffer attachment texture
            const depthRenderBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
            */

            // Scene to texture with multisampling from the following source:
            // https://stackoverflow.com/questions/47934444/webgl-framebuffer-multisampling

            // Define textures
            const texWidth = canvas.width;
            const texHeight = canvas.height;

            // Define buffers
            const depthRenderBuffer = gl.createRenderbuffer();
            const sceneFrameBuffer = gl.createFramebuffer();
            const colorFrameBuffer = gl.createFramebuffer();
            const extractFrameBuffer = gl.createFramebuffer();
            const colorRenderBuffer = gl.createRenderbuffer();
            const starExtractRenderBuffer = gl.createRenderbuffer();

            gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
            gl.renderbufferStorageMultisample(
                gl.RENDERBUFFER,
                gl.getParameter(gl.MAX_SAMPLES),
                gl.DEPTH_COMPONENT24,
                texWidth,
                texHeight,
            );

            gl.bindRenderbuffer(gl.RENDERBUFFER, colorRenderBuffer);
            gl.renderbufferStorageMultisample(
                gl.RENDERBUFFER,
                gl.getParameter(gl.MAX_SAMPLES),
                gl.RGBA8,
                texWidth,
                texHeight,
            );

            gl.bindRenderbuffer(gl.RENDERBUFFER, starExtractRenderBuffer);
            gl.renderbufferStorageMultisample(
                gl.RENDERBUFFER,
                gl.getParameter(gl.MAX_SAMPLES),
                gl.RGBA8,
                texWidth,
                texHeight,
            );

            // Attach depth and color render buffer to the scene frame buffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFrameBuffer);
            gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]); // enable MRT
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorRenderBuffer);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.RENDERBUFFER, starExtractRenderBuffer);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);

            // Attach textures to color frame buffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, colorFrameBuffer);
            const textureColorBuffer = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, textureColorBuffer);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureColorBuffer, 0);

            // Texture to extract star colors to for bloom
            gl.bindFramebuffer(gl.FRAMEBUFFER, extractFrameBuffer);
            const starExtractBuffer = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, starExtractBuffer);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, starExtractBuffer, 0)

            /*
                Create bloom framebuffers
            */
            const bloomFrameBuffer: Array<WebGLFramebuffer> = [
                gl.createFramebuffer() as WebGLFramebuffer,
                gl.createFramebuffer() as WebGLFramebuffer,
            ]
            const bloomTextures: Array<WebGLTexture> = [
                gl.createTexture() as WebGLTexture,
                gl.createTexture() as WebGLTexture,
            ]
            for (let i = 0; i < bloomFrameBuffer.length; i++) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, bloomFrameBuffer[i]);
                gl.bindTexture(gl.TEXTURE_2D, bloomTextures[i]);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.framebufferTexture2D(
                    gl.FRAMEBUFFER,
                    gl.COLOR_ATTACHMENT0,
                    gl.TEXTURE_2D,
                    bloomTextures[i],
                    0,
                );
            }

            // Check if the framebuffer is complete
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
                console.error("Framebuffer is not complete");
            }

            /*
                Render Program
            */
            let then = 0;
            let accumulatedTime = 0;
            function render(now: number) {
                now *= 0.001; // convert to seconds
                const deltaTime = now - then;
                then = now;
                accumulatedTime += deltaTime;

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

                // Set GL active texture to the default of 0 for safety
                gl.activeTexture(gl.TEXTURE0);

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

                // Bind sphere buffers
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereBuffers.indices);
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffers.position);
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffers.normal);

                switch (lightingModeRef.current) {
                    case LightingMode.CAMLIGHT: {
                        // Bind Buffers
                        setPositionAttribute(gl, sphereBuffers, camlightProgramInfo.attribLocations);
                        setNormalAttribute(gl, sphereBuffers, camlightProgramInfo.attribLocations);

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
                        setPositionAttribute(gl, sphereBuffers, starlightProgramInfo.attribLocations);
                        setNormalAttribute(gl, sphereBuffers, starlightProgramInfo.attribLocations);
                        gl.useProgram(starlightProgramInfo.program);

                        // Bind projection matrix
                        gl.uniformMatrix4fv(
                            starlightProgramInfo.uniformLocations.projectionMatrix,
                            false,
                            projectionMatrix,
                        );

                        // Data for calculating star light
                        const starData: Array<vec4> = universe.current.getStarData();
                        const numStars = starData.length;
                        gl.uniform1i(starlightProgramInfo.uniformLocations.uNumStars, numStars);

                        if (numStars > 0) {
                            const flattenedStarLocs = starData.flatMap((vec) => [vec[0], vec[1], vec[2]]);
                            gl.uniform3fv(starlightProgramInfo.uniformLocations.uStarLocations, flattenedStarLocs);
                        }

                        break;
                    }
                }

                // First framebuffer pass

                if (renderToTextureRef.current) {
                    gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFrameBuffer);
                } else {
                    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                }
                gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
                gl.clearDepth(1.0); // Clear everything
                gl.enable(gl.DEPTH_TEST); // Enable depth testing
                gl.depthFunc(gl.LEQUAL); // Near things obscure far things
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                /*
                    Draw Scene
                */
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

                if (renderToTextureRef.current) {
                    /*
                        Antialiasing Pass
                    */
                    gl.readBuffer(gl.COLOR_ATTACHMENT0);
                    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, sceneFrameBuffer);
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, colorFrameBuffer);
                    gl.clearBufferfv(gl.COLOR, 0, [1.0, 1.0, 1.0, 1.0]);
                    gl.blitFramebuffer(
                        0,
                        0,
                        texWidth,
                        texHeight,
                        0,
                        0,
                        texWidth,
                        texHeight,
                        gl.COLOR_BUFFER_BIT,
                        gl.LINEAR,
                    );

                    gl.readBuffer(gl.COLOR_ATTACHMENT1);
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, extractFrameBuffer);
                    gl.blitFramebuffer(
                        0,
                        0,
                        texWidth,
                        texHeight,
                        0,
                        0,
                        texWidth,
                        texHeight,
                        gl.COLOR_BUFFER_BIT,
                        gl.LINEAR,
                    )
                    // gl.bindFramebuffer(gl.READ_FRAMEBUFFER, sceneFrameBuffer);

                    // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);

                    // gl.clearBufferfv(gl.COLOR, 0, [1.0, 1.0, 1.0, 1.0]);

                    // gl.blitFramebuffer(
                    //     0,
                    //     0,
                    //     canvas.width,
                    //     canvas.height,
                    //     0,
                    //     0,
                    //     canvas.width,
                    //     canvas.height,
                    //     gl.COLOR_BUFFER_BIT,
                    //     gl.LINEAR,
                    // );

                    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
                        console.error("Framebuffer is not complete");
                    }

                    /*
                        Bloom Blur
                    */

                    if (lightingModeRef.current == LightingMode.STARLIGHT) {
                        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffers.position);
                        gl.useProgram(gaussianBlurProgramInfo.program);
                        setPositionAttribute2D(gl, quadBuffers, gaussianBlurProgramInfo.attribLocations);
                        setTexCoordAttribute(gl, quadBuffers, gaussianBlurProgramInfo.attribLocations);

                        const blurAmount = 10;
                        let horizontal = 0;
                        let first_iteration = true;
                        for (let i = 0; i < blurAmount; i++) {
                            gl.bindFramebuffer(gl.FRAMEBUFFER, bloomFrameBuffer[horizontal]);
                            // Set horizontal int to horizontal
                            gl.uniform1i(gaussianBlurProgramInfo.uniformLocations.uHorizontal, horizontal);
                            // Set texture to read from
                            gl.bindTexture(gl.TEXTURE_2D, first_iteration ? starExtractBuffer : bloomTextures[1 - horizontal]);
                            gl.drawArrays(gl.TRIANGLES, 0, 6);
                            // Bind the next framebuffer

                            horizontal = 1 - horizontal;
                            if (first_iteration) {
                                first_iteration = false;
                            }
                        }


                        gl.useProgram(bloomProgramInfo.program);

                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, bloomTextures[horizontal]);
                        gl.uniform1i(bloomProgramInfo.uniformLocations.uBloom, 0);

                        gl.activeTexture(gl.TEXTURE1);
                        gl.bindTexture(gl.TEXTURE_2D, textureColorBuffer);
                        gl.uniform1i(bloomProgramInfo.uniformLocations.uScene, 1);

                        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                        gl.drawArrays(gl.TRIANGLES, 0, 6);
                    } else {
                        gl.useProgram(texQuadProgramInfo.program)
                        gl.bindTexture(gl.TEXTURE_2D, textureColorBuffer);
                        setPositionAttribute2D(gl, quadBuffers, texQuadProgramInfo.attribLocations);
                        setTexCoordAttribute(gl, quadBuffers, texQuadProgramInfo.attribLocations);

                        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                        gl.drawArrays(gl.TRIANGLES, 0, 6);
                    }
                    
                
                    

                    /*
                        Render scene texture to quad
                    */
                    // Bind null frame buffer to render quad-scene-texture
                    
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
