import axios from "axios";

export const login = async (email: string, password: string) => {
  return axios.post("http://localhost:3001/api/auth/login", {
    email,
    password,
  });
};
