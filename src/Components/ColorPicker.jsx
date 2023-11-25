// ColorPicker.js
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { SketchPicker } from "react-color";
const ColorPicker = ({
  selectedColor,
  colorPickerOpen,
  editIndex,
  setColorPickerOpen,
  addColor,
  setSelectedColor,
  updateColor,
}) => {
  return (
    <Transition show={colorPickerOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setColorPickerOpen}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block w-full max-w-xs p-6 my-8 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2xl text-center">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              {editIndex !== undefined ? "Edit color" : "Add color"}
            </Dialog.Title>
            <div className="mt-2">
              <SketchPicker
                styles={{
                  picker: { boxShadow: "none" },
                  hue: {
                    padding: "0px 2px",
                    position: "relative",
                    height: "20px",
                  },
                }}
                className="shadow-none"
                color={selectedColor}
                onChangeComplete={(color) => setSelectedColor(color.hex)}
              />
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="w-full bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => {
                  if (editIndex !== undefined) {
                    updateColor(editIndex);
                  } else {
                    addColor();
                  }
                }}
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ColorPicker;
