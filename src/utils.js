import { Cloudinary } from "@cloudinary/url-gen";
import { scale } from "@cloudinary/url-gen/actions/resize";

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

export const getImageUrl = (publicId, mobile = false) => {
  if (!publicId) {
    return cld.image('default.webp').toURL()
  }
  return mobile ? cld.image(publicId).format('webp').quality('auto:best').resize(scale().width(400)).toURL() : cld.image(publicId).format('webp').quality('auto:best').toURL()
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
