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
import CustomCheckbox from "./CheckBox";
import ConfirmDeleteDialog from "./ConfrimModal";
import EditUserDialog from "../pages/users/EditUser";

type FilterValue = "all" | "active" | "absent";

type Props = {
  rows: User[];

  filter: FilterValue;
  onFilterChange: (v: FilterValue) => void;

  selectedRows: Array<string | number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowSelectionModelChange: (model: any) => void;

  onBulkDeleteClick: () => void;
  isDeleting: boolean;

  actionsOpen: boolean;
  actionsAnchorEl: HTMLElement | null;
  onOpenActions: (
    e: React.MouseEvent<HTMLElement>,
    id: string | number
  ) => void;
  onCloseActions: () => void;

  currentUser?: User;
  userDetailsLoading: boolean;

  confirmOpen: boolean;
  onCloseConfirm: () => void;
  onConfirmDelete: () => void;

  editOpen: boolean;
  editUserId: string | number | null;
  onOpenEdit: (id: string | number) => void;
  onCloseEdit: () => void;

  onOpenSingleDeleteConfirm: (id: string | number) => void;

  onToggleStatus: () => void;
  togglingStatus: boolean;
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
      sx={{ fontSize: 14, opacity: direction === "asc" ? 1 : 0.35 }}
    />
    <KeyboardArrowDownIcon
      sx={{ fontSize: 14, mt: -0.6, opacity: direction === "desc" ? 1 : 0.35 }}
    />
  </Box>
);

export default function ManagementTable({
  rows,
  filter,
  onFilterChange,
  selectedRows,
  onRowSelectionModelChange,
  onBulkDeleteClick,
  isDeleting,
  actionsOpen,
  actionsAnchorEl,
  onOpenActions,
  onCloseActions,
  currentUser,
  userDetailsLoading,
  confirmOpen,
  onCloseConfirm,
  onConfirmDelete,
  editOpen,
  editUserId,
  onOpenEdit,
  onCloseEdit,
  onOpenSingleDeleteConfirm,
  onToggleStatus,
  togglingStatus,
}: Props) {
  const selectedCount = selectedRows.length;

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
      sortable: false,
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
          onClick={(e) => onOpenActions(e, params.row.id)}
        >
          <GridMoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Container className="container mx-auto mt-10 p-7 sm:px-6 lg:px-8 rounded-3xl border border-gray-200">
      <Box className="mx-6 p-6">
        <Filter
          value={filter}
          onChange={onFilterChange}
          selectedCount={selectedCount}
          deleteDisabled={selectedCount === 0 || isDeleting}
          deleteLoading={isDeleting}
          onDeleteClick={onBulkDeleteClick}
        />

        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection
          slots={{ baseCheckbox: CustomCheckbox }}
          disableRowSelectionOnClick
          rowHeight={74}
          columnHeaderHeight={44}
          disableColumnMenu
          onRowSelectionModelChange={onRowSelectionModelChange}
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
            "& .MuiDataGrid-columnHeaders": { overflow: "hidden" },
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
            "& .MuiDataGrid-columnSeparator": { display: "none" },
          }}
        />

        <Popover
          open={actionsOpen}
          onClose={onCloseActions}
          anchorEl={actionsAnchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Box sx={{ width: 320, p: 1 }}>
            <Box sx={{ px: 1.5, py: 1 }}>
              {userDetailsLoading ? (
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

            <MenuItem
              onClick={() => {
                if (!currentUser) return;
                onOpenEdit(currentUser.id);
                onCloseActions();
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Edit User Details" />
            </MenuItem>

            <MenuItem
              disabled={!currentUser || togglingStatus}
              onClick={onToggleStatus}
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
              {togglingStatus && <CircularProgress size={14} />}
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                if (!currentUser) return;
                onOpenSingleDeleteConfirm(currentUser.id);
                onCloseActions();
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
          onClose={onCloseConfirm}
          onConfirm={onConfirmDelete}
        />

        <EditUserDialog
          open={editOpen}
          userId={editUserId}
          onClose={onCloseEdit}
        />
      </Box>
    </Container>
  );
}
