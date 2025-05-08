import { WebIO } from "@gltf-transform/core";

export interface Model {
    vertices: Float32Array;
    indices: Uint16Array;
    indexCount: number;
    normals: Float32Array;
    texCoords?: Float32Array;
}

export async function getModel(model: string): Promise<Model> {
    const io = new WebIO();
    const doc = await io.read(model);
    const mesh = doc.getRoot().listMeshes()[0];

    if (!mesh) {
        throw new Error("No mesh found in the glTF file.");
    }
    const primitive = mesh.listPrimitives()[0];
    if (!primitive) {
        throw new Error("No primitive found in the mesh.");
    }

    const positions = primitive.getAttribute("POSITION")?.getArray();
    const normals = primitive.getAttribute("NORMAL")?.getArray();
    const indices = primitive.getIndices()?.getArray();
    const texCoords = primitive.getAttribute("TEXCOORD_0")?.getArray();

    // Check vertex count is a multiple of 3
    if (positions && positions.length % 3 !== 0) {
        throw new Error("Vertex count is not a multiple of 3.");
    }

    return {
        indexCount: indices ? indices.length : 0,
        vertices: positions ? new Float32Array(positions) : new Float32Array(),
        indices: indices ? new Uint16Array(indices) : new Uint16Array(),
        normals: normals ? new Float32Array(normals) : new Float32Array(),
        texCoords: texCoords ? new Float32Array(texCoords) : undefined,
    };
}
