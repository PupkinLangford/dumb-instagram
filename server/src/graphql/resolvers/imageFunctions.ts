import {v2} from 'cloudinary';
import {FileUpload} from 'graphql-upload';

export const uploadImage = async (
  picture: FileUpload,
  folder: string,
  filename: string
) => {
  const pictureStream = (await picture).createReadStream();
  let image_url = '';
  await new Promise(resolve => {
    const stream = v2.uploader.upload_stream(
      {public_id: filename, format: 'jpg', folder},
      (_err, result) => {
        image_url = result!.public_id;
        resolve(image_url);
      }
    );

    pictureStream.pipe(stream);
  });
  return image_url;
};
