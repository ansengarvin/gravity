import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface binaryDataSliceState {
    noiseTex: Uint8Array | null;
    noiseTexError: string | null;
}

const initialState: binaryDataSliceState = {
    noiseTex: null,
    noiseTexError: null,
};

function printRGBAValuesFromUint8Array(arr: Uint8Array, max: number) {
    let output = "";
    for (let i = 0; i < max; i++) {
        output += `${arr[i]} `;
    }
    console.log(output);
}

const fetchNoiseTex = createAsyncThunk("binaryData/fetchNoiseTex", async (_, thunkAPI) => {
    const response = await fetch("/assets/noise.tex.bin");
    if (!response.ok) {
        return thunkAPI.rejectWithValue("Failed to fetch noise texture");
    }
    console.log(response);
    const data = await response.arrayBuffer();
    const arr = new Uint8Array(data);
    console.log("test");
    printRGBAValuesFromUint8Array(arr, 100); // Print first 10 RGBA values for debugging
    return arr;
});

const binaryDataSlice = createSlice({
    name: "binaryData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNoiseTex.pending, (state) => {
                state.noiseTex = null; // Reset noise texture while loading
            })
            .addCase(fetchNoiseTex.fulfilled, (state, action) => {
                state.noiseTex = action.payload;
                console.log("First values:");
                console.log("noiseTex[0]:", action.payload[0]);
                console.log("noiseTex[1]:", action.payload[1]);
                console.log("noiseTex[2]:", action.payload[2]);
                console.log("noiseTex[3]:", action.payload[3]);
            })
            .addCase(fetchNoiseTex.rejected, (state, action) => {
                console.error("Failed to fetch noise texture:", action.payload);
                state.noiseTex = null; // Reset noise texture on error
                state.noiseTexError = action.payload as string; // Store error message
            });
    },
});

export const binaryDataDispatch = {
    fetchNoiseTex,
};
export default binaryDataSlice.reducer;
