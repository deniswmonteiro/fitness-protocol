import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/helpers/db-util";

type ResponseData = {
    message?: string,
    weeks?: string[],
}

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === "GET") {
        const plan = req.query.plan as string;

        try {
            const connect = await dbConnect();
            const db = connect.db();

            const planWeeks: string[] = await db.collection(`${plan}`).distinct("week");
            const weeks = planWeeks.map((week) => Number(week.split(" ")[1]))
                .sort((a, b) => a - b)
                .map((item) => `Semana ${item}`);

            res.status(201).json({
                weeks
            });
        }

        catch (error) {
            res.status(500).json({
                message: "Erro de conexão com o banco de dados.",
            });
        }
    }
}

export default handler