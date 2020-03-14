const express = require('express');
const expressGraphQL = require('express-graphql');
const Schema = require('./schema');

const PORT = 8080;

const app = express();

app.use('/graphql', expressGraphQL({
    schema: Schema,
    pretty: true,
    graphiql: true
}));

