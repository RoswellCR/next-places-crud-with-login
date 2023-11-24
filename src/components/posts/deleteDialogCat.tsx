import { FC } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import { toast } from "react-toastify";
import { deletePostThunk } from "@/redux/slices/post";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { deleteCatThunk } from "@/redux/slices/categ/thunks";

interface Props {
  postIdCat: string;
  setPostIdCat: (catId: string) => void;
  openDeleteDialogCat: boolean;
  setOpenDeleteDialogCat: (openDeleteDialog: boolean) => void;
}

export const DeleteDialogCat: FC<Props> = ({
  postIdCat,
  setPostIdCat,
  openDeleteDialogCat,
  setOpenDeleteDialogCat,
}) => {
  const { isLoadingCat } = useAppSelector((state) => state.category); //my State
  const dispatch = useAppDispatch();

  const handleCloseDeleteDialogCat = () => {
    setOpenDeleteDialogCat(false);
  };

  const handleRemovePost = async (id: string) => {
    try {
      await dispatch(deleteCatThunk(id));
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Error deleting category");
    }
    handleCloseDeleteDialogCat();
  };

  return (
    <div>
      <Dialog
        open={openDeleteDialogCat}
        onClose={handleCloseDeleteDialogCat}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to delete this category with ID: ${postIdCat}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you delete it, you won't be able to get it back.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleCloseDeleteDialogCat()}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => handleRemovePost(postIdCat)}
            color="error"
            disabled={false}
          >
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
