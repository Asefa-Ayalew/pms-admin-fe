import tabRouteReducer from "@/src/app/_store/routeReducers";
import authReducer from "@/src/shared/auth/auth-slice/auth-slice";
import entityListReducer from "@/src/shared/store/slice/entity-list/entity-list-slice";
import { configureStore } from "@reduxjs/toolkit";
import { appApi } from "./app.api";

export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    authReducer,
    entityListReducer,
    tabRouteReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([appApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
