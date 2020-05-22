import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { User } from '@entity/User';

import * as bcrypt from "bcrypt";

@Injectable()
export class UserProvider {
    repository = getRepository(User);

    getUsers(args) {
        return this.repository.find({where: args});
    }

    getUserById(id: number) {
        return this.repository.findOne({where: {id}});
    }

    // TODO: add user with perms.
    async addUser(username: string, password: string) {
        const user = new User();
        user.username = username;
        user.password = await bcrypt.hash(password, 10);
        await this.repository.save(user);

        return true;
    }

    async changePassword(id: number, newPassword: string) {
        await this.repository.update(id, {password: await bcrypt.hash(newPassword, 10)});
        return true;
    }
}