import Express from 'express';
import GraphHTTP from 'express-graphql';

import HTTPS from 'https';

import FS from 'fs'
import Path from 'path';

import Schema from './schema';



const PORT = 3000;

const app = Express();

app.use('/graphql', GraphHTTP({
    schema: Schema,
    pretty: true,
    graphiql: true
}));

// app.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}`);
// });

const httpsOptions = {
    cert: FS.readFileSync(Path.join(__dirname, 'ssl', 'server.crt')),
    key: FS.readFileSync(Path.join(__dirname, 'ssl', 'server.key'))
}

HTTPS.createServer(httpsOptions, app).listen(PORT, () => {
    console.log('App listening on port ${PORT}');
});