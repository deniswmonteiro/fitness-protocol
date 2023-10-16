import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { validate } from "@/helpers/form-validate";
import { dbConnect } from "@/helpers/db-util";
import { WithId } from "mongodb";

type ResponseData = {
    message?: string,
    notes?: string | null,
    exerciseNotesData?: IExercisesGetData[]
}

type IExercisesGetData = {
    exerciseId: number,
    notes: string
}

type IUser = WithId<Document> & {
    _id: object,
    id: number,
    name: string,
    gender: string,
    weight: number,
    height: number,
    email: string,
    password: string
}

type IExercisesGet = WithId<Document>[] & [IExercisesGetData]

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
    notes: string
}

type IExercise = WithId<Document> & IExerciseData;

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
                const exercises = await db.collection("exercise-notes").find({ userId: user.id }).toArray() as IExercisesGet;
                const exerciseNotesData = exercises.map((exercise: IExercisesGetData) => {
                    return {
                        exerciseId: exercise.exerciseId,
                        notes: exercise.notes
                    }
                });

                res.status(201).json({
                    exerciseNotesData
                });
            }
        }

        catch (error) {
            res.status(500).json({
                message: "Erro de conexão com o banco de dados."
            });
        }
    }

    if (req.method === "POST") {
        const session: ISession | null = await getServerSession(req, res, authOptions);

        if (!session) {
            res.status(401).json({
                message: "Usuário não autenticado."
            });
        }

        else {
            const { exerciseId, notes } = req.body as IExerciseData;

            // Validation
            const isValidExerciseNotes = notes ? validate({ type: "exerciseNotes", min: 2, value: notes }) : false;

            if (!isValidExerciseNotes) {
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
                        await db.collection("exercise-notes").insertOne({
                            exerciseId,
                            userId: user.id,
                            notes
                        });

                        res.status(201).json({
                            message: "Anotações adicionadas com sucesso.",
                            notes
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

    if (req.method === "PATCH") {
        const session: ISession | null = await getServerSession(req, res, authOptions);

        if (!session) {
            res.status(401).json({
                message: "Usuário não autenticado."
            })
        }

        else {
            const { exerciseId, notes } = req.body as IExerciseData;

            // Validation
            const isValidExerciseNotes = notes ? validate({ type: "exerciseNotes", min: 2, value: notes }) : false;

            if (!isValidExerciseNotes) {
                res.status(422).json({
                    message: "Preencha o campo corretamente."
                });
            }

            else {
                try {
                    const connect = await dbConnect();
                    const db = connect.db();

                    const exercises = db.collection("exercise-notes");
                    const exercise = await exercises.findOne({ exerciseId }) as IExercise;

                    if (!exercise) {
                        res.status(404).json({
                            message: "Exercício não encontrado."
                        });

                        connect.close();
                    }

                    else {
                        await exercises.updateOne({ exerciseId }, {
                            $set: {
                                notes
                            }
                        });

                        res.status(200).json({
                            message: "Anotações atualizadas com sucesso.",
                            notes
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