// pages/api/docs.ts
import { NextApiRequest, NextApiResponse } from "next";

import { swaggerSpec } from "@/app/lib/swagger";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function swaggerDocs(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(swaggerSpec);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
