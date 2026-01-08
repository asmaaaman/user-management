import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../apis/users";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};
