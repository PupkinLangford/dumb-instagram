import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {GraphQLUpload} from 'graphql-upload';
import {
  createComment,
  deleteComment,
  updateComment,
} from './resolvers/commentResolver';
import {followUser, unfollowUser} from './resolvers/followResolver';
import {likePost, unlikePost} from './resolvers/likeResolver';
import {createPost, deletePost, updatePost} from './resolvers/postResolver';
import {
  signup,
  login,
  changeName,
  changeEmail,
  changePassword,
  deleteSelf,
  changeProfilePic,
  deleteProfilePic,
  changeBio,
} from './resolvers/userResolver';
import {UserType, tokenType, PostType, commentType} from './types';

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
    changeBio: {
      type: UserType,
      args: {bio: {type: GraphQLString}},
      resolve: changeBio,
    },
    changeProfilePic: {
      type: GraphQLBoolean,
      args: {
        picture: {type: new GraphQLNonNull(GraphQLUpload)},
      },
      resolve: changeProfilePic,
    },
    deleteProfilePic: {
      type: GraphQLBoolean,
      resolve: deleteProfilePic,
    },
    deleteSelf: {
      type: UserType,
      args: {password: {type: new GraphQLNonNull(GraphQLString)}},
      resolve: deleteSelf,
    },
    followUser: {
      type: UserType,
      args: {
        user_id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: followUser,
    },
    unfollowUser: {
      type: UserType,
      args: {
        user_id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: unfollowUser,
    },
    createPost: {
      type: PostType,
      args: {
        photo: {type: new GraphQLNonNull(GraphQLUpload)},
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
      type: PostType,
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
      type: PostType,
      args: {
        post_id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: likePost,
    },
    unlikePost: {
      type: PostType,
      args: {
        post_id: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: unlikePost,
    },
  },
});
