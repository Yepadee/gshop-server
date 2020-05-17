import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { User } from '@entity/User';

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthProvider {
    repository = getRepository(User);

    async login(username: string, password: string) {
        const user = await this.repository.findOne({where: {username}});
        if (!user) {
            throw new Error("Invalid username or password");
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new Error("Invalid username or password")
        }  

        return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    }

    authorizeUser(authToken: string) {
        if (authToken) return jwt.verify(authToken, process.env.JWT_SECRET);
        else return null;
    }
}