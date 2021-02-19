import {v2} from 'cloudinary';
import {ReadStream} from 'fs';

export const uploadImage = async (picture: ReadStream, filename: string) => {
  let image_url: string | undefined;
  await new Promise(resolve => {
    const stream = v2.uploader.upload_stream(
      {public_id: filename, format: 'jpg'},
      (_err, result) => {
        image_url = result!.public_id;
        resolve(image_url);
      }
    );

    picture.pipe(stream);
  });
  return image_url;
};
