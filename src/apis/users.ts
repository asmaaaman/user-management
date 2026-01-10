import { User } from "../types/users";
import {axiosInstance} from "./axios";


export const getUsers = async () => {
  const response = await axiosInstance.get('/users');
  const data = await response.data;
  return data;
}

export const updateUserStatus = async (args: {
  id: string | number;
  status: "active" | "absent";
}) => {
  const res = await axiosInstance.patch(`/users/${args.id}`, {
    status: args.status,
  });
  return res.data;
};
export const updateUser = async (args: { id: string | number; data: Partial<User> }) => {
  const res = await axiosInstance.patch(`/users/${args.id}`, args.data);
  return res.data;
};
export const getUserById = async (id: string | number) => {
  const res = await axiosInstance.get(`/users/${id}`);
  return res.data;
};
export const deleteUserById = async (id: string | number) => {
  await axiosInstance.delete(`/users/${id}`);
};

export const deleteMultipleUsers = async (userIds:Array<string | number>) => {
  await Promise.all(userIds.map(id => axiosInstance.delete(`/users/${id}`)));
}