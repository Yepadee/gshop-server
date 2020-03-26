const express = require('express');
const expressGraphQL = require('express-graphql');
const Schema = require('./schema');
const cors = require('cors');

const PORT = 3000;

const app = express();

app.use('/graphql', cors(), expressGraphQL({
    schema: Schema,
    pretty: true,
    graphiql: true
}));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});