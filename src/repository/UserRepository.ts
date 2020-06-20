import { EntityRepository, Repository } from "typeorm";
import { User } from "@entity/User";

import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async insertUser(username: string, password: string) {
        const user = new User();
        user.username = username;
        user.password = await bcrypt.hash(password, 10);
        await this.save(user);
        return true;
    }

    async changePassword(id: number, newPassword: string) {
        await this.update(id, {password: await bcrypt.hash(newPassword, 10)});
        return true;
    }
}