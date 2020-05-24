import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';

export class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition (field) {
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function (...args) {
        const { currentUser } = args[2]
        if (!currentUser) {
          throw new Error('You are not authenticated!')
        }

        return resolve.apply(this, args)
      }
    }
  }