import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../types/users";
import { getUserById, updateUser } from "../../apis/users";

type Props = {
  open: boolean;
  userId: string | number | null;
  onClose: () => void;
};

type FormState = {
  name: string;
  title: string;
  status: "active" | "absent";
};

export default function EditUserDialog({ open, userId, onClose }: Props) {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId as string | number),
    enabled: open && userId != null,
  });

  const [form, setForm] = React.useState<FormState>({
    name: "",
    title: "",
    status: "active",
  });

  React.useEffect(() => {
    if (!userQuery.data) return;
    const user = userQuery.data as User;

    setForm({
      name: user.name ?? "",
      title: user.title ?? "",
      status: (user.status as string) === "absent" ? "absent" : "active",
    });
  }, [userQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string | number; data: Partial<User> }) =>
      updateUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      if (userId != null) {
        await queryClient.invalidateQueries({ queryKey: ["user", userId] });
      }
      onClose();
    },
  });

  const isLoading = userQuery.isLoading;
  const isSaving = updateMutation.isPending;

  const handleSave = () => {
    if (userId == null) return;

    updateMutation.mutate({
      id: userId,
      data: {
        name: form.name,

        title: form.title,

        status: form.status,
      } as Partial<User>,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit User Details</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 3 }}>
            <CircularProgress size={18} />
            <span style={{ color: "#6b7280" }}>Loading…</span>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              fullWidth
            />

            <TextField
              label="Title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    status: e.target.value as FormState["status"],
                  }))
                }
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isLoading || isSaving || userId == null}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
