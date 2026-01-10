import {
  DataGrid,
  GridCheckCircleIcon,
  GridColDef,
  GridDeleteIcon,
  GridMoreVertIcon,
} from "@mui/x-data-grid";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import type { User } from "../types/users";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
} from "@mui/material";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Filter from "./Filter";
import { useState } from "react";
import CustomCheckbox from "./CheckBox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMultipleUsers,
  deleteUserById,
  getUserById,
  updateUserStatus,
} from "../apis/users";
import ConfirmDeleteDialog from "./ConfrimModal";
import EditUserDialog from "../pages/users/EditUser";

type Props = {
  users: User[];
};

const SortIcons = ({ direction }: { direction?: "asc" | "desc" }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      ml: 0.5,
      lineHeight: 1,
      color: "#9ca3af",
      userSelect: "none",
    }}
  >
    <KeyboardArrowUpIcon
      sx={{
        fontSize: 14,
        opacity: direction === "asc" ? 1 : 0.35,
      }}
    />
    <KeyboardArrowDownIcon
      sx={{
        fontSize: 14,
        mt: -0.6,
        opacity: direction === "desc" ? 1 : 0.35,
      }}
    />
  </Box>
);

export default function ManagementTable({ users }: Props) {
  const columns: GridColDef<User>[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 160,
      sortable: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Box
            component="img"
            src={params.row.avatarUrl}
            alt={params.row.name}
            sx={{ width: 40, height: 40, borderRadius: "50%" }}
          />
          <Box
            sx={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}
          >
            <Box sx={{ fontWeight: 600, fontSize: 14 }}>{params.row.name}</Box>
            <Box sx={{ color: "#6b7280", fontSize: 12 }}>
              {params.row.email}
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <Box sx={{ fontWeight: 500, fontSize: 14, color: "#111827" }}>
            {params.row.title}
          </Box>
          <Box sx={{ color: "#6b7280", fontSize: 12.5 }}>
            {params.row.since}
          </Box>
        </Box>
      ),
    },
    {
      field: "project",
      headerName: "Project",
      flex: 1,
      minWidth: 180,

      valueGetter: (_, row) => row.project?.name ?? "",
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span>{params.colDef.headerName}</span>
          <SortIcons direction={params.colDef.sortingOrder?.[0] ?? undefined} />
        </Box>
      ),
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Box
            component="img"
            src={params.row.avatarUrl}
            alt={params.row.name}
            sx={{ width: 40, height: 40, borderRadius: "50%" }}
          />
          <Box
            sx={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}
          >
            <Box sx={{ fontWeight: 600, fontSize: 14 }}>
              {params.row.project.name}
            </Box>
            <Box sx={{ color: "#6b7280", fontSize: 12 }}>
              {params.row.project.subtitle}
            </Box>
          </Box>
        </Box>
      ),
    },

    {
      field: "documents",
      headerName: "Member Documents",
      flex: 1.1,
      minWidth: 280,
      sortable: false,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span>{params.colDef.headerName}</span>
          <SortIcons direction={params.colDef.sortingOrder?.[0] ?? undefined} />
        </Box>
      ),
      renderCell: (params) => {
        const doc = params.row.documents?.[0];
        if (!doc) return <Box sx={{ color: "#9ca3af" }}>—</Box>;

        return (
          <Box
            sx={{
              display: "flex",
              gap: 1.25,
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                border: "1px solid #efefef",
                backgroundColor: "#fff",
                display: "grid",
                placeItems: "center",
                position: "relative",
                flex: "0 0 auto",
              }}
            >
              <Box
                component="img"
                src={doc.iconUrl}
                alt={doc.type}
                sx={{ width: 24, height: 24, objectFit: "contain" }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                lineHeight: 1.2,
              }}
            >
              <Box
                sx={{
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#111827",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {doc.name}
              </Box>
              <Box sx={{ color: "#6b7280", fontSize: 12.5 }}>
                {doc.sizeMB.toFixed(1)} MB
              </Box>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span>{params.colDef.headerName}</span>
          <SortIcons direction={params.colDef.sortingOrder?.[0] ?? undefined} />
        </Box>
      ),
      renderCell: ({ value }) => {
        const isActive = value === "active";

        return (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.25,
              height: 28,
              borderRadius: "9px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#fff",
              fontSize: 12,
              fontWeight: 500,
              color: isActive ? "#166534" : "#6b7280",
              whiteSpace: "nowrap",
            }}
          >
            {isActive ? (
              <CheckCircleOutlineIcon sx={{ fontSize: 16, color: "#16a34a" }} />
            ) : (
              <DoNotDisturbAltIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
            )}

            {isActive ? "Active" : "Absent"}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      width: 64,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => handleOpenActions(e, params.row.id)}
        >
          <GridMoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const [filter, setFilter] = useState<"all" | "active" | "absent">("all");

  const queryClient = useQueryClient();

  //delete selected row
  const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);

  const [deleteMode, setDeleteMode] = useState<"bulk" | "single">("bulk");
  const [targetUserId, setTargetUserId] = useState<string | number | null>(
    null
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [actionsAnchorEl, setActionsAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [actionsUserId, setActionsUserId] = useState<string | number | null>(
    null
  );
  const actionsOpen = Boolean(actionsAnchorEl);

  //Edit user status
  const [editOpen, setEditOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | number | null>(null);

  const openSingleConfirm = (id: string | number) => {
    setDeleteMode("single");
    setTargetUserId(id);
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

    onError: () => {
      alert("Failed to update status");
    },
  });

  const handleToggleStatus = () => {
    if (!currentUser || !actionsUserId) return;

    const newStatus = currentUser.status === "active" ? "absent" : "active";

    toggleStatusMutation.mutate({
      id: actionsUserId,
      status: newStatus,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: (ids: Array<string | number>) => deleteMultipleUsers(ids),
    onSuccess: async () => {
      setConfirmOpen(false);
      setSelectedRows([]);

      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    },

    onError: () => {
      alert("Delete failed. Please try again.");
    },
  });

  const selectedCount = selectedRows.length;
  const isDeleting = deleteMutation.isPending || singleDeleteMutation.isPending;

  const openConfirm = () => {
    if (selectedCount === 0) return;
    setConfirmOpen(true);
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

  const userDetailsQuery = useQuery({
    queryKey: ["user", actionsUserId],
    queryFn: () => getUserById(actionsUserId as string | number),
    enabled: Boolean(actionsUserId),
  });
  const currentUser = userDetailsQuery.data as User | undefined;

  const tableRows =
    filter === "all"
      ? users
      : users.filter((u) => {
          if (filter === "absent") return u.status !== "active";
          return u.status === "active";
        });
  return (
    <Box className="m-4">
      <Container className="container mx-auto mt-10 p-7 sm:px-6 lg:px-8 rounded-3xl border border-gray-200">
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
        <Box className="mx-6 p-6">
          <>
            <Filter
              value={filter}
              onChange={setFilter}
              selectedCount={selectedCount}
              deleteDisabled={selectedCount === 0 || isDeleting}
              deleteLoading={isDeleting}
              onDeleteClick={openConfirm}
            />

            <DataGrid
              rows={tableRows}
              onRowSelectionModelChange={(model) => {
                if (Array.isArray(model)) {
                  setSelectedRows(model as Array<string | number>);
                  return;
                }

                if (model?.type === "exclude") {
                  setSelectedRows(tableRows.map((u) => u.id));
                  return;
                }

                if (model?.ids instanceof Set) {
                  setSelectedRows(
                    Array.from(model.ids) as Array<string | number>
                  );
                  return;
                }

                setSelectedRows([]);
              }}
              columns={columns}
              getRowId={(row) => row.id}
              checkboxSelection
              slots={{ baseCheckbox: CustomCheckbox }}
              disableRowSelectionOnClick
              rowHeight={74}
              columnHeaderHeight={44}
              disableColumnMenu
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #f1f1f1",

                  display: "flex",
                  alignItems: "center",
                  paddingTop: "12px",
                },
                "& .MuiDataGrid-sortButton": { display: "none" },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#F7F7F7",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  borderBottom: "none !important",
                  height: "40px",
                },
                "& .MuiDataGrid-columnHeaders": {
                  overflow: "hidden",
                },
                "& .MuiDataGrid-columnHeader[data-field='__check__']": {
                  borderTopLeftRadius: "12px",
                  borderBottomLeftRadius: "12px",
                },

                "& .MuiDataGrid-columnHeader[data-field='actions']": {
                  borderTopRightRadius: "12px",
                  borderBottomRightRadius: "12px",
                },
                "& .MuiDataGrid-checkboxInput .MuiSvgIcon-root": {
                  fill: "#837d7d",
                  boxShadow: "0px 2px 4px rgba(27, 28, 29, 0.12)",
                  borderRadius: "6px",
                  border: "2px solid rgba(27, 28, 29, 0.12)",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 500,
                  color: "#6b7280",
                  fontSize: "13px",
                  lineHeight: "1.2",
                },

                "& .MuiDataGrid-columnSeparator": {
                  display: "none",
                },
              }}
            />
          </>
          <Popover
            open={actionsOpen}
            onClose={handleCloseActions}
            anchorEl={actionsAnchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ width: 320, p: 1 }}>
              {/* Details */}
              <Box sx={{ px: 1.5, py: 1 }}>
                {userDetailsQuery.isLoading ? (
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <CircularProgress size={16} />
                    <span style={{ color: "#6b7280" }}>
                      Loading user details…
                    </span>
                  </Box>
                ) : currentUser ? (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Box sx={{ fontWeight: 600 }}>{currentUser.name}</Box>
                    <Box sx={{ color: "#6b7280", fontSize: 13 }}>
                      {currentUser.title}
                    </Box>
                    <Box sx={{ color: "#6b7280", fontSize: 13 }}>
                      Status: <b>{currentUser.status}</b>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ color: "#6b7280", fontSize: 13 }}>
                    No user details.
                  </Box>
                )}
              </Box>

              <Divider />

              {/* Edit */}
              <MenuItem
                onClick={() => {
                  if (!actionsUserId) return;
                  setEditUserId(actionsUserId);
                  setEditOpen(true);
                  handleCloseActions();
                }}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Edit User Details" />
              </MenuItem>

              {/* Toggle Status */}
              <MenuItem
                disabled={!currentUser || toggleStatusMutation.isPending}
                onClick={handleToggleStatus}
              >
                <ListItemIcon>
                  {currentUser?.status === "active" ? (
                    <DoNotDisturbAltIcon fontSize="small" />
                  ) : (
                    <CheckCircleOutlineIcon fontSize="small" />
                  )}
                </ListItemIcon>

                <ListItemText
                  primary={
                    currentUser?.status === "active"
                      ? "Mark as Absent"
                      : "Mark as Active"
                  }
                />
              </MenuItem>
              {toggleStatusMutation.isPending && <CircularProgress size={14} />}

              <Divider />

              {/* Delete single */}
              <MenuItem
                onClick={() => {
                  if (!actionsUserId) return;
                  openSingleConfirm(actionsUserId);
                }}
                sx={{ color: "error.main" }}
              >
                <ListItemIcon sx={{ color: "error.main" }}>
                  <GridDeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Delete User" />
              </MenuItem>
            </Box>
          </Popover>
          <ConfirmDeleteDialog
            open={confirmOpen}
            count={selectedCount}
            loading={isDeleting}
            onClose={() => setConfirmOpen(false)}
            onConfirm={confirmDelete}
          />
          <EditUserDialog
            open={editOpen}
            userId={editUserId}
            onClose={() => {
              setEditOpen(false);
              setEditUserId(null);
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
