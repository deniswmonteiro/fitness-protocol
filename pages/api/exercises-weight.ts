import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/helpers/db-util";
import { WithId } from "mongodb";

type ResponseData = {
    message?: string,
    weight?: string | null,
    exerciseWeightData?: IExercisesGetData[]
}

type IExercisesGetData = {
    exerciseId: number,
    weight: number
}

type IUser = null | WithId<Document> & {
    id: number
}

type IExercisesGet = null | WithId<Document>[] & [IExercisesGetData]

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === "GET") {
        const email = req.query.email as string;
        
        try {
            const connect = await dbConnect();
            const db = connect.db();
            const user = await db.collection("users").findOne({ email }) as IUser;

            if (!user) {
                res.status(422).json({
                    message: "Usuário não encontrado.",
                });

                connect.close();
            }

            else {
                const exercises = await db.collection("exercise-weight").find({ userId: user.id }).toArray() as IExercisesGet;

                if (exercises === null) {
                    res.status(404).json({
                        message: "Exercício não encontrado."
                    });
                }

                else {
                    const exerciseWeightData = exercises.map((exercise: IExercisesGetData) => {
                        return {
                            exerciseId: exercise.exerciseId,
                            weight: exercise.weight
                        }
                    });
                    
                    res.status(201).json({
                        exerciseWeightData
                    });
                }
            }
        }
    
        catch (error) {
            res.status(500).json({
                message: "Erro de conexão com o banco de dados."
            });
        }
    }
}

export default handler