import {GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql';
import {
  signup,
  login,
  changeName,
  changeEmail,
  changePassword,
} from './resolvers/userResolver';
import {UserType, tokenType} from './types';

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        username: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
        passwordConfirm: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: signup,
    },
    login: {
      type: tokenType,
      args: {
        username: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: login,
    },
    changeName: {
      type: UserType,
      args: {
        first_name: {type: new GraphQLNonNull(GraphQLString)},
        last_name: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: changeName,
    },
    changeEmail: {
      type: UserType,
      args: {
        email: {type: new GraphQLNonNull(GraphQLString)},
        emailConfirm: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: changeEmail,
    },
    changePassword: {
      type: UserType,
      args: {
        password: {type: new GraphQLNonNull(GraphQLString)},
        passwordConfirm: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: changePassword,
    },
  },
});
