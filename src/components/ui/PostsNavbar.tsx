import { FC } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

interface Props {
  userNameConnected: string | null
}
const ButtonAppBar: FC<Props> = ({
  userNameConnected
}
)=> {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{ backdropFilter: "blur(5px)" }}
      >
        <Toolbar>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Link href="/" underline="none">
            <Typography
              variant="h6"
              sx={{ flexGrow: 1 }}
              className="text-inherit"
            >
              Administration
            </Typography>
          </Link>
          {userNameConnected ? <Typography
              sx={{ ml: "20px",fontSize: 20 }}
              className="text-inherit"
            >
              {`Bienvenid@ ${userNameConnected}`} 
            </Typography> : null}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default ButtonAppBar;