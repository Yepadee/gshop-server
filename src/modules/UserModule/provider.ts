import { Injectable } from "@graphql-modules/di";

import { UserRepository } from "@repository/UserRepository";
import { getCustomRepository } from "typeorm";



@Injectable()
export class UserProvider {
    repository = getCustomRepository(UserRepository);

    getUsers(args) {
        return this.repository.find({where: args});
    }

    getUserById(id: number) {
        return this.repository.findOne({id});
    }

    async addUser(username: string, password: string) {
        await this.repository.insertUser(username, password);
        return true;
    }

    async changePassword(id: number, newPassword: string) {
        await this.repository.changePassword(id, newPassword);
        return true;
    }
}