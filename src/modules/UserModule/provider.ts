import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { User } from '@entity/User';

import * as bcrypt from "bcrypt";

import * as jwt from "jsonwebtoken";

@Injectable()
export class UserProvider {
    private numSalts = 10;
    private secret = "somereallylongsecretkey";

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
        user.password = await bcrypt.hash(password, this.numSalts);
        await this.repository.save(user);

        return true;
    }

    async login(username: string, password: string) {
        const user = await this.repository.findOne({where: {username}});
        if (!user) {
            throw new Error("Invalid username or password");
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new Error("Invalid username or password")
        }  

        const payload = {
            username: user.username
        }

        return jwt.sign(payload, this.secret, { expiresIn: '1d' });
    }
}