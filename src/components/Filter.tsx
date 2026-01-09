import { Box } from "@mui/material";

type FilterValue = "all" | "active" | "absent";

type Props = {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
};

const tabBase =
  "px-6 py-2 rounded-md text-sm cursor-pointer select-none transition";

const Filter = ({ value, onChange }: Props) => {
  const tabClass = (v: FilterValue) =>
    `${tabBase} ${
      value === v
        ? "bg-white shadow-sm text-gray-900"
        : "text-gray-400 hover:text-gray-700"
    }`;

  return (
    <Box className="mb-4 p-2 bg-[#F7F7F7] rounded-lg w-[35%] flex flex-row gap-2 items-center">
      <button className={tabClass("all")} onClick={() => onChange("all")}>
        All
      </button>

      <button className={tabClass("active")} onClick={() => onChange("active")}>
        Active
      </button>

      <button className={tabClass("absent")} onClick={() => onChange("absent")}>
        Absent
      </button>
    </Box>
  );
};

export default Filter;
