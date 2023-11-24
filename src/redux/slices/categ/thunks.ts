import { postApi } from "@/api";
import { ICategory } from "@/interfaces/category";

import {
  startLoadingCat,
  addCat,
  updateCat,
  deleteCat,
  setCat,
} from "./categorySlice";

//trae la lista de lugares
export const getCategories = () => {
  // TODO: Infer types of dispatch and getState
  return async (dispatch: any, getState: any) => {
    dispatch(startLoadingCat());

    try {
      const { data } = await postApi.get(`/categoria`);
      dispatch(setCat({ categories: data as ICategory[] }));
    } catch (error) {
      console.log("Error fetching categories list", error);
    }
  };
};

export const addCatThunk = (cat: ICategory) => {
  // TODO: Infer types of dispatch and getState
  return async (dispatch: any, getState: any) => {
    const tempCat = {
      nombre: cat.nombre,
      id: 1,
    };
    //console.log(tempPlace)
    dispatch(startLoadingCat());
    try {
      const { data } = await postApi.post(`/lugar`, cat);
      dispatch(addCat(cat)); //Most be {data}. it's for test ***cambiar a llamada a API
    } catch (error) {
      console.log("Error in Catgory POST method", error);
    }
  };
};

export const updateCatThunk = (cat: ICategory) => {
  // TODO: Infer types of dispatch and getState
  return async (dispatch: any, getState: any) => {
    console.log("categoria a actualizar")
    console.log(cat)
    dispatch(startLoadingCat());
    if (cat.id) {
      try {
        const { data } = await postApi.put(`/categoria/${cat.id}`, cat);
        console.log(data)
        dispatch(updateCat(data));
      } catch (error) {
        console.log("Error in category PUT method", error);
      }
      //This ELSE is because the "postApi" is an api fake
    } //else dispatch(updatePost(post));
  };
};

export const deleteCatThunk = (id: string) => {
  // TODO: Infer types of dispatch and getState
  return async (dispatch: any, getState: any) => {
    dispatch(startLoadingCat());
    try {
      const { data } = await postApi.delete(`/categoria/${id}`);
      dispatch(deleteCat(id)); //Most be {data.id} intend. it's for test
    } catch (error) {
      console.log("Error in DELETE categorie method", error);
    }
  };
};
// function setCats(arg0: { categories: ICategory[]; }): any {
//   throw new Error("Function not implemented.");
// }

