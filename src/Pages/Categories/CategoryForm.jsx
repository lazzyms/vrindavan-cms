/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Switch } from "@headlessui/react";
import { useEffect } from "react";
import {
  addOrUpdateCategories,
  getCategories,
  getCategoryDetails,
  uploadToCloudinary,
} from "../../services";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationContext, WindowWidthContext } from "../../Layout";
import Breadcrumb from "../../Components/Breadcrumbs";
import { classNames, getImageUrl } from "../../utils";
import { ErrorMessage } from "@hookform/error-message";
import LoaderSvg from "../../Components/LoaderSvg";

export default function CategoryForm() {
  const navigate = useNavigate();
  const { setNotificationState } = useContext(NotificationContext);
  const isMobile = useContext(WindowWidthContext);
  const [categoryDetails, setCategoryDetails] = useState({});
  const [icon, setIcon] = useState("");
  const [cover, setCover] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [pages, setPages] = useState([
    {
      name: "Categories",
      href: "/",
      current: false,
    },
    {
      name: "Add new",
      href: `/categories/new`,
      current: true,
    },
  ]);
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  useEffect(() => {
    if (id) {
      getCategoryDetails(id)
        .then((res) => {
          if (res.data.success) {
            setValue("name", res.data.data.name);
            // setValue("icon", categoryDetails.icon);
            setValue("description", res.data.data.description);
            // setValue("coverImage", res.data.data.coverImage);
            setValue("isVisible", res.data.data.isVisible);
            setValue("parentId", res.data.data.parentId);
            setCategoryDetails(res.data.data);
            setIcon(getImageUrl(res.data.data.icon, isMobile));
            setCover(getImageUrl(res.data.data.coverImage, isMobile));
            setEnabled(res.data.data.isVisible);
            setPages([
              {
                name: "Categories",
                href: "/",
                current: false,
              },
              {
                name: `Edit ${res.data.data.name}`,
                href: `/categories/${id}`,
                current: true,
              },
            ]);
          } else {
            setNotificationState({
              message: res.data.message,
              type: "error",
              show: true,
            });
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
  }, [id]);

  const [loading, setLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data.success) {
          setParentCategories(res.data.data);
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
  }, []);

  const onSubmit = async (data, e) => {
    setLoading(true);
    const coverData = new FormData();
    if (data.icon[0]) {
      const iconData = new FormData();
      iconData.append("file", data.icon[0]);
      iconData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      iconData.append("folder", "category-icons/");
      const icon = await uploadToCloudinary(iconData);
      data.icon = icon.public_id;
    } else if (id) {
      data.icon = categoryDetails.icon ? categoryDetails.icon : "";
    }
    if (data.coverImage[0]) {
      coverData.append("file", data.coverImage[0]);
      coverData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_PRESET
      );
      coverData.append("folder", "category-cover/");
      const cover = await uploadToCloudinary(coverData);
      data.coverImage = cover.public_id;
    } else if (id) {
      data.coverImage = categoryDetails.coverImage
        ? categoryDetails.coverImage
        : "";
    } else {
      data.coverImage = "";
    }
    addOrUpdateCategories(data)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setNotificationState({
            type: "success",
            message: res.data.message,
            show: true,
          });
          navigate("/");
        } else {
          setNotificationState({
            type: "success",
            message: res.data.message,
            show: true,
          });
        }
      })
      .catch((err) => {
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

  const handleIconChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setIcon(URL.createObjectURL(e.target.files[0]));
    } else {
      URL.revokeObjectURL(icon);
      setIcon("");
    }
  };
  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCover(URL.createObjectURL(e.target.files[0]));
    } else {
      URL.revokeObjectURL(cover);
      setCover("");
    }
  };
  return (
    <>
      <Breadcrumb pages={pages} />
      <form
        className="space-y-8 divide-y divide-gray-200"
        // onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div>
            {id && (
              <input type="hidden" name="id" {...register("id")} value={id} />
            )}
            <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="name"
                      // defaultValue={categoryDetails?.name}
                      className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                      {...register("name", {
                        required: true,
                      })}
                      placeholder="Enter name of Product Category, e.g. Sofa"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Description
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    // defaultValue={categoryDetails.description}
                    className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Enter a description of the category"
                    {...register("description")}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Icon
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center">
                    <label
                      htmlFor="icon"
                      className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span>Upload Icon</span>
                      <input
                        id="icon"
                        name="icon"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        // defaultValue={categoryDetails.icon}
                        {...register("icon", {
                          required: categoryDetails.icon ? false : true,
                          onChange: (e) => handleIconChange(e),
                        })}
                      />
                    </label>
                    {icon && (
                      <img
                        src={icon}
                        alt="icon"
                        className="m-2 w-16 h-16 object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="cover-photo"
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
                      <span>Upload Cover</span>
                      <input
                        id="coverImage"
                        name="coverImage"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        // defaultValue={categoryDetails.coverImage}
                        {...register("coverImage", {
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
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Parent Category
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <select
                    id="parentId"
                    name="parentId"
                    autoComplete="parent-category"
                    className="max-w-lg block w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    {...register("parentId")}
                  >
                    <option value="">Select</option>
                    {parentCategories.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    Select only if adding sub-category
                  </p>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Visible
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <Controller
                    name="isVisible"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(checked) => {
                          field.onChange(checked);
                          setEnabled(checked);
                        }}
                        className={classNames(
                          enabled ? "bg-indigo-600" : "bg-gray-200",
                          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            enabled ? "translate-x-5" : "translate-x-0",
                            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200"
                          )}
                        />
                      </Switch>
                    )}
                  />
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
              onClick={handleSubmit(onSubmit)}
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
