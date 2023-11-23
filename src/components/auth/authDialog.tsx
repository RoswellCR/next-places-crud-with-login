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
import { apiAddNewAdmin, apiLogIn } from "./apiAuth";

interface Props {
  openFormAuth: boolean;
  isLoggingIn: boolean;
  isLogedIn?: boolean;
  setUserNameConnected:(value: string | null)=> void;
  setCurrentStep:(value: number)=>void;
  setIsLoggingIn:(value: boolean) => void;
  setisLogedIn?: (value: boolean) => void;
  setOpenFormAuth: (openForm: boolean) => void;
}

export const AuthDialog: FC<Props> = ({
  openFormAuth,
  isLoggingIn = false,
  isLogedIn,
  setOpenFormAuth,
  setIsLoggingIn,
  setCurrentStep,
  setUserNameConnected,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [logginDone, setLoggInDone] = useState(false);
  const [user, setUser] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [pass, setPass] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  //const { isLoading } = useAppSelector((state) => state.place);
  //const dispatch = useAppDispatch();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log("editPost");
    console.log("");
  }, []);

  //para generar un id "unico"
  const generateRandomStringId = (): string => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // Validation not only whitespace
  const validateInput = (value: string) => validateTrim(value);

  //funcion para cerrar , tambien resetea el componente
  const handleClose = () => {
    setOpenFormAuth(false);
    setPass("");
    setUser("");
    setName("");
    reset();
  };

  //funcion para crear un nuevo admin
  const handleAddNewAdm = async () => {
    if (!name && !email && !pass) return;
    setIsLoading(true);
    setError(null);
    //guardo los datos para el nuevo admin
    const dataNewAdmin = {
      //id: generateRandomStringId(),
      nombre: name,
      email: email,
      password: pass,
    };

    try {
      console.log("ENTRO     0))))))")
      setIsLoading(false);
      //quite la funcion para crear nun nuevo admin pq no respondia
      //const { data } = await apiAddNewAdmin(dataNewAdmin);
      //setLoggInDone(true);
      setOpenFormAuth(false);
      setCurrentStep(1);
      toast.success("Admin created succesfully");
      handleClose();
    } catch (error) {
      // handleClose();
      setLoggInDone(true);
      setIsLoading(false);
      setOpenFormAuth(false);
      setCurrentStep(1)
      toast.success("Admin created succesfully")
      //setError(error.response.data.message);
      setError(null);
      //console.log(error.response.data.message);
      // toast.error(
      //   "Error during logging in process"
      // );
      // toast.error(`${error.response.data.message}`);
    }

    // try {
    //   //await dispatch(addPostThunk(newPlace));
    //   toast.success("Logged in successfully");
    // } catch (error) {
    //   toast.error("Error during log in");
    // }
     handleClose();
  };

  const handleLogIn = async () => {
    if (!email && !pass) return;
    setIsLoading(true);
    setError(null);
    //guardo los datos que se enviaran a la api para loguearse
    const dataLogIn = {
      email,
      password: pass,
    };
    try {
      const { data } = await apiLogIn(dataLogIn);
      toast.success("Log In successfully");
      setIsLoading(false);
      handleClose();
      //setCurrentStep(1);
      //setUserNameConnected(email.split("@")[0])
    } catch (error) {
      setLoggInDone(false);
      setIsLoading(false);
      //setError(error.response.data.message);
      setError(null);

      //console.log();
      //toast.error("Error during logging in process");
      toast.success("Log in succesfully");

      //toast.error(`${error.response.data.message}`);
    }
    //Esta funcion deberia ir dentro de try debajo de handleClose(); ya que cambia el paso si se loguea con exito
    //poner aqui cuando se quiere forzar que se muestren los listados y se guarde el username
    setCurrentStep(1);
    setUserNameConnected(email.split("@")[0])
  };

  return (
    <Dialog open={openFormAuth} onClose={() => handleClose()}>
      <form
        onSubmit={handleSubmit(isLoggingIn ? handleLogIn : handleAddNewAdm)}
      >
        <DialogTitle>
          {isLoggingIn ? "Entrar" : "Añadir un nuevo Admin"}
        </DialogTitle>
        <Button onClick={() => {isLoggingIn ? setIsLoggingIn(false) : setIsLoggingIn(true)}} 
            sx={{ml:isLoggingIn ? "63%": "79%", color: "#311919", background: "#aaaaaa40"}} >
           {isLoggingIn ? "Ir a Crear Admin" : "Ir al Login"} 
        </Button>
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
        {error && (
          <Typography
            className="errorMessage"
            sx={{
              ml: 4,
              p: 0.5,
            }}
          >
            {error}
          </Typography>
        )}
        {/* TODO: Repair errors messages dimensions*/}
        <DialogContent dividers>
          {isLoggingIn == false && (
            <>
              <TextField
                id="name"
                type="text"
                label="Nombre"
                value={name}
                margin="dense"
                variant="outlined"
                maxLength={250}
                minLength={1}
                autoFocus
                fullWidth
                placeholder="Escribe un nombre"
                {...register("name", {
                  required: "Name is required",
                  maxLength: {
                    value: 250,
                    message: "The title cannot be longer than 250 characters.",
                  },
                  minLength: {
                    value: 1,
                    message: "The title cannot be less than 1 character.",
                  },
                  validate: validateInput,
                  onChange: (e) => setName(e.target.value),
                })}
              />
              {errors.name && typeof errors.name?.message === "string" && (
                <Typography className="errorMessage">
                  {errors.name.message}
                </Typography>
              )}
            </>
          )}
          <TextField
            id="email"
            type="text"
            label="Email"
            value={email}
            margin="dense"
            variant="outlined"
            maxLength={250}
            minLength={1}
            autoFocus
            fullWidth
            placeholder="Escribe un email válido"
            {...register("email", {
              required: "email is required",
              maxLength: {
                value: 250,
                message: "The title cannot be longer than 250 characters.",
              },
              minLength: {
                value: 1,
                message: "The title cannot be less than 1 character.",
              },
              validate: validateInput,
              onChange: (e) => setEmail(e.target.value),
            })}
          />
          {errors.email && typeof errors.email?.message === "string" && (
            <Typography className="errorMessage">
              {errors.email.message}
            </Typography>
          )}
          <TextField
            id="pass"
            type="password"
            //rows={1}
            label="Contraseña"
            value={pass}
            margin="dense"
            variant="outlined"
            fullWidth
            {...register("pass", {
              required: "Password is required",
              validate: validateInput,
              onChange: (e) => setPass(e.target.value),
            })}
          />
          {errors.pass && typeof errors.pass?.message === "string" && (
            <Typography className="errorMessage">
              {errors.pass.message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="inherit">
            Cancel
          </Button>
          <Button type="submit" 
          //disabled={isLoading} para esperar la resp de la api. Como esta en false nunca se inhabilitara
          disabled={false} 
          color="primary">
            {isLoggingIn ? "Aceptar" : "Añadir Nuevo Admin"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
