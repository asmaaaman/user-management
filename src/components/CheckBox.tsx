// CustomCheckbox.tsx
import Checkbox from "@mui/material/Checkbox";
import CheckIcon from "@mui/icons-material/Check";

const CustomCheckbox = (props: any) => {
  return (
    <Checkbox
      {...props}
      disableRipple
      icon={
        <span
          className="border border-[rgba(27,28,29,0.12)] w-[15px] h-[15px] rounded-[3px] 
          shadow-[0px_2px_4px_rgba(27,28,29,0.12)]
"
        />
      }
      checkedIcon={<CheckIcon sx={{ fontSize: "18px" }} />}
    />
  );
};

export default CustomCheckbox;
