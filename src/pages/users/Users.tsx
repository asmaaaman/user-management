import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import ManagementTable from "../../components/ManagementTable";
import { useUsers } from "../../queries/useUsers";

const Users = () => {
  const { data: users, isLoading, isError } = useUsers();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ mt: 8 }}>
        <Alert severity="error">Failed to load users.</Alert>
      </Box>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Box sx={{ mt: 8, textAlign: "center", color: "#6b7280" }}>
        <Typography>No users found.</Typography>
      </Box>
    );
  }

  return <ManagementTable users={users} />;
};

export default Users;
