import { WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { validate } from "@/helpers/form-validate";
import { dbConnect, getId } from "@/helpers/db-util";
import { hashPassword } from "@/helpers/auth-util";

type ResponseData = {
    message?: string,
    name?: string,
    gender?: "1" | "2",
    weight?: string,
    height?: string,
}

type IUserData = {
    name: string,
    gender: "1" | "2",
    weight: string,
    height: string,
    email: string,
    password: string
}

type IUser = WithId<Document> & {
    name: string,
    gender: "male" | "female",
    weight: number,
    height: number,
}

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === "GET") {
        const email = req.query.email;

        try {
            const connect = await dbConnect();
            const db = connect.db();
            const user = await db.collection("users").findOne({ email }) as IUser;

            if (!user) {
                res.status(422).json({
                    message: "Usuário não encontrado."
                });

                connect.close();
            }

            else {
                const userGender = (user.gender === "male") ? "1" : "2";
                const userWeight = String(user.weight).replace(".", ",");
                const userHeight = String(user.height / 100).replace(".", ",");

                res.status(201).json({
                    name: user.name,
                    gender: userGender,
                    weight: userWeight,
                    height: userHeight,
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
        const { name, gender, weight, height, email, password } = req.body as IUserData;

        // Validation
        const isValidName = name ? validate({ type: "name", value: name, min: 2 }) : false;
        const isValidGender = gender ? validate({ type: "gender", value: gender }) : false;
        const isValidWeight = weight ? validate({ type: "weight", value: weight }) : false;
        const isValidHeight = height ? validate({ type: "height", value: height }) : false;
        const isValidEmail = email ? validate({ type: "email", value: email}) : false;
        const isValidPassword = password ? validate({ type: "password", value: password, min: 6}) : false;

        if (!isValidName || !isValidGender || !isValidWeight || !isValidHeight || !isValidEmail || !isValidPassword) {
            res.status(422).json({
                message: "Preencha todos os campos corretamente."
            });
        }

        else {
            try {
                const connect = await dbConnect();
                const db = connect.db();

                // Verifies if user exists
                const userExists = await db.collection("users").findOne({ email }) as IUser;

                if (userExists) {
                    res.status(422).json({
                        message: "Usuário já cadastrado."
                    });

                    connect.close();
                }

                else {
                    const userGender = (gender === "1") ? "male" : "female";
                    const userWeight = Number(weight.replace(",", "."));
                    const userHeight = Number(height);
                    const encryptedPassword = await hashPassword(password);
                    const sequenceId = await getId("user", db);
                    
                    await db.collection("users").insertOne({
                        id: sequenceId,
                        name,
                        gender: userGender,
                        weight: userWeight,
                        height: userHeight,
                        email,
                        password: encryptedPassword
                    });

                    res.status(201).json({
                        message: "Cadastro feito com sucesso."
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

export default handler