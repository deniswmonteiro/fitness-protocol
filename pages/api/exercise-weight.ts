import { NextApiRequest, NextApiResponse } from "next";
import { validate } from "@/helpers/form-validate";
import { dbConnect, getId } from "@/helpers/db-util";
import { WithId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

type ResponseData = {
    message?: string,
    weight?: string | null,
}

type IUser = null | WithId<Document> & {
    id: number
}

type ISession = {
    user: {
        name: string,
        email: string,
        image: string | null
    },
    expires: string
}

type IExerciseData = {
    exerciseId: number,
    userId: number,
    plan: string,
    weight: string
}

type IExercise = null | WithId<Document> & IExerciseData;

type IExercisesData = null | WithId<Document> & {
    _id: object,
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

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === "POST") {
        const session: ISession | null = await getServerSession(req, res, authOptions);

        if (!session) {
            res.status(401).json({
                message: "Usuário não autenticado."
            })
        }

        else {
            const { exerciseId, plan, weight }: IExerciseData = req.body;

            // Validation
            const isValidExerciseWeight = weight ? validate({ type: "exerciseWeight", value: weight }) : false;

            if (!isValidExerciseWeight) {
                res.status(422).json({
                    message: "Preencha o campo corretamente."
                });
            }

            else {
                try {
                    const connect = await dbConnect();
                    const db = connect.db();
                    
                    const email = session.user.email;
                    const users = db.collection("users");
                    const user = await users.findOne({ email }) as IUser;

                    if (!user) {
                        res.status(404).json({
                            message: "Usuário não encontrado."
                        });

                        connect.close();
                    }

                    else {
                        const exercise = await db.collection(`${plan}`).findOne({ exerciseId }) as IExercisesData;

                        if (exercise === null)  {
                            res.status(404).json({
                                message: "Exercício não encontrado."
                            });
    
                            connect.close();
                        }

                        else {
                            const sequenceId = await getId("exercise-weight", db);
                            const exerciseWeight = Number(weight.replace(",", "."));

                            await db.collection("exercise-weight").insertOne({
                                id: sequenceId,
                                exerciseId,
                                userId: user.id,
                                exerciseName: exercise.name,
                                weight: exerciseWeight
                            });
        
                            res.status(201).json({
                                message: "Carga adicionada com sucesso.",
                                weight
                            });

                            connect.close();
                        }
                    }
                }

                catch (error) {
                    res.status(500).json({
                        message: "Erro de conexão com o servidor."
                    });
                }
            }
        }
    }

    if (req.method === "PATCH") {
        const session: ISession | null = await getServerSession(req, res, authOptions);

        if (!session) {
            res.status(401).json({
                message: "Usuário não autenticado."
            })
        }

        else {
            const { exerciseId, weight }: IExerciseData = req.body;

            // Validation
            const isValidExerciseWeight = weight ? validate({ type: "exerciseWeight", value: weight }) : false;

            if (!isValidExerciseWeight) {
                res.status(422).json({
                    message: "Preencha o campo corretamente."
                });
            }

            else {
                try {
                    const connect = await dbConnect();
                    const db = connect.db();

                    const exercises = db.collection("exercise-weight");
                    const exercise = await exercises.findOne({ exerciseId }) as IExercise;

                    if (!exercise) {
                        res.status(404).json({
                            message: "Exercício não encontrado."
                        });

                        connect.close();
                    }

                    else {
                        const exerciseWeight = Number(weight.replace(",", "."));

                        await exercises.updateOne({ exerciseId }, {
                            $set: {
                                weight: exerciseWeight,
                            }
                        });

                        res.status(200).json({
                            message: "Carga atualizada com sucesso.",
                            weight
                        });
                        
                        connect.close();
                    }
                }

                catch (error) {
                    res.status(500).json({
                        message: "Erro de conexão com o servidor."
                    });
                }
            }
        }
    }
}

export default handler