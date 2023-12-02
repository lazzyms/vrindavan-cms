/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { Helmet } from "react-helmet";
import Invert from "../Assets/Invert.png";

import {
  AdjustmentsIcon,
  HomeIcon,
  LogoutIcon,
  MenuIcon,
  PhotographIcon,
  XIcon,
  HeartIcon,
  OfficeBuildingIcon,
  ChatAltIcon,
  QuestionMarkCircleIcon,
  ViewListIcon,
} from "@heroicons/react/outline";
import Notification from "../Components/Notification";
import { classNames } from "../utils";
export const NotificationContext = React.createContext(null);
export const WindowWidthContext = React.createContext(null);

export default function Layout({ view, heading }) {
  const [isMobile, setIsMobile] = useState(false);
  const [notificationState, setNotificationState] = useState({
    show: false,
    message: "",
    type: "",
  });

  const notificationData = {
    setNotificationState,
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    {
      name: "Categories",
      href: "/",
      icon: HomeIcon,
      current:
        location.pathname === "/" ||
        location.pathname.startsWith("/categories") ||
        (location.pathname.startsWith("/products/") &&
          location.pathname !== "/products/discount"),
    },
    {
      name: "Bulk Price change",
      href: "/products/discount",
      icon: AdjustmentsIcon,
      current: location.pathname === "/products/discount",
    },
    {
      name: "Banners",
      href: "/banners",
      icon: PhotographIcon,
      current: location.pathname === "/banners",
    },
    {
      name: "Wishlists",
      href: "/wishlists",
      icon: HeartIcon,
      current: location.pathname === "/wishlists",
    },
    {
      name: "Orderes",
      href: "/orders",
      icon: ViewListIcon,
      current: location.pathname === "/orders",
    },
    {
      name: "Interiors",
      href: "/interiors",
      icon: OfficeBuildingIcon,
      current: location.pathname === "/interiors",
    },
    {
      name: "Testimonials",
      href: "/testimonials",
      icon: ChatAltIcon,
      current: location.pathname === "/testimonials",
    },
    {
      name: "User Queries",
      href: "/queries",
      icon: QuestionMarkCircleIcon,
      current: location.pathname === "/queries",
    },
  ];
  const width = window.matchMedia("(max-width: 400px)");
  const onChange = () => setIsMobile(!!width.matches);
  useEffect(() => {
    width.addEventListener("change", onChange);

    setIsMobile(width.matches);

    if (!localStorage.getItem("token")) {
      navigate("/login");
    }

    return () => width.removeEventListener("change", onChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <>
      <Helmet>
        <html className="h-full bg-gray-100" />
        <body className="h-full" />
      </Helmet>
      <NotificationContext.Provider value={notificationData}>
        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 md:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
              </Transition.Child>

              <div className="fixed inset-0 flex z-40">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                          type="button"
                          className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                      <div className="flex-shrink-0 flex items-center px-4">
                        <img
                          className="w-full"
                          src={Invert}
                          alt="Vrindavan Furniture"
                        />
                      </div>
                      <nav className="mt-5 px-2 space-y-1">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-gray-300"
                                  : "text-gray-400 group-hover:text-gray-300",
                                "mr-4 flex-shrink-0 h-6 w-6"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                    <div className="flex-shrink-0 flex bg-gray-700 p-4">
                      <button
                        className="flex items-center justify-start w-full px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:text-gray-100 hover:bg-gray-700 focus:outline-none focus:shadow-outline"
                        onClick={() => handleLogout()}
                      >
                        <LogoutIcon
                          className="text-gray-300 group-hover:text-gray-100 mr-3 flex-shrink-0 h-6 w-6"
                          aria-hidden="true"
                        />
                        Logout
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
                <div className="flex-shrink-0 w-14">
                  {/* Force sidebar to shrink to fit close icon */}
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
              <div className="flex-1 flex flex-col pt-2 pb-4 overflow-y-auto">
                <img
                  className="w-full"
                  src={Invert}
                  alt="Vrindavan Furniture"
                />
                <nav className="mt-1 flex-1 px-2 space-y-1">
                  {navigation.map((item) =>
                    !item.children ? (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-gray-300"
                              : "text-gray-400 group-hover:text-gray-300",
                            "mr-3 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ) : (
                      <Disclosure
                        as="div"
                        key={item.name}
                        className="space-y-1"
                      >
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={classNames(
                                item.current
                                  ? "text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "group w-full flex items-center pr-2 py-2 text-left text-sm font-medium rounded-md"
                              )}
                            >
                              <svg
                                className={classNames(
                                  open
                                    ? "text-gray-300 rotate-90"
                                    : "text-gray-400 group-hover:text-gray-300",
                                  "mr-2 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                )}
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  d="M6 6L14 10L6 14V6Z"
                                  fill="currentColor"
                                />
                              </svg>
                              {item.name}
                            </Disclosure.Button>
                            <Disclosure.Panel className="space-y-1">
                              {item.children.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className={classNames(
                                    subItem.current
                                      ? "bg-gray-900 text-white"
                                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                    "group w-full flex items-center pl-10 pr-2 py-2 text-sm font-medium rounded-md text-gray-300"
                                  )}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )
                  )}
                </nav>
                <div className="grid grid-cols-1 px-4 pb-0">
                  <div className="m-1">
                    <button
                      className="flex items-center justify-start w-full px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:text-gray-100 hover:bg-gray-700 focus:outline-none focus:shadow-outline"
                      onClick={() => handleLogout()}
                    >
                      <LogoutIcon
                        className="text-gray-300 group-hover:text-gray-100 mr-3 flex-shrink-0 h-6 w-6"
                        aria-hidden="true"
                      />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:pl-64 flex flex-col flex-1">
            <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
              <button
                type="button"
                className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <main className="flex-1">
              <div className="md:p-4 xl:p-2 2xl:p-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-2 xl:px-2">
                  <WindowWidthContext.Provider value={isMobile}>
                    <div className="py-4">{view}</div>
                  </WindowWidthContext.Provider>
                </div>
              </div>
            </main>
            <footer className="fixed bottom-0 bg-white w-full">
              <p className="pl-2 text-xs text-gray-400">
                CMS | Vrindavan Furniture
              </p>
            </footer>
            <Notification {...notificationState} />
          </div>
        </div>
      </NotificationContext.Provider>
    </>
  );
}
