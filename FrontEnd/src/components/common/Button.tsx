import React from "react";

interface buttonprps {
  Label: string;
  type?: string;
}

const BUTTON: React.FC<buttonprps> = ({ Label }) => {
  return (
    <>
      <button type="button" className="text-white bg-teal-400">
        {Label}
      </button>
    </>
  );
};

export default BUTTON;
