import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {
  createComment,
  deleteComment,
  updateComment,
} from './resolvers/commentResolver';
import {likePost, unlikePost} from './resolvers/likeResolver';
import {createPost, deletePost, updatePost} from './resolvers/postResolver';
import {
  signup,
  login,
  changeName,
  changeEmail,
  changePassword,
  deleteSelf,
} from './resolvers/userResolver';
import {UserType, tokenType, PostType, commentType, likeType} from './types';

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
    deleteSelf: {type: UserType, resolve: deleteSelf},
    createPost: {
      type: PostType,
      args: {
        photo: {type: new GraphQLNonNull(GraphQLString)}, //change to photo/file once figured out
        caption: {type: GraphQLString},
        location: {type: GraphQLString},
      },
      resolve: createPost,
    },
    updatePost: {
      type: PostType,
      args: {
        post_id: {type: new GraphQLNonNull(GraphQLID)},
        caption: {type: GraphQLString},
        location: {type: GraphQLString},
      },
      resolve: updatePost,
    },
    deletePost: {
      type: PostType,
      args: {post_id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve: deletePost,
    },
    createComment: {
      type: commentType,
      args: {
        content: {type: new GraphQLNonNull(GraphQLString)},
        post_id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: createComment,
    },
    updateComment: {
      type: commentType,
      args: {
        content: {type: new GraphQLNonNull(GraphQLString)},
        comment_id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: updateComment,
    },
    deleteComment: {
      type: commentType,
      args: {comment_id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve: deleteComment,
    },
    likePost: {
      type: likeType,
      args: {
        post_id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: likePost,
    },
    unlikePost: {
      type: likeType,
      args: {
        post_id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: unlikePost,
    },
  },
});
