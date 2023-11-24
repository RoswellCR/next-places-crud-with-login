import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPlace } from "@/interfaces/place";
import { ICategory } from '../../../interfaces/category';
export interface CatState {
  categories: ICategory[];
  isLoadingCat: boolean;
}
// Define the initial state using that type
const initialState = {
  categories: [],
  isLoadingCat: false,
} as any;

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    startLoadingCat: (state) => {
      state.isLoadingCat = true;
    },
    setCat: (state, action) => {
      state.isLoadingCat = false;
      state.categories = action.payload.categories;
    },
    addCat: (state, action: PayloadAction<any>) => {
      state.isLoadingCat = false;
      const { id, nombre } = action.payload;
      state.places.unshift({ id, nombre });
    },
    updateCat: (state, action: PayloadAction<any>) => {
      state.isLoadingCat = false;
      const { id, nombre} = action.payload;
      const catIndex = state.categories.findIndex((cat: any) => cat.id === id);
      if (catIndex !== -1) {
        state.places[catIndex].nombre = nombre;
      }
    },
    deleteCat: (state, action: PayloadAction<any>) => {
      state.isLoadingCat = false;
      const catId = action.payload;
      state.categories = state.categories.filter((cat: ICategory) => cat.id !== catId);
    },
  },
});

export const { startLoadingCat, setCat, addCat, updateCat, deleteCat } =
  categorySlice.actions;

export default categorySlice.reducer;
