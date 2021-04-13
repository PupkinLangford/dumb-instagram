import User from '../models/user';
import Post from '../models/post';
import Comment from '../models/comment';
import Like from '../models/like';
import Follow from '../models/follow';

export const createUser = async () => {
  const user = new User({
    first_name: 'Test',
    last_name: 'User',
    username: 'testuser',
    password: '12345',
    email: 'testuser@aol.com',
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
    bio: 'testing post creation',
  });

  await user.save();

  const post = new Post({
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
    bio: 'testing comment creation',
  });

  await user.save();

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
    bio: 'testing like creation',
  });

  await user.save();

  const like = new Like({
    liker: user._id,
    post: post._id,
    timestamp: new Date(),
  });

  return await like.save();
};

export const createFollow = async () => {
  const user1 = new User({
    first_name: 'Test',
    last_name: 'Follower',
    username: 'testfollower',
    password: '12345',
    email: 'testfollow@aol.com',
    bio: 'testing follow creation',
  });

  await user1.save();

  const user2 = new User({
    first_name: 'Test',
    last_name: 'Following',
    username: 'testfollowing',
    password: '12345',
    email: 'testfollowing@aol.com',
    bio: 'testing follow creation',
  });

  await user2.save();

  const follow = new Follow({
    follower: user1._id,
    following: user2._id,
    timestamp: new Date(),
  });

  const follow2 = new Follow({
    follower: user2._id,
    following: user1._id,
    timestamp: new Date(),
  });

  return await Promise.all([follow.save(), follow2.save()]);
};
