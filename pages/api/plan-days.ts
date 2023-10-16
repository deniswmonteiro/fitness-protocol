import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/helpers/db-util";
import { orderWeekDaysArr } from "@/helpers/calendar-util";

type ResponseData = {
    message?: string,
    days?: string[],
}

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === "GET") {
        const plan = req.query.plan as string;

        try {
            const connect = await dbConnect();
            const db = connect.db();

            const planDays: string[] = await db.collection(`${plan}`).distinct("day");
            const days: string[] = orderWeekDaysArr(planDays);

            res.status(201).json({
                days
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