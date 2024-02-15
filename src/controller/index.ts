import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const prisma = new PrismaClient();

export async function getUserId(ctx: any) {
  const xtoken: any = ctx.get("x-auth-token") || ctx.get("authorization");
  const decoded = jwt.verify(xtoken, process.env.JWT_KEY as string);
  const decodedString = JSON.stringify(decoded);
  const decodedParse = JSON.parse(decodedString);

  return decodedParse.id;
}

export async function getIntegId(id: any, paramsId: any) {
  const integ = await prisma.integrations.findFirst({
    //* marketplace code for tiktok is 26
    where: {
      id: paramsId,
      user_id: id,
      marketplace_id: 26,
      deleted_at: { equals: null },
    },
  });
  if (integ !== null) {
    return integ.id;
  } else {
    return null;
  }
}

export async function processInteg(integId: any) {
  try {
    const updateIntegration = await prisma.integrations.update({
      where: {
        id: integId,
      },
      data: {
        last_synced_at: new Date(),
      },
    });
    return updateIntegration;
  } catch (error: any) {
    console.error(error, "Error!");
  }
}

export async function saveInteg(
  ctx: any,
  userId: any,
  access_token: any,
  access_token_expire_in: any,
  refresh_token: any,
  refresh_token_expire_in: any,
  seller_name: any
) {
  console.log("SaveInteg is Fired Up!");

  try {
    const saveInteg = await prisma.integrations.create({
      data: {
        user_id: userId,
        marketplace_id: 26,
        name: seller_name,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    const saveIntegId = saveInteg.id;
    console.log(saveIntegId, "saveIntegId");

    await prisma.integration_settings.createMany({
      data: [
        {
          integration_id: saveIntegId,
          name: "access_token",
          value: access_token,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          integration_id: saveIntegId,
          name: "access_token_expire_in",
          value: access_token_expire_in.toString(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          integration_id: saveIntegId,
          name: "refresh_token",
          value: refresh_token,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          integration_id: saveIntegId,
          name: "refresh_token_expire_in",
          value: refresh_token_expire_in.toString(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
    });

    return saveIntegId;
  } catch (error: any) {
    console.error("Error:", error);
    console.error("Response Data:", error.response ? error.response.data : "No response data");
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
