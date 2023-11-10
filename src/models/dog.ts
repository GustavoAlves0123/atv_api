export default class Dog {
    nome: string;
    idade: number;
    raça: string;
    porte: string;
    peso: number;

    constructor (nome: string, idade: number, raça: string, porte: string, peso: number) {
        this.nome = nome;
        this.idade = idade;
        this.raça = raça;
        this.porte = porte;
        this.peso = peso;
    }
}