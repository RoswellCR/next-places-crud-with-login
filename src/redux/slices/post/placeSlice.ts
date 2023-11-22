import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPlace } from "@/interfaces/place";
export interface PlaceState {
  places: IPlace[];
  isLoading: boolean;
}
// Define the initial state using that type
const initialState = {
  places: [],
  isLoading: false,
} as any;

export const placeSlice = createSlice({
  name: "place",
  initialState,
  reducers: {
    startLoadingPlace: (state) => {
      state.isLoading = true;
    },
    setPlaces: (state, action) => {
      state.isLoading = false;
      state.places = action.payload.places;
    },
    addPlace: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      const { _id, nombre, categoriasPermitidas } = action.payload;
      state.places.unshift({ _id, nombre, categoriasPermitidas }); //places or place?
    },
    updatePlace: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      const { _id, nombre, categoriasPermitidas } = action.payload;
      const placeIndex = state.places.findIndex((place: any) => place._id === _id);
      if (placeIndex !== -1) {
        state.places[placeIndex].nombre = nombre;
        state.places[placeIndex].categoriasPermitidas = categoriasPermitidas;
      }
    },
    deletePlace: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      const placeId = action.payload;
      state.places = state.places.filter((place: IPlace) => place._id !== placeId);
    },
  },
});

export const { startLoadingPlace, setPlaces, addPlace, updatePlace, deletePlace } =
  placeSlice.actions;

export default placeSlice.reducer;
