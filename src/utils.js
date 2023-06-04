import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
    apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
    apiSecret: process.env.REACT_APP_CLOUDINARY_SECRET
  },
  url: {
    secure: true
  }
});

export const getImageUrl = (publicId) => {
  if (!publicId) {
    return cld.image('default.png').toURL()
  }
  return cld.image(publicId).toURL()
}
