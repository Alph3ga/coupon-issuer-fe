import { isProd } from "@/utils"

const API_BASE_URL = isProd ? "https://backend.lakewoodpujo.site" : "http://localhost:8000";

export {API_BASE_URL};