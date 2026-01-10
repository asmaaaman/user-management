import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  count: number;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteDialog({
  open,
  count,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Delete selected users?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          You are about to delete <b>{count}</b> user{count === 1 ? "" : "s"}.
          This action can’t be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          color="error"
          variant="contained"
        >
          {loading ? "Deleting..." : "Confirm delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
