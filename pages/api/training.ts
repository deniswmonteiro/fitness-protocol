import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/helpers/db-util";
import { WithId } from "mongodb";
import { getDayName } from "@/helpers/calendar-util";

type ResponseData = {
    message?: string,
    data?: IData | null,
}

type IData = {
    title: string;
    exercises: IExercisesData[]
}

type IExercisesData = {
    exerciseId: string,
    name: string,
    series: number,
    "reps-1": number,
    "reps-2": number,
    "reps-3": number,
    "reps-4": number,
    pause: number,
    "technique-1": string,
    "description-1": string,
    "technique-2": string,
    "description-2": string,
    "technique-3": string,
    "description-3": string,
    "technique-4": string,
    "description-4": string,
    "grouping": string,
    weight: number,
    notes: string
}

type ITraining = null | WithId<Document>[] & [IExercisesData]

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === "GET") {
        const plan = req.query.plan as string;
        const week = req.query.week as string;
        const day = req.query.day as string;

        try {
            const connect = await dbConnect();
            const db = connect.db();

            const exerciseWeek = (week.substring(0, 1).toUpperCase() + week.substring(1)).replace("-", " ");
            const exerciseDay = getDayName(day);

            const training = await db.collection(`${plan}`).find({
                $and: [
                    { week: exerciseWeek },
                    { day: exerciseDay }
                ]}).toArray() as ITraining;

            if (training === null) {
                res.status(404).json({
                    message: "Treino não encontrado."
                });
            }

            else {
                const trainingData = training.map((item: IExercisesData) => {
                    return {
                        exerciseId: item.exerciseId,
                        name: item.name,
                        series: item.series,
                        "reps-1": item["reps-1"],
                        "reps-2": item["reps-2"],
                        "reps-3": item["reps-3"],
                        "reps-4": item["reps-4"],
                        pause: item.pause,
                        "technique-1": item["technique-1"],
                        "description-1": item["description-1"],
                        "technique-2": item["technique-2"],
                        "description-2": item["description-2"],
                        "technique-3": item["technique-3"],
                        "description-3": item["description-3"],
                        "technique-4": item["technique-4"],
                        "description-4": item["description-4"],
                        "grouping": item["grouping"],
                        weight: item.weight,
                        notes: item.notes
                    }
                });
    
                const data = {
                    title: `Treino de ${getDayName(day)}`,
                    exercises: trainingData
                }
    
                res.status(200).json({
                    data
                });
            }
        }

        catch (error) {
            res.status(500).json({
                message: "Erro de conexão com o banco de dados.",
                data: null
            });
        }
    }
}

export default handler