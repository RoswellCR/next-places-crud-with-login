import { postApi } from "@/api";

export async function apiLogIn(params: any) {
  const res = await postApi.post(`/administrador/login/`, {
    params,
  });
  const data = await res.data;
  if (!data) {
    return {
      notFound: true,
    };
  } else {
    return {
      data,
    };
  }
}

export async function apiAddNewAdmin(params: any) {
    const res = await postApi.post(`/administrador/`, {
      params,
    });
    const data = await res.data;
    if (!data) {
      return {
        notFound: true,
      };
    } else {
      return {
        data,
      };
    }
  }
