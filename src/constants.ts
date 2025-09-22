import { isProd } from "@/utils"

const API_BASE_URL = isProd ? "http://13.60.42.199:8000" : "http://localhost:8000";

export {API_BASE_URL};