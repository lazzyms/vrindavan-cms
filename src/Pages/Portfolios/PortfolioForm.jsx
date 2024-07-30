/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  addBanner,
  addOrUpdatePortfolio,
  getCategories,
  getPortfolioById,
  removeFromCloudinary,
  uploadToCloudinary,
} from "../../services";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationContext, WindowWidthContext } from "../../Layout";
import Breadcrumb from "../../Components/Breadcrumbs";
import LoaderSvg from "../../Components/LoaderSvg";
import { ErrorMessage } from "@hookform/error-message";
import { classNames, getImageUrl } from "../../utils";
import { Switch } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/outline";
import _ from "lodash";
import MarkDownInput from "../../Components/MarkDownInput";

export default function PortfolioForm() {
  let { pid } = useParams();
  const navigate = useNavigate();
  const { setNotificationState } = useContext(NotificationContext);
  const isMobile = useContext(WindowWidthContext);

  const [portfolio, setPortfolio] = useState({});
  const [cover, setCover] = useState("");
  const [pictures, setPictures] = useState([]);
  useEffect(() => {
    if (pid) {
      getPortfolioById(pid)
        .then((res) => {
          if (res.data.success) {
            const portfolio = res.data.data;

            if (portfolio.pictures.length > 0) {
              setPictures(
                portfolio.pictures.map((img) => getImageUrl(img, isMobile))
              );
            }
            if (portfolio.coverImage) {
              setCover(getImageUrl(portfolio.coverImage, isMobile));
            }
            setPortfolio(portfolio);
          }
        })
        .catch((err) => {
          setNotificationState({
            type: "error",
            message:
              err.response.status === 400
                ? err.response.data.error.message
                : err.message,
            show: true,
          });
        });
    }
  }, [pid]);

  const [pages] = useState([
    {
      name: "Portfolio",
      href: "/portfolio",
      current: false,
    },
    {
      name: pid ? "Edit site" : "Add new site",
      href: pid ? `/portfolio/${pid}` : `portfolio/new`,
      current: true,
    },
  ]);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("title", portfolio?.title ?? "");
    setValue("description", portfolio?.description ?? "");
    setValue("isVisible", portfolio?.isVisible ?? "");
  }, [portfolio]);

  const onSubmit = async (data) => {
    setLoading(true);
    data.slug = data.title.toLowerCase().replace(/ /g, "-");
    if (data.coverImage[0]) {
      const iconData = new FormData();
      iconData.append("file", data.coverImage[0]);
      iconData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      iconData.append("folder", `portfolio/${data.slug}/cover/`);
      const icon = await uploadToCloudinary(iconData);
      data.coverImage = icon.public_id;
    }

    const files = Array.from(data.pictures || {});
    const productImages = await Promise.all(
      files.map(async (img, i) => {
        const productData = new FormData();
        productData.append("file", img);
        productData.append(
          "upload_preset",
          process.env.REACT_APP_CLOUDINARY_PRESET
        );
        productData.append("folder", `portfolio/${data.slug}/`);
        const icon = await uploadToCloudinary(productData);
        return icon.public_id;
      })
    );
    data.pictures = productImages;
    if (pid && portfolio.pictures.length > 0 && pictures.length > 0) {
      const keptImageIds = pictures
        .map((img) =>
          _.find(portfolio.pictures, (item) => _.includes(img, item))
        )
        .filter(Boolean);
      const removedImages = _.differenceBy(portfolio.pictures, keptImageIds);

      if (removedImages.length > 0) {
        await removeFromCloudinary(removedImages);
      }
      data.pictures = [...data.pictures, ...keptImageIds];
    }

    addOrUpdatePortfolio(data)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setNotificationState({
            type: "success",
            message: res.data.message,
            show: true,
          });
          navigate("/portfolio/");
        } else {
          setNotificationState({
            type: "success",
            message: res.data.message,
            show: true,
          });
        }
      })
      .catch((err) => {
        // TODO remove images from cloudinary on error
        setLoading(false);
        setNotificationState({
          type: "error",
          message:
            err.response.status === 400
              ? err.response.data.error.message
              : err.message,
          show: true,
        });
      });
  };

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCover(URL.createObjectURL(e.target.files[0]));
    } else {
      URL.revokeObjectURL(cover);
      setCover("");
    }
  };

  const handlePicturesChange = (e) => {
    if (e.target.files) {
      const targets = Array.prototype.slice.call(e.target.files);
      const tempPictures = targets.map((file) => {
        return URL.createObjectURL(file);
      });
      setPictures([...tempPictures]);
    } else {
      pictures.forEach((picture) => URL.revokeObjectURL(picture));
      setPictures();
    }
  };

  const removePic = (url) => {
    setPictures(pictures.filter((img) => img !== url));
  };
  return (
    <>
      <Breadcrumb pages={pages} />
      <form
        className="space-y-8 divide-y divide-gray-200"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div>
            <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Title
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      autoComplete="title"
                      className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                      {...register("title", {
                        required: true,
                      })}
                      placeholder="Enter name of work site"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Description
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <MarkDownInput
                        id="description"
                        {...field}
                        defaultValue={portfolio && portfolio.description}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="isVisible"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Show/Hide
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <Controller
                    id="isVisible"
                    name="isVisible"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Switch
                        checked={value}
                        defaultChecked={portfolio ? portfolio.isVisible : true}
                        onChange={onChange}
                        className={`${
                          value ? "bg-indigo-600" : "bg-gray-200"
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span className="sr-only">Show/Hide</span>
                        <span
                          className={`${
                            value ? "translate-x-6" : "translate-x-1"
                          } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                      </Switch>
                    )}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="coverImage"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Cover Image
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center">
                    <label
                      htmlFor="coverImage"
                      className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    >
                      <span>Upload Cover (Desktop/Tablet)</span>
                      <input
                        id="coverImage"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        {...register("coverImage", {
                          required: "Cover image is required",
                          onChange: (e) => handleCoverChange(e),
                        })}
                      />
                    </label>
                    {cover && (
                      <img
                        src={cover}
                        alt="coverImage"
                        className="m-2 w-32 h-16 object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="picture"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Pictures
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center">
                    <label
                      htmlFor="pictures"
                      className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    >
                      <span>Upload Pictures</span>
                      <input
                        id="pictures"
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        {...register("pictures", {
                          required: "Picture is required",
                          onChange: (e) => handlePicturesChange(e),
                        })}
                      />
                    </label>
                  </div>
                  {pictures && pictures.length > 0 && (
                    <div className="flex gap-4 overflow-x-auto">
                      {pictures.map((image, index) => (
                        <div
                          key={image}
                          className="flex-shrink-0 relative group"
                        >
                          <img
                            src={image}
                            alt={image}
                            className="m-2 h-40 w-40 object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 text-gray-200 rounded-md text-sm invisible group-hover:visible"
                            onClick={() => removePic(image)}
                          >
                            <XCircleIcon className="h-6 w-6 text-red-800 bg-white rounded-full" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <ErrorMessage
              errors={errors}
              name="multipleErrorInput"
              render={({ messages }) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p key={type}>{message}</p>
                ))
              }
            />
            <button
              type="submit"
              className={classNames(
                loading ? "cursor-not-allowed animate-pulse" : "",
                "ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              )}
            >
              Save
              {loading && <LoaderSvg />}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
