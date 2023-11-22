import { postApi } from "@/api";
import { IPlace } from "@/interfaces/place";
import {
  startLoadingPlace,
  setPlaces,
  addPlace,
  updatePlace,
  deletePlace,
} from "./placeSlice";

//trae la lista de lugares
export const getPlaces = () => {
  // TODO: Infer types of dispatch and getState
  return async (dispatch: any, getState: any) => {
    dispatch(startLoadingPlace());

    try {
      const { data } = await postApi.get(`/lugar`);
      dispatch(setPlaces({ places: data as IPlace[] }));
    } catch (error) {
      console.log("Error fetching places list", error);
    }
  };
};

export const addPostThunk = (place: IPlace) => {
  // TODO: Infer types of dispatch and getState
  return async (dispatch: any, getState: any) => {
    const tempPlace = {
      categoriasPermitidas: place.categoriasPermitidas,
      nombre: place.nombre,
      _id: 1,
    };
    dispatch(startLoadingPlace());
    try {
      const { data } = await postApi.post(`/lugar`, tempPlace);
      dispatch(addPlace(place)); //Most be {data}. it's for test ***cambiar a llamada a API
    } catch (error) {
      console.log("Error in POST method", error);
    }
  };
};

export const updatePostThunk = (place: IPlace) => {
  // TODO: Infer types of dispatch and getState
  return async (dispatch: any, getState: any) => {
    console.log("place")
    console.log(place)
    dispatch(startLoadingPlace());
    if (place._id) {
      try {
        const { data } = await postApi.put(`/lugar/${place._id}`, place);
        console.log(data)
        dispatch(updatePlace(data));
      } catch (error) {
        console.log("Error in PUT method", error);
      }
      //This ELSE is because the "postApi" is an api fake
    } //else dispatch(updatePost(post));
  };
};

export const deletePostThunk = (_id: number) => {
  // TODO: Infer types of dispatch and getState
  return async (dispatch: any, getState: any) => {
    dispatch(startLoadingPlace());
    try {
      const { data } = await postApi.delete(`/lugar/${_id}`);
      dispatch(deletePlace(_id)); //Most be {data.id} intend. it's for test
    } catch (error) {
      console.log("Error in DELETE method", error);
    }
  };
};
