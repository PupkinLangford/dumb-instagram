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
      {public_id: filename, format: 'jpg', folder, invalidate: true},
      (_err, result) => {
        image_url = result!.public_id;
        resolve(image_url);
      }
    );

    pictureStream.pipe(stream);
  });
  return image_url;
};

export const deleteImage = (photo_id: string) =>
  v2.uploader.destroy(photo_id, {invalidate: true});

export const deleteFolder = (folder_id: string) =>
  v2.api.delete_resources_by_prefix(folder_id + '/', {invalidate: true});
