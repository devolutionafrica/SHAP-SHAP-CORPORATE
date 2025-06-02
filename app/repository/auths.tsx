import axios from "axios";

export const login = async (email: string, password: string) => {
  return axios.post("http://localhost:3000/api/auth/login", {
    username: email,
    password,
  });
};
