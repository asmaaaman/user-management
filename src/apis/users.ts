import {axiosInstance} from "./axios";


export const getUsers = async () => {
  const response = await axiosInstance.get('/users');
  const data = await response.data;
  return data;
}