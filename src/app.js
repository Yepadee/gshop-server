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


const readSchema = () => {
    var schema = '';
    schema += fs.readdirSync('src/schema/').reduce( (acc, filename) => {
        if (path.extname(filename) === '.graphql') {
            const text = fs.readFileSync('src/schema/' + filename, 'utf8');
            return acc + text + "\n";
        }
        return acc;
    }, '');

    schema += fs.readdirSync('src/schema/types/').reduce( (acc, filename) => {
        if (path.extname(filename) === '.graphql') {
            const text = fs.readFileSync('src/schema/types/' + filename, 'utf8');
            return acc + text + "\n";
        }
        return acc;
    }, '');
    return schema;
}

const typeDefs = gql`${readSchema()}`;

const resolvers = {
    Query: {
        productTypes: (_, args) => {
            return db.models.productType.findAll({where: args})
        },
        productPropertyNames: (_, args) => {
            return db.models.productPropertyName.findAll({where: args})
        },
        productPropertyValues: (_, args) => {
            return db.models.productPropertyValue.findAll({where: args})
        },
        typePropertyNames: (_, args) => {
            return db.models.typePropertyName.findAll({where: args})
        },
        typePropertyValues: (_, args) => {
            return db.models.typePropertyValue.findAll({where: args})
        },
        products: (_, args) => {
            return db.models.product.findAll({where: args})
        },
        stock: (_, args) => {
            return db.models.stock.findAll({where: args})
        }
    },
    ProductType: {
        products: (productType) => {
            return productType.getProducts();
        },
    }
}

const PORT = 3000;
const server = new ApolloServer({ typeDefs, resolvers });

server.listen({port:PORT}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });