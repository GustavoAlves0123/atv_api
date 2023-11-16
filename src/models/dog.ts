export default class Dog {
    nome: string;
    idade: number;
    raça: string;
    porte: string;
    cor: string;

    constructor (nome: string, idade: number, raça: string, porte: string, cor: string) {
        this.nome = nome;
        this.idade = idade;
        this.raça = raça;
        this.porte = porte;
        this.cor = cor;
    }
}