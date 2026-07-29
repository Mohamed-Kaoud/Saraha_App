import cloudinary from "./cloudinary.connect.js";

export const uploadImage = async ({
    file,
    folder = "Saraha_Clone",
}) => {

    const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
            folder,
        }
    );

    return {
        secure_url,
        public_id,
    };
};

export const uploadImages = async ({
  files = [],
  folder = "Saraha_Clone",
}) => {
  const images = [];

  for (const file of files) {
    const image = await uploadImage({ file, folder });
    images.push(image);
  }

  return images;
};

export const deleteImage = async (public_id) => {

    return await cloudinary.uploader.destroy(public_id);

};

export const deleteImages = async (public_ids = []) => {

    return await Promise.all(
        public_ids.map((id) => deleteImage(id))
    );

};