import { useContext, useState } from "react";
import { classNames, getImageUrl } from "../utils";
import { WindowWidthContext } from "../Layout";
import { TrashIcon } from "@heroicons/react/outline";
import ConfirmDialouge from "./ConfirmDialouge";
import { deleteBanner } from "../services";
import { useNavigate } from "react-router-dom";

export default function BannerCard(props) {
  const navigate = useNavigate();
  const isMobile = useContext(WindowWidthContext);
  const [bannerDeleteModal, setBannerDeleteModal] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const onDelete = (id) => {
    deleteBanner(id).then((res) => {
      setIsRemoved(true);
      setBannerDeleteModal(false);
      navigate(`/banners`);
    });
  };

  return (
    <div className={classNames(isRemoved ? "hidden" : "flex flow-root")}>
      <div className="relative">
        <img
          src={getImageUrl(props.banner.image, isMobile)}
          className="h-60 w-full rounded-t-xl object-cover"
          alt={props.banner._id}
        />
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 rounded-t-3xl bg-black/20">
          <p className="text-md font-medium text-white drop-shadow text-center">
            {props.banner.category?.name || "Home"}
          </p>
        </div>
        <button
          className="absolute top-1 right-1 inline-flex items-center justify-center hover:bg-red-100 rounded-xl px-2 py-2 text-sm font-semibold bg-black/20"
          onClick={() => setBannerDeleteModal(true)}
        >
          <TrashIcon className="h-6 w-6 text-red-400" />
        </button>
      </div>

      <ConfirmDialouge
        id={props.banner._id}
        open={bannerDeleteModal}
        setOpen={(e) => setBannerDeleteModal(e)}
        message="Warning: You are about to erase the category and all its contents. This is a permanent action and cannot be reversed. Please confirm if you want to proceed."
        title={`Delete Banner`}
        handleAction={(e) => onDelete(e)}
      />
    </div>
  );
}
