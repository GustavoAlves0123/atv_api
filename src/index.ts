import express, { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import getMongoConn from "./db";
import cors from "cors";
import Dog from "./models/dog.js";

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/dogs", async (req: Request, res: Response) => {
    const { idade } = req.query;
    let idadeNumber = 0;
    try {
        if (typeof idade !== "string") {
            throw new Error("O parâmetro idade não foi informado.");
        }
        const idadeNumber = parseInt(idade);
        if (isNaN(idadeNumber)) {
            throw new Error("O parâmetro idade não é válido.");
        }
    } catch (error) {
        res.status(400).json({message: (error as Error).message});
        return;
    }

    let conn: MongoClient | null = null;
    try {
        conn = await getMongoConn();
        const db = conn.db();
        const dogs = db.collection("dogs");
        const docs = await dogs.find({
            idade: { $gte: idadeNumber}
        }).toArray(); // select * from dogs where idade >= ?
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    } finally {
        conn?.close();
    }
});

app.post("/dogs", async (req: Request, res: Response) => {
    const record = req.body;
    try {
        if (typeof record.nome !== "string") {
            throw new Error("O atributo nome não foi informado.");
        }
        if (record.nome === "") {
            throw new Error("O atributo nome não é válido.");
        }
        if (typeof record.idade != "number") {
            throw new Error("O atributo idade não foi informado.");
        }
        if (record.idade <= 0) {
            throw new Error("O atributo idade não é válido.");
        }
    } catch (error) {
        res.status(400).json({message: (error as Error).message});
        return;
    }
    const dog = new Dog(record.nome, record.idade);
    let conn: MongoClient | null = null;
    try {
        conn = await getMongoConn();
        const db = conn.db();
        const dogs = db.collection("dogs");
        await dogs.insertOne(dog);
        res.status(201).json(dog);
    } catch (error) {
        res.status(500).json({message: (error as Error).message});
    } finally {
        conn?.close();
    }
});

app.put("/dogs/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const objectId = new ObjectId(id);
        let conn: MongoClient | null = null; // Variável que armazena a conexão com Banco de Dados
        try {
            conn = await getMongoConn();
            const db = conn.db();
            const dogs = db.collection("dogs");
            if (await dogs.find({ _id: objectId }).count() > 0) {
                const record = req.body;
                try {
                    if (typeof record.nome !== "string") {
                        throw new Error("O atributo nome não foi informado.");
                    }
                    if (record.nome === "") {
                        throw new Error("O atributo nome não é válido.");
                    }
                    if (typeof record.idade != "number") {
                        throw new Error("O atributo idade não foi informado.");
                    }
                    if (record.idade <= 0) {
                        throw new Error("O atributo idade não é válido.");
                    }
                } catch (error) {
                    res.status(400).json({message: (error as Error).message});
                    return;
                }

                const dog = new Dog(record.nome, record.idade);
                await dogs.updateOne({
                    _id: objectId
                }, {
                    $set: dog
                });

                res.status(200).json(dog);

            } else {
                res.status(404).json({message: "Não existe cachorro com esse id."});
            }
        } catch (error) {
            res.status(500).json({message: (error as Error).message});
        } finally {
            conn?.close();
        }
    } catch (error) {
        res.status(400).json({message: "O id informado é inválido."});
    }
});

app.delete("/dogs/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const objectId = new ObjectId(id);
        let conn: MongoClient | null = null; // Variável que armazena a conexão com Banco de Dados
        try {
            conn = await getMongoConn();
            const db = conn.db();
            const dogs = db.collection("dogs");
            if (await dogs.find({ _id: objectId }).count() > 0) {
                await dogs.deleteOne({ _id: objectId });
                res.status(204).send("");
            } else {
                res.status(404).json({message: "Não existe cachorro com esse id."});
            }

        } catch (error) {
            res.status(500).json({message: (error as Error).message});
        } finally {
            conn?.close();
        }

    } catch (error) {
        res.status(400).json({message: "O id informado é inválido."});
    }
});

app.listen(port, () => {
    console.log('Servidor sendo executado na porta ${port}');
});
