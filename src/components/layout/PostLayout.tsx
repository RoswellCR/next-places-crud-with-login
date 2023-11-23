import { FC } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PostsNavbar from "../ui/PostsNavbar";
import Button from "@mui/material/Button";
import { Divider } from "../../../node_modules/@mui/material/index";

interface Props {
  icon?: JSX.Element;
  title: string;
  userNameConnected: string | null;
  children: React.ReactNode;
  setOpenFormAuth: (value: boolean) => void;
  setCurrentStep: (value: number) => void;
}

export const PostLayout: FC<Props> = ({
  children,
  title,
  userNameConnected,
  icon,
  setOpenFormAuth,
  setCurrentStep,
}) => {
  return (
    <>
      <nav>
        <PostsNavbar userNameConnected = {userNameConnected}/>
      </nav>
      <main>
        <Box
          display="flex"
          sx={{
            mt: 10,
            paddingLeft: 4,
          }}
        >
          <Typography variant="h5" component="h1" sx={{maxHeight:"30px", maxWidth: "100px"}}>
            {icon} {title}
          </Typography>
          <Box sx={{display:"flex",flexDirection:"row",  justifyContent: "right", alignContent:"right", width: "95%"}}>
            <Button
              onClick={() => {
                setOpenFormAuth(true);
                setCurrentStep(0);
              }}
              sx={{ color: "#311919", background: "#aaaaaa40", m: 0.5 }}
            >
              {"Acceso y cuentas"}
            </Button>
            {userNameConnected || true ? (
              <>
                <Button
                  onClick={() => {
                    setCurrentStep(1);
                    setOpenFormAuth(false);
                  }}
                  sx={{ color: "#311919", background: "#aaaaaa40", m: 0.5 }}
                >
                  {"Gestión de lugares"}
                </Button>
                <Button
                  onClick={() => setCurrentStep(2)}
                  sx={{ color: "#311919", background: "#aaaaaa40", m: 0.5 }}
                >
                  {"Gestión de Visitantes"}
                </Button>
              </>
            ) : null}
          </Box>
        </Box>
        <Box className="fadeIn">{children}</Box>
      </main>
    </>
  );
};
