import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/helpers/db-util";
import { WithId } from "mongodb";

type ResponseData = {
    message?: string,
    weeks?: IWeeks,
}

type IWeeks = WithId<Document>[] & string[]

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === "GET") {
        const plan = req.query.plan as string;

        try {
            const connect = await dbConnect();
            const db = connect.db();

            const weeks = await db.collection(`${plan}`).distinct("week") as IWeeks;

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