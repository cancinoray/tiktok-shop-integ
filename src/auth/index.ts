import { PrismaClient } from "@prisma/client";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const AUTH_PROVIDER_BASE_URL = "https://auth.tiktok-shops.com";

export const getTokens = async (authorizationCode) => {
  try {
    const app_key = process.env.APP_KEY;
    const app_secret = process.env.APP_SECRET;

    const response = axios.get(
      `${AUTH_PROVIDER_BASE_URL}/api/v2/token/get?app_key=${app_key}&auth_code=${authorizationCode}&app_secret=${app_secret}&grant_type=authorized_code`,
      { headers: { "Content-Type": "application/json" } }
    );

    return response;
  } catch (error: any) {
    console.error;
    console.error("Response Data:", error.response ? error.response.data : "No response data");
  }
};
