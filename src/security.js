import {createError} from 'apollo-errors';
import JWT from 'jsonwebtoken';

import db from './models';


const AuthorizationError = createError('AuthorizationError', {
    message: 'You are not authorized!'
});

const checkPermsAndResolve = (context, expectedPerms, resolver) => {
    const token = context.headers.authorization;
    try {
        const jwtPayload = JWT.verify(token.replace('Bearer ', ''), 'secret-key');
        const hasPerms = expectedPerms.includes(jwtPayload.user.perms);

        if (hasPerms || expectedPerms.length == 0) {
            return resolver();
        } else {
            throw new AuthorizationError();
        }
    } catch (err) {
        throw err;
    }
};

const login = (req, res) => {
    //TODO: get username + password from body
    const args = {
        username: 'Admin'
    };
    db.models.user.findOne({where: args}).then((userData) => {
        const user = {
            id: userData.dataValues.id,
            email: userData.dataValues.email,
            perms: userData.dataValues.perms
        };
        JWT.sign({user}, 'secret-key', {
            expiresIn: '24h'
        },
        (err, token) => {
            //TODO: Send rather than set as cookie
            res.cookie('access_token', token).send("logged in, check cookie");
         });
    });
};

export {checkPermsAndResolve, login};