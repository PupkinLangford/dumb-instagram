import User from '../models/user';
import Post from '../models/post';
import Comment from '../models/comment';
import Like from '../models/like';

export const createUser = async () => {
  const user = new User({
    first_name: 'Test',
    last_name: 'User',
    username: 'testuser',
    password: '12345',
    email: 'testuser@aol.com',
    profile_pic: '111',
    bio: 'live laugh love <33',
  });

  return await user.save();
};

export const createPost = async () => {
  const user = new User({
    first_name: 'Test',
    last_name: 'Poster',
    username: 'testposter',
    password: '12345',
    email: 'testpost@aol.com',
    profile_pic: '222',
    bio: 'testing post creation',
  });

  await user.save();

  const post = new Post({
    photo: '111',
    caption: 'test post',
    author: user._id,
    location: 'Asia, Lima Peru',
    timestamp: new Date(),
  });

  return await post.save();
};

export const createComment = async () => {
  const post = await createPost();

  const user = new User({
    first_name: 'Test',
    last_name: 'Commenter',
    username: 'testcommenter',
    password: '12345',
    email: 'testcomment@aol.com',
    profile_pic: '333',
    bio: 'testing comment creation',
  });

  const comment = new Comment({
    author: user._id,
    post: post._id,
    content: 'test comment',
    timestamp: new Date(),
  });

  return await comment.save();
};

export const createLike = async () => {
  const post = await createPost();

  const user = new User({
    first_name: 'Test',
    last_name: 'Liker',
    username: 'testliker',
    password: '12345',
    email: 'testlike@aol.com',
    profile_pic: '444',
    bio: 'testing like creation',
  });

  const like = new Like({
    liker: user._id,
    post: post._id,
    timestamp: new Date(),
  });

  return await like.save();
};
