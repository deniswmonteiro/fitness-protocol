import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/helpers/db-util";
import { WithId } from "mongodb";
import { orderWeekDaysArr } from "@/helpers/calendar-util";

type ResponseData = {
    message?: string,
    days?: IDays,
}

type IDays = WithId<Document>[] & string[]

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === "GET") {
        const plan = req.query.plan as string;

        try {
            const connect = await dbConnect();
            const db = connect.db();

            const planDays = await db.collection(`${plan}`).distinct("day") as IDays;
            const days = orderWeekDaysArr(planDays) as IDays;

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