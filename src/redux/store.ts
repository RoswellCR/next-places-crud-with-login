import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import placeReducer from "./slices/post/placeSlice";
import categoryReducer from "./slices/categ/categorySlice";

const store = configureStore({
  reducer: {
    place: placeReducer,
    category: categoryReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
