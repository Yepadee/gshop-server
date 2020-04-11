import Express from 'express';
import GraphHTTP from 'express-graphql';

import HTTPS from 'https';

import FS from 'fs'
import Path from 'path';

import ExpressJWT from 'express-jwt';
import JWT from 'jsonwebtoken';
import JWTDecode from 'jwt-decode';

import CookieParser from 'cookie-parser';
import BodyParser from 'body-parser';

import Schema from './schema';
import db from './models';





const PORT = 3000;

const app = Express();

//const jwtMiddleware = ExpressJWT({ secret: 'secret-key'});

app.use(BodyParser());
app.use(CookieParser());

const getTokenFromCookie = (req, res, next) => {
    const token = req.body.access_token || req.query.access_token || req.headers['x-access-token'] || req.cookies.access_token;

    if (token)
    {
        req.headers.authorization = token;
        next();
    }

}

app.use('/graphql', getTokenFromCookie);

app.use('/graphql', GraphHTTP({
    schema: Schema,
    pretty: true,
    graphiql: true
}));

app.get('/login', (req, res) => {
    const args = {
        username: 'Yepadee'
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
            res.cookie('access_token', token).send("logged in, check cookie");

         });
    });
});


// app.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}`);
// });

const httpsOptions = {
    cert: FS.readFileSync(Path.join(__dirname, 'ssl', 'server.crt')),
    key: FS.readFileSync(Path.join(__dirname, 'ssl', 'server.key'))
}

HTTPS.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});