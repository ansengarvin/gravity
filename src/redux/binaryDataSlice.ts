import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface binaryDataSliceState {
    noiseTex: Uint8Array | null;
    noiseTexError: string | null;
}

const initialState: binaryDataSliceState = {
    noiseTex: null,
    noiseTexError: null,
};

export function printUint8ArrayNumeric(arr: Uint8Array, max: number) {
    let output = "";
    for (let i = 0; i < max; i++) {
        output += `${arr[i]} `;
    }
    console.log(output);
}

export function printUint8ArrayAscii(arr: Uint8Array, max: number) {
    let output = "";
    for (let i = 0; i < max; i++) {
        output += String.fromCharCode(arr[i]);
    }
    console.log(output);
}

const fetchNoiseTex = createAsyncThunk("binaryData/fetchNoiseTex", async (_, thunkAPI) => {
    const response = await fetch("assets/noise.tex.bin");
    if (!response.ok) {
        return thunkAPI.rejectWithValue("Failed to fetch noise texture");
    }
    const data = await response.arrayBuffer();
    const arr = new Uint8Array(data);
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
