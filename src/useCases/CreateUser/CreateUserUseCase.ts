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