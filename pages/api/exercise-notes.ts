import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { validate } from "@/helpers/form-validate";
import { dbConnect, getId } from "@/helpers/db-util";
import { WithId } from "mongodb";

type ResponseData = {
    message?: string,
    notesId?: number | null,
    notes?: string | null,
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

type ISession = {
    user: {
        name: string,
        email: string,
        image: string | null
    },
    expires: string
}

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

type IExerciseNotesData = {
    id: number,
    exerciseName: string,
    exerciseTechniqueOne: string,
    exerciseTechniqueTwo: string,
    exerciseTechniqueThree: string,
    exerciseTechniqueFour: string,
    notes: string,
    userId: number
}

type IExerciseNotesProps = {
    exerciseId: number,
    plan: string,
    notesId: number,
    notes: string
}

type IExercise = null | WithId<Document> & IExerciseNotesData;

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === "POST") {
        const session: ISession | null = await getServerSession(req, res, authOptions);

        if (!session) {
            res.status(401).json({
                message: "Usuário não autenticado."
            });
        }

        else {
            const { exerciseId, plan, notes }: IExerciseNotesProps = req.body;

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
                        const exercise = await db.collection(`${plan}`).findOne({ exerciseId }) as IExercisesData;

                        if (exercise === null)  {
                            res.status(404).json({
                                message: "Exercício não encontrado."
                            });
    
                            connect.close();
                        }

                        else {
                            const sequenceId: number = await getId("exercise-notes", db);

                            await db.collection("exercise-notes").insertOne({
                                id: sequenceId,
                                userId: user.id,
                                exerciseName: exercise.name,
                                exerciseTechniqueOne: exercise["technique-1"],
                                exerciseTechniqueTwo: exercise["technique-2"],
                                exerciseTechniqueThree: exercise["technique-3"],
                                exerciseTechniqueFour: exercise["technique-4"],
                                notes
                            });

                            res.status(201).json({
                                message: "Anotação adicionada com sucesso.",
                                notesId: sequenceId,
                                notes
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
            const { notesId, notes }: IExerciseNotesProps = req.body;

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

                    const exercisesNotes = db.collection("exercise-notes");
                    const exerciseNotes = await exercisesNotes.findOne({ id: notesId }) as IExercise;

                    if (!exerciseNotes) {
                        res.status(404).json({
                            message: "Exercício não encontrado."
                        });

                        connect.close();
                    }

                    else {
                        await exercisesNotes.updateOne({ id: notesId }, {
                            $set: {
                                notes
                            }
                        });

                        res.status(200).json({
                            message: "Anotação atualizada com sucesso.",
                            notesId: exerciseNotes.id,
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

    if (req.method === "DELETE") {
        const session: ISession | null = await getServerSession(req, res, authOptions);

        if (!session) {
            res.status(401).json({
                message: "Usuário não autenticado."
            });
        }

        else {
            const notesId: number = req.body.notesId;

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
                    const exercisesNotes = db.collection("exercise-notes");
                    const exerciseNotes = await exercisesNotes.findOne({ id: notesId }) as IExercise;

                    if (!exerciseNotes) {
                        res.status(404).json({
                            message: "Anotação não encontrada."
                        });

                        connect.close();
                    }

                    else {
                        if (exerciseNotes.userId !== user.id) {
                            res.status(401).json({
                                message: "Usuário não autorizado."
                            });

                            connect.close();
                        }

                        else {
                            await exercisesNotes.deleteOne({ id: notesId });
                        
                            res.status(201).json({
                                message: "Anotação excluída com sucesso.",
                                notesId: null,
                                notes: "",
                            });

                            connect.close();
                        }
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

export default handler