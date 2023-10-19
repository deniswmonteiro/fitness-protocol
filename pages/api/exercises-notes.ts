import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/helpers/db-util";
import { WithId } from "mongodb";

type ResponseData = {
    message?: string,
    notes?: string | null,
    exerciseNotesData?: IExercisesNotesData[]
}

type IExercisesNotesData = {
    id: number,
    exerciseName: string,
    exerciseTechniqueOne: string,
    exerciseTechniqueTwo: string,
    exerciseTechniqueThree: string,
    exerciseTechniqueFour: string,
    notes: string
}

type IUser = null | WithId<Document> & {
    _id: object,
    id: number,
    name: string,
    gender: string,
    weight: number,
    height: number,
    email: string,
    password: string
}

type IExercisesNotes = null | WithId<Document>[] & [IExercisesNotesData]

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === "GET") {
        const email = req.query.email as string;

        try {
            const connect = await dbConnect();
            const db = connect.db();
            const user = await db.collection("users").findOne({ email}) as IUser;

            if (!user) {
                res.status(422).json({
                    message: "Usuário não encontrado.",
                });

                connect.close();
            }

            else {
                const exercises = await db.collection("exercise-notes").find({ userId: user.id }).toArray() as IExercisesNotes;

                if (exercises === null) {
                    res.status(404).json({
                        message: "Exercício não encontrado."
                    });
                }

                else {
                    const exerciseNotesData = exercises.map((exercise: IExercisesNotesData) => {
                        return {
                            id: exercise.id,
                            exerciseName: exercise.exerciseName,
                            exerciseTechniqueOne: exercise.exerciseTechniqueOne,
                            exerciseTechniqueTwo: exercise.exerciseTechniqueTwo,
                            exerciseTechniqueThree: exercise.exerciseTechniqueThree,
                            exerciseTechniqueFour: exercise.exerciseTechniqueFour,
                            notes: exercise.notes
                        }
                    });
    
                    res.status(201).json({
                        exerciseNotesData
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