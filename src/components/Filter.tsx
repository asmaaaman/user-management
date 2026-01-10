import { Box, Button } from "@mui/material";

type FilterValue = "all" | "active" | "absent";

type Props = {
  value: FilterValue;
  onChange: (value: FilterValue) => void;

  selectedCount: number;
  deleteDisabled: boolean;
  deleteLoading: boolean;
  onDeleteClick: () => void;
};

const tabBase =
  "px-6 py-2 rounded-md text-sm cursor-pointer select-none transition";

export default function Filter({
  value,
  onChange,
  selectedCount,
  deleteDisabled,
  deleteLoading,
  onDeleteClick,
}: Props) {
  const tabClass = (v: FilterValue) =>
    `${tabBase} ${
      value === v
        ? "bg-white shadow-sm text-gray-900"
        : "text-gray-400 hover:text-gray-700"
    }`;

  return (
    <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Box className="mb-4 p-0 sm:p-2 bg-[#F7F7F7] rounded-lg w-full sm:w-[35%] flex gap-1 items-center">
        <button className={tabClass("all")} onClick={() => onChange("all")}>
          All
        </button>

        <button
          className={tabClass("active")}
          onClick={() => onChange("active")}
        >
          Active
        </button>

        <button
          className={tabClass("absent")}
          onClick={() => onChange("absent")}
        >
          Absent
        </button>
      </Box>

      <Button
        onClick={onDeleteClick}
        disabled={deleteDisabled}
        color="error"
        variant="contained"
      >
        {deleteLoading ? "Deleting..." : `Delete Selected (${selectedCount})`}
      </Button>
    </Box>
  );
}
