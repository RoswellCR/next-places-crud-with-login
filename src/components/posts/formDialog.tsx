import { FC, useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { IPost } from "@/interfaces";
import { validateTrim } from "@/util/validation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addPostThunk, updatePostThunk } from "@/redux/slices/post";
import { IPlace } from "@/interfaces/place";

interface Props {
  isUpdate: boolean;
  openForm: boolean;
  editPost?: IPlace;
  setEditPost: (value: IPlace) => void;
  setIsUpdate: (value: boolean) => void;
  setOpenForm: (openForm: boolean) => void;
}

export const FormDialog: FC<Props> = ({
  editPost,
  openForm,
  isUpdate,
  setEditPost,
  setOpenForm,
  setIsUpdate,
}) => {
  const [nombre, setNombre] = useState<string>("");
  const [categoriasPermitidas, setCategoriasPermitidas] = useState<string[]>([]);

  const { isLoading } = useAppSelector((state) => state.place);
  const dispatch = useAppDispatch();
  
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //para generar un id "unico"
  const generateRandomString = (): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < 10; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  useEffect(() => {
    console.log("editPost")
    console.log(editPost)
    editPost && editPost.nombre && setNombre(editPost.nombre);
    editPost && editPost.categoriasPermitidas && setCategoriasPermitidas(editPost.categoriasPermitidas);
  }, [editPost]);

  // Validation not only whitespace
  const validateInput = (value: string) => validateTrim(value);

  //funcion para cerrar , tambien resetea el componente
  const handleClose = () => {
    setOpenForm(false);
    setCategoriasPermitidas([]);
    setNombre("");
    setEditPost({ _id: "", nombre: "", categoriasPermitidas: [], });
    reset();
    setIsUpdate(false);
  };

  //funcion para crear un nuevo lugar
  const handleAddPost = async () => {
    if (!nombre && !categoriasPermitidas) return;

    const newPlace: IPlace = {
      _id:generateRandomString(),
      categoriasPermitidas : categoriasPermitidas,
      nombre: nombre
    };

    try {
      await dispatch(addPostThunk(newPlace));
      toast.success("The post was created successfully");
    } catch (error) {
      toast.error("Error during insert");
    }
    handleClose();
  };

  const handleEditPost = async () => {
    if (!nombre && !categoriasPermitidas) return;

    //guardo en nombre y en catPerm lo que se modifico y se le añade a editedPost que se enviara a la funcion que ejecuta la actualizacion
    const editedPost = {
      _id: editPost?._id,
      nombre: nombre,
      categoriasPermitidas: categoriasPermitidas,
      
    } as IPlace;

    try {
      await dispatch(updatePostThunk(editedPost));
      toast.success("The post was successfully updated");
    } catch (error) {
      toast.error("Error during update");
    }
    handleClose();
  };

  return (
    <Dialog open={openForm} onClose={() => handleClose()}>
      <form onSubmit={handleSubmit(isUpdate ? handleEditPost : handleAddPost)}>
        <DialogTitle>{isUpdate ? "Editar Lugar" : "Añadir un nuevo lugar"}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => handleClose()}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {/* TODO: Repair errors messages dimensions*/}
        <DialogContent dividers>
          <TextField
            id="nombre"
            type="text"
            label="Nombre"
            value={nombre}
            margin="dense"
            variant="outlined"
            maxLength={250}
            minLength={1}
            autoFocus
            fullWidth
            placeholder="Entra un nombre"
            {...register("nombre", {
              required: "Title is required",
              maxLength: {
                value: 250,
                message: "The title cannot be longer than 250 characters.",
              },
              minLength: {
                value: 1,
                message: "The title cannot be less than 1 character.",
              },
              validate: validateInput,
              onChange: (e) => setNombre(e.target.value),
            })}
          />
          {errors.nombre && typeof errors.nombre?.message === "string" && (
            <Typography className="errorMessage">
              {errors.nombre.message}
            </Typography>
          )}
          <TextField
            id="categoriasPermitidas"
            type="text"
            rows={4}
            label="Categorías Permitidas"
            value={categoriasPermitidas}
            margin="dense"
            variant="outlined"
            multiline
            fullWidth
            {...register("categoriasPermitidas", {
              required: "Description is required",
              validate: validateInput,
              onChange: (e) => setCategoriasPermitidas(e.target.value),
            })}
          />
          {errors.categoriasPermitidas && typeof errors.categoriasPermitidas?.message === "string" && (
            <Typography className="errorMessage">
              {errors.categoriasPermitidas.message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="inherit">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} color="primary">
            {isUpdate ? "Editar Lugar" : "Añadir Lugar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
