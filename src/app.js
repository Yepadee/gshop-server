import Express from 'express';
import GraphHTTP from 'express-graphql';

import HTTPS from 'https';

import FS from 'fs'
import Path from 'path';

import CookieParser from 'cookie-parser';
import BodyParser from 'body-parser';

import Schema from './schema';

import {login} from './security'




const PORT = 3000;

const app = Express();

//const jwtMiddleware = ExpressJWT({ secret: 'secret-key'});

app.use(BodyParser());
app.use(CookieParser());

// THIS WILL BE REMOVED ONCE AUTH TOKEN IS PUT IN EACH REQUEST.
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

app.get('/login', login);


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