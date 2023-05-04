import axios from "axios";

import { env } from "@/env.mjs";

const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

export { axiosInstance };
