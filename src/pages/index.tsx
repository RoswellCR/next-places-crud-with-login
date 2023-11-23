import { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonGroup from "@mui/material/ButtonGroup";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid/";

import { AddButton } from "@/components/buttons/";
import { PostLayout } from "../components/layout/PostLayout";
import { FormDialog } from "../components/posts/formDialog";
import { SearchInput } from "../components/ui/";
import { DeleteDialog } from "../components/posts/deleteDialog";

import Notify from "@/components/toast/notify";
import { IPost } from "@/interfaces";
import { getPlaces } from "@/redux/slices/post";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IPlace } from "@/interfaces/place";
import { AuthDialog } from "@/components/auth/authDialog";

export default function PostsPage() {
  const [userNameConnected, setUserNameConnected] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [postId, setPostId] = useState(-1);
  const [isUpdate, setIsUpdate] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openFormAuth, setOpenFormAuth] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editPost, setEditPost] = useState<IPlace>();
  const [isLoggingIn,setIsLoggingIn] = useState(true)
  const { isLoading, places } = useAppSelector((state) => state.place);
  //console.log(places)
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("Pidiendo lista");
    dispatch(getPlaces());
  }, []);

  const filteredPlace =
    places &&
    places.filter((place: IPlace) =>
      place.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleClickOpenDeleteDialog = (id: number) => {
    setPostId(id);
    setOpenDeleteDialog(true);
  };

  function handleEdit(id: string) {
    const editableData: IPlace = places.find(
      (place: IPlace) => place._id === id
    );
    // console.log("editableData")
    // console.log(id)
    setEditPost(editableData);
    setIsUpdate(true);
    setOpenForm(true);
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.2 },
    { field: "nombre", headerName: "Nombre", flex: 0.4 },
    { field: "categoriasPermitidas", headerName: "Categorías", flex: 0.4 },
    {
      field: "options",
      headerName: "Options",
      width: 120,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <ButtonGroup variant="text" aria-label="text button group">
            <Button
              color="info"
              onClick={() => handleEdit(row.id)}
              startIcon={<EditOutlinedIcon />}
            ></Button>
            <Button
              color="error"
              onClick={() => handleClickOpenDeleteDialog(row.id)}
              endIcon={<DeleteIcon />}
            ></Button>
          </ButtonGroup>
        );
      },
    },
  ];
  //console.log("<<<filtered p>>>>" + JSON.stringify(filteredPlace))

  const rows =
    filteredPlace &&
    filteredPlace.map((place: IPlace) => ({
      id: place._id,
      nombre: place.nombre,
      categoriasPermitidas: place.categoriasPermitidas[0],
    }));
  return (
    <>
    <PostLayout 
          title="Lugares"
          icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 24 }} />}
          userNameConnected={userNameConnected}
          setOpenFormAuth={setOpenFormAuth}
          setCurrentStep={setCurrentStep}
        >
      {currentStep == 0 && 
        <AuthDialog
        setCurrentStep={setCurrentStep} 
        openFormAuth={openFormAuth}
        isLoggingIn={isLoggingIn}
        setIsLoggingIn={setIsLoggingIn}
        setOpenFormAuth={setOpenFormAuth}
        setUserNameConnected={setUserNameConnected}
        
        />
      }
      {currentStep == 1 && (
        <>
          <Grid
            container
            spacing={2}
            sx={{
              mt: 2,
              paddingLeft: 4,
              paddingRight: 4,
              minWidth: 700,
              minHeight: 300,
            }}
          >
            <Grid item xs={8}>
              {/* Add new place */}
              <AddButton setOpenForm={setOpenForm} />
            </Grid>
            <Grid
              item
              xs={4}
              className="border"
              sx={{ width: "100%", height: "100%" }}
            >
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </Grid>
            <Grid item xs={12} sx={{ minWidth: 700, minHeight: 340 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                hideFooterSelectedRowCount
                loading={isLoading}
                // density="compact"
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 4 },
                  },
                }}
                pageSizeOptions={[4, 8, 16]}
              />
            </Grid>
          </Grid>
          <FormDialog
            openForm={openForm}
            editPost={editPost}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            setOpenForm={setOpenForm}
            setEditPost={setEditPost}
          />

          <DeleteDialog
            postId={postId}
            setPostId={setPostId}
            openDeleteDialog={openDeleteDialog}
            setOpenDeleteDialog={setOpenDeleteDialog}
          />

          <Notify />
        
        </>
          
      )}
      {currentStep == 2 && 
        <h2>{"Work Here"}</h2>
      }
      </PostLayout>
    </>
  );
}
