import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../apis/users";
import { UsersResponse } from "../types/users";

export const useUsers = () => {
  return useQuery<UsersResponse>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};
