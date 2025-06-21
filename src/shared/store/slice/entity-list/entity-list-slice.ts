import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { CollectionQuery } from "@/src/shared/models/collection.model";

export interface EntityListStateModel {
  key: string;
  collection: CollectionQuery;
}

export interface EntityListState {
  collections: EntityListStateModel[];
  viewAll: boolean;
}

const initialState: EntityListState = {
  collections: [],
  viewAll: false,
};

export const entityListSlice = createSlice({
  name: "entityList",
  initialState,
  reducers: {
    setEntityListCollection: (
      state,
      action: PayloadAction<{
        key: string | undefined;
        collection: CollectionQuery;
      }>
    ): void => {
      const { key, collection } = action.payload;
      const exists = state.collections.find((c) => c.key === key);

      if (exists) {
        state.collections = state.collections.map((c) =>
          c.key === key ? { key, collection } : c
        );
      } else {
        if (key) state.collections.push({ key, collection });
      }
    },

    removeEntityListCollection: (
      state,
      action: PayloadAction<string>
    ): void => {
      state.collections = state.collections.filter(
        (collection) => collection.key !== action.payload
      );
    },

    setUiState: (state, action: PayloadAction<boolean>): void => {
      state.viewAll = action.payload;
    },
  },
});

export const {
  setEntityListCollection,
  removeEntityListCollection,
  setUiState,
} = entityListSlice.actions;

export default entityListSlice.reducer;
