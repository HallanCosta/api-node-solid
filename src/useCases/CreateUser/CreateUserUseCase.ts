/*  
1. Single Responsibility Principle
CLASSE CreateUserUseCase ESTÁ COM UMA UNICA RESPONSABILIDADE.
ELA NÃO TEM A RESPONSABILIDADE DE SABER COMO ESSE ÚSUARIO VAI SER SALVO: SE ELE VAI
SER SALVO EM UM BANCO DE DADOS POSTGRES OU MONGO.
A ÚNICA RESPONSABILIDADE QUE ESSA CLASSE TEM É DE VERIFICAR SE O ÚSUARIO EXISTE OU NÃO E 
CRIAR O ÚSUARIO.
  
2. Liskov Substitution Principle
QUANDO RECEBEMOS O usersRepository E FALAMOS QUE ELE É DO TIPO IUsersRepository QUE É UM
CONTRATO QUE DEFINE QUAIS SÃO OS MÉTODOS QUE VÃO EXISTIR DENTRO DO REPOSITORIO, NÃO O INTERESSA
SE O REPOSITORIO É UM POSTGRES OU MONGO OU MYSQL, TENDO OS METODOS DESEJADOS ELE IRÁ FUNCIONAR.

3. Dependency Inversion Principle
EU NÃO DEPENDO TA IMPLEMENTAÇÃO DIRETA NO BANCO, EU SÓ DEPENDO DA ABSTRAÇÃO QUE É 
usersRepository ONDE SUA INTERFACE IUsersRepository TEM OS METODOS.
*/

import { IUsersRepository } from '../../repositories/IUsersRepository';
import { ICreateUserRequestDTO } from './CreateUserDTO';
import { User } from '../../entities/User';
import { IMailProvider } from '../../providers/IMailProvider';

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private mailProvider: IMailProvider
  ) {}

  async execute(data: ICreateUserRequestDTO) {
    const userAlreadyExist = await this.usersRepository.findByEmail(data.email);
  
    if (userAlreadyExist) {
      throw new Error("User already exist.");
    }

    const user = new User(data);

    await this.usersRepository.save(user);

    await this.mailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email
      },
      from: {
        name: 'Equipe App do S.O.L.I.D',
        email: 'equipe.app@solid.com'
      },
      subject: 'Seja bem-vindo à plataforma',
      body: 'Você já pode fazer login em nossa plataforma'
    });
  }
}