import React from "react";

type Props = {
  mintOpen: boolean;
  soldOut: boolean;
};

export default function MintMessage({
  mintOpen, soldOut
}: Props) {
  let message: string;
  if (mintOpen) {
    if (soldOut)
      message = "SOLD OUT";
    else
      message = "MINT AND GET LIT!";
  }
  else {
    message = "MINT STARTS ON FEB 28TH 1PM CST";
  }

  return (
    <div className="flex justify-center mt-4 mb-8">
      <h1 className="my-auto text-center align-middle text-md text-secondary">
        {message}
      </h1>
    </div>
  );
}
