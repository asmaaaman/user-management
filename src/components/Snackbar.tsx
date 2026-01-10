import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SnackbarDialog = ({
  snackbarOpen,
  setSnackbarOpen,
}: {
  snackbarOpen: boolean;
  setSnackbarOpen: (open: boolean) => void;
}) => {
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={() => setSnackbarOpen(false)}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        Selected users deleted successfully
      </Alert>
    </Snackbar>
  );
};

export default SnackbarDialog;
