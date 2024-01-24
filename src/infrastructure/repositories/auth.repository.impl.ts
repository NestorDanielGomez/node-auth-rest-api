import { AuthRepository, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { AuthDataSource } from '../../domain/datasources/auth.datasource';

export class AuthRepositoryImp implements AuthRepository {
    constructor(
        private readonly authDataSource: AuthDataSource
    ) { }

    login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        return this.authDataSource.login(loginUserDto)
    }

    register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        return this.authDataSource.register(registerUserDto)
    }

}