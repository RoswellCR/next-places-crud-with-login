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
import { ICategory } from '../../interfaces/category';

interface Props {
  isUpdateCat: boolean;
  openFormCat: boolean;
  editPostCat?: ICategory;
  setEditPostCat: (value: ICategory) => void;
  setIsUpdateCat: (value: boolean) => void;
  setOpenFormCat: (openForm: boolean) => void;
}

export const FormDialogCat: FC<Props> = ({
  editPostCat,
  openFormCat,
  isUpdateCat,
  setEditPostCat,
  setOpenFormCat,
  setIsUpdateCat,
}) => {
  const [nombre, setNombre] = useState<string>("");
  const [categoriasPermitidas, setCategoriasPermitidas] = useState<string[]>([]);

  const { isLoadingCat } = useAppSelector((state) => state.category);
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
    console.log("editcat")
    console.log(editPostCat)
    editPostCat && editPostCat.nombre && setNombre(editPostCat.nombre);
    
  }, [editPostCat]);

  // Validation not only whitespace
  const validateInput = (value: string) => validateTrim(value);

  //funcion para cerrar , tambien resetea el componente
  const handleClose = () => {
    setOpenFormCat(false);
    setNombre("");
    setEditPostCat({ id: "", nombre: "" });
    reset();
    setIsUpdateCat(false);
  };

  //funcion para crear un nuevo lugar
  const handleAddPost = async () => {
    if (!nombre) return;

    const newCat: ICategory = {
      id:generateRandomString(),
      nombre: nombre
    };

    try {
      await dispatch(addPostThunk(newCat));
      toast.success("The category was created successfully");
    } catch (error) {
      toast.error("Error during insert category");
    }
    handleClose();
  };

  const handleEditPost = async () => {
    if (!nombre ) return;

    //guardo en nombre y en catPerm lo que se modifico y se le añade a editedPost que se enviara a la funcion que ejecuta la actualizacion
    const editedCat = {
      id: editPostCat?.id,
      nombre: nombre,
    } as ICategory;

    try {
      await dispatch(updatePostThunk(editedCat));
      toast.success("The category was successfully updated");
    } catch (error) {
      toast.error("Error during update category");
    }
    handleClose();
  };

  return (
    <Dialog open={openFormCat} onClose={() => handleClose()}>
      <form onSubmit={handleSubmit(isUpdateCat ? handleEditPost : handleAddPost)}>
        <DialogTitle>{isUpdateCat ? "Editar Categoria" : "Añadir una nueva categoria"}</DialogTitle>
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
          
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="inherit">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoadingCat} color="primary">
            {isUpdateCat ? "Editar Categoria" : "Añadir Categoria"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
