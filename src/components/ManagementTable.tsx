import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import type { User } from "../types/users";
import { Box, Container, Popover } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Filter from "./Filter";
import { useState } from "react";
import CustomCheckbox from "./CheckBox";

type Props = {
  users: User[];
};

const paginationModel = { page: 0, pageSize: 5 };

const statusChipColor = (status: User["status"]) => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "default";
    case "pending":
      return "warning";
    default:
      return "default";
  }
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
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span>{params.colDef.headerName}</span>
          <SortIcons direction={params.colDef.sortingOrder?.[0] ?? undefined} />
        </Box>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 160,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span>{params.colDef.headerName}</span>
          <SortIcons direction={params.colDef.sortingOrder?.[0] ?? undefined} />
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
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color={statusChipColor(params.value as User["status"])}
          variant="outlined"
        />
      ),
    },
    {
      field: "documentsCount",
      headerName: "Documents",
      type: "number",
      minWidth: 130,
      renderHeader: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span>{params.colDef.headerName}</span>
          <SortIcons direction={params.colDef.sortingOrder?.[0] ?? undefined} />
        </Box>
      ),
      valueGetter: (_, row) => row.documents?.length ?? 0,
    },
  ];

  const [filter, setFilter] = useState<"all" | "active" | "absent">("all");

  const filteredUsers =
    filter === "all" ? users : users.filter((user) => user.status === filter);

  return (
    <Container className="container mx-auto mt-10 p-7 sm:px-6 lg:px-8 rounded-3xl border border-gray-200">
      <Box className="mx-6 p-6">
        <>
          <Filter value={filter} onChange={setFilter} />
          <DataGrid
            rows={filteredUsers.length ? filteredUsers : users}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            slots={{ baseCheckbox: CustomCheckbox }}
            disableRowSelectionOnClick
            disableColumnMenu
            sx={{
              border: "none",
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

              "& .MuiDataGrid-columnHeader[data-field='documentsCount']": {
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
      </Box>
    </Container>
  );
}
