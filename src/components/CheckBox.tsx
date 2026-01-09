// CustomCheckbox.tsx
import Checkbox from "@mui/material/Checkbox";
import CheckIcon from "@mui/icons-material/Check";
import type { GridSlotProps } from "@mui/x-data-grid";

type BaseCheckboxProps = GridSlotProps["baseCheckbox"];
const CustomCheckbox = (props: BaseCheckboxProps) => {
  const { slotProps, ...rest } = props;
  return (
    <Checkbox
      {...rest}
      slotProps={{
        input: slotProps?.htmlInput,
      }}
      disableRipple
      icon={
        <span
          className="border border-[rgba(27,28,29,0.12)] w-3.75 h-3.75 rounded-[3px] 
          shadow-[0px_2px_4px_rgba(27,28,29,0.12)]
"
        />
      }
      checkedIcon={<CheckIcon sx={{ fontSize: "18px" }} />}
    />
  );
};

export default CustomCheckbox;
