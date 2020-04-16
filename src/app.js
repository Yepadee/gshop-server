import Express from 'express';
import GraphHTTP from 'express-graphql';

import HTTPS from 'https';

import fs from 'fs'
import path from 'path';

import CookieParser from 'cookie-parser';
import BodyParser from 'body-parser';

import Schema from './schema';

import {login, getTokenFromCookie} from './security';

import { ApolloServer, gql } from 'apollo-server';

import db from './models';

import schema from './schema';

const PORT = 3000;
const server = new ApolloServer({ schema });

server.listen({port:PORT}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });