import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactElement } from "react";

type Popup = {
  content: ReactElement;
  style: any;
  visible: boolean;
};

interface popupState {
  popups: Popup[];
}

const initialState: popupState = {
  popups: [],
};

const hide = createAsyncThunk("popups/remove", async () => {
  return await new Promise((resolve) => setTimeout(resolve as () => void, 300));
});

const popupSlice = createSlice({
  name: "popupReducer",
  initialState,
  reducers: {
    full: (state, action: PayloadAction<ReactElement>) => {
      state.popups.push({
        content: action.payload,
        style: {
          position: "absolute",
          top: 0,
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "#FFF",
          overflow: "auto",
        },
        visible: true,
      });
    },
    middle: (state, action: PayloadAction<ReactElement>) => {
      state.popups.push({
        content: action.payload,
        style: {
          width: 'fit-content',
          height: 'fit-content',
          margin: 'auto',
          inset: 0,
          alignItems: 'center',
          justifyContent: 'center',
          position: "fixed",
        },
        visible: true,
      });
    },
    top: (state, action: PayloadAction<ReactElement>) => {
      state.popups.push({
        content: action.payload,
        style: { top: 0 },
        visible: true,
      });
    },
    left: (state, action: PayloadAction<ReactElement>) => {
      state.popups.push({
        content: action.payload,
        style: {
          right: 0,
          width: "70%",
          height: "100%",
        },
        visible: true,
      });
    },
    bottom: (state, action: PayloadAction<ReactElement>) => {
      state.popups.push({
        content: action.payload,
        style: {
          position: "absolute",
          bottom: 0,
          width: "100%",
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
        visible: true,
      });
    },
    right: (state, action: PayloadAction<ReactElement>) => {
      state.popups.push({
        content: action.payload,
        style: { right: 0 },
        visible: true,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hide.pending, (state) => {
        state.popups[state.popups.length - 1].visible = false;
      })
      .addCase(hide.fulfilled, (state) => {
        state.popups.pop();
      });
  },
});

export const { full, middle, top, left, bottom, right } = popupSlice.actions;

export { hide };
const popupReducer = popupSlice.reducer;

export default popupReducer;
