"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const db_1 = __importDefault(require("./db"));
const cors_1 = __importDefault(require("cors"));
const dog_js_1 = __importDefault(require("./models/dog.js"));
const port = 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/dogs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        return;
    }
    let conn = null;
    try {
        conn = yield (0, db_1.default)();
        const db = conn.db();
        const dogs = db.collection("dogs");
        const docs = yield dogs.find({
            idade: { $gte: idadeNumber }
        }).toArray(); // select * from dogs where idade >= ?
        res.status(200).json(docs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    finally {
        conn === null || conn === void 0 ? void 0 : conn.close();
    }
}));
app.post("/dogs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        return;
    }
    const dog = new dog_js_1.default(record.nome, record.idade);
    let conn = null;
    try {
        conn = yield (0, db_1.default)();
        const db = conn.db();
        const dogs = db.collection("dogs");
        yield dogs.insertOne(dog);
        res.status(201).json(dog);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    finally {
        conn === null || conn === void 0 ? void 0 : conn.close();
    }
}));
app.put("/dogs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const objectId = new mongodb_1.ObjectId(id);
        let conn = null; // Variável que armazena a conexão com Banco de Dados
        try {
            conn = yield (0, db_1.default)();
            const db = conn.db();
            const dogs = db.collection("dogs");
            if ((yield dogs.find({ _id: objectId }).count()) > 0) {
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
                }
                catch (error) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                const dog = new dog_js_1.default(record.nome, record.idade);
                yield dogs.updateOne({
                    _id: objectId
                }, {
                    $set: dog
                });
                res.status(200).json(dog);
            }
            else {
                res.status(404).json({ message: "Não existe cachorro com esse id." });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
        finally {
            conn === null || conn === void 0 ? void 0 : conn.close();
        }
    }
    catch (error) {
        res.status(400).json({ message: "O id informado é inválido." });
    }
}));
app.delete("/dogs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const objectId = new mongodb_1.ObjectId(id);
        let conn = null; // Variável que armazena a conexão com Banco de Dados
        try {
            conn = yield (0, db_1.default)();
            const db = conn.db();
            const dogs = db.collection("dogs");
            if ((yield dogs.find({ _id: objectId }).count()) > 0) {
                yield dogs.deleteOne({ _id: objectId });
                res.status(204).send("");
            }
            else {
                res.status(404).json({ message: "Não existe cachorro com esse id." });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
        finally {
            conn === null || conn === void 0 ? void 0 : conn.close();
        }
    }
    catch (error) {
        res.status(400).json({ message: "O id informado é inválido." });
    }
}));
app.listen(port, () => {
    console.log('Servidor sendo executado na porta ${port}');
});
