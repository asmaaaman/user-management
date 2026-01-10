import * as React from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { GridCheckCircleIcon } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ManagementTable from "../../components/ManagementTable";
import { useUsers } from "../../queries/useUsers";

import {
  deleteMultipleUsers,
  deleteUserById,
  getUserById,
  updateUserStatus,
} from "../../apis/users";
import type { User } from "../../types/users";

type FilterValue = "all" | "active" | "absent";

export default function Users() {
  const { data: users = [], isLoading, isError } = useUsers();
  const queryClient = useQueryClient();

  const [filter, setFilter] = React.useState<FilterValue>("all");
  const [selectedRows, setSelectedRows] = React.useState<
    Array<string | number>
  >([]);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteMode, setDeleteMode] = React.useState<"bulk" | "single">("bulk");
  const [targetUserId, setTargetUserId] = React.useState<
    string | number | null
  >(null);

  const [showAlert, setShowAlert] = React.useState(false);

  const [actionsAnchorEl, setActionsAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const [actionsUserId, setActionsUserId] = React.useState<
    string | number | null
  >(null);

  const [editOpen, setEditOpen] = React.useState(false);
  const [editUserId, setEditUserId] = React.useState<string | number | null>(
    null
  );

  const actionsOpen = Boolean(actionsAnchorEl);

  const tableRows =
    filter === "all"
      ? users
      : users.filter((u) => {
          if (filter === "active") return u.status === "active";
          else return u.status === filter;
        });

  const openSingleConfirm = (id: string | number) => {
    setDeleteMode("single");
    setTargetUserId(id);
    setConfirmOpen(true);
  };

  const openBulkConfirm = () => {
    if (selectedRows.length === 0) return;
    setDeleteMode("bulk");
    setConfirmOpen(true);
  };

  const handleOpenActions = (
    e: React.MouseEvent<HTMLElement>,
    id: string | number
  ) => {
    setActionsAnchorEl(e.currentTarget);
    setActionsUserId(id);
  };

  const handleCloseActions = () => {
    setActionsAnchorEl(null);
    setActionsUserId(null);
  };

  const userDetailsQuery = useQuery({
    queryKey: ["user", actionsUserId],
    queryFn: () => getUserById(actionsUserId as string | number),
    enabled: Boolean(actionsUserId),
  });
  const currentUser = userDetailsQuery.data as User | undefined;

  const singleDeleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteUserById(id),
    onSuccess: async () => {
      setConfirmOpen(false);
      handleCloseActions();
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    },
    onError: () => alert("Delete failed. Please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: Array<string | number>) => deleteMultipleUsers(ids),
    onSuccess: async () => {
      setConfirmOpen(false);
      setSelectedRows([]);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    },
    onError: () => alert("Delete failed. Please try again."),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (args: { id: string | number; status: "active" | "absent" }) =>
      updateUserStatus(args),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      await queryClient.invalidateQueries({
        queryKey: ["user", actionsUserId],
      });
      handleCloseActions();
    },
    onError: () => alert("Failed to update status"),
  });

  const handleToggleStatus = () => {
    if (!currentUser || !actionsUserId) return;
    const newStatus = currentUser.status === "active" ? "absent" : "active";
    toggleStatusMutation.mutate({ id: actionsUserId, status: newStatus });
  };

  const confirmDelete = () => {
    if (deleteMode === "bulk") {
      deleteMutation.mutate(selectedRows);
      return;
    }
    if (targetUserId != null) {
      singleDeleteMutation.mutate(targetUserId);
    }
  };

  const isDeleting = deleteMutation.isPending || singleDeleteMutation.isPending;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRowSelectionModelChange = (model: any) => {
    if (Array.isArray(model)) {
      setSelectedRows(model as Array<string | number>);
      return;
    }
    if (model?.type === "exclude") {
      setSelectedRows(tableRows.map((u) => u.id));
      return;
    }
    if (model?.ids instanceof Set) {
      setSelectedRows(Array.from(model.ids) as Array<string | number>);
      return;
    }
    setSelectedRows([]);
  };

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

  return (
    <Box className="m-4">
      {showAlert && (
        <Alert
          severity="success"
          icon={<GridCheckCircleIcon fontSize="inherit" />}
          onClose={() => setShowAlert(false)}
          sx={{ mb: 2 }}
        >
          Selected users deleted successfully
        </Alert>
      )}

      <ManagementTable
        rows={tableRows}
        filter={filter}
        onFilterChange={setFilter}
        selectedRows={selectedRows}
        onRowSelectionModelChange={onRowSelectionModelChange}
        // bulk delete
        onBulkDeleteClick={openBulkConfirm}
        isDeleting={isDeleting}
        // actions popover
        actionsOpen={actionsOpen}
        actionsAnchorEl={actionsAnchorEl}
        currentUser={currentUser}
        userDetailsLoading={userDetailsQuery.isLoading}
        onOpenActions={handleOpenActions}
        onCloseActions={handleCloseActions}
        // dialogs
        confirmOpen={confirmOpen}
        onCloseConfirm={() => setConfirmOpen(false)}
        onConfirmDelete={confirmDelete}
        // edit
        editOpen={editOpen}
        editUserId={editUserId}
        onOpenEdit={(id) => {
          setEditUserId(id);
          setEditOpen(true);
        }}
        onCloseEdit={() => {
          setEditOpen(false);
          setEditUserId(null);
        }}
        // single delete
        onOpenSingleDeleteConfirm={openSingleConfirm}
        // toggle
        onToggleStatus={handleToggleStatus}
        togglingStatus={toggleStatusMutation.isPending}
      />
    </Box>
  );
}
