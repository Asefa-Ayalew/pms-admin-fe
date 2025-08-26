import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteCookie, getCookie } from "cookies-next";

export interface Auth {
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  role: any | null;
}

const validateJson = () => {
  if (getCookie("currentRole")) {
    try {
      const currentRole = getCookie("currentRole");
      return JSON.parse(currentRole as string);
    } catch (e) {
      console.log(e);
      deleteCookie("currentRole");
      return null;
    }
  }
};

const initialState: Auth = {
  loading: false,
  role: validateJson(),
};

export const authSlice = createSlice({
  name: "authLoading",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>): void => {
      state.loading = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setRole: (state, action: PayloadAction<any>): void => {
      state.role = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setRole } = authSlice.actions;
export default authSlice.reducer;
