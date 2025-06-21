import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const tabRouteSlice = createSlice({
    name: "tabRoute",
    initialState: {
      routeName: "detail" as string | null,
    },
    reducers: {
      setRoute: (state, action: PayloadAction<string | null>): void => {
        state.routeName = action.payload;
      },
    },
  });
  

  export const { setRoute } = tabRouteSlice.actions;

  export default tabRouteSlice.reducer;