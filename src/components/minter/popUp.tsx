import React, {Fragment, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {ClipLoader} from "react-spinners";

const NFT_FEE = Number(process.env.NEXT_PUBLIC_MINT_FEE);

type Props = {
  isOpen: boolean;
  openModal: any;
  closeModal: any;
  mint: any;
  approve: any;
  readyToMint: boolean;
  isMinting: boolean;
  isApproving: boolean;
  quantity: string;
};

export default function PopUp({
  isOpen,
  closeModal,
  mint,
  approve,
  readyToMint,
  isMinting,
  isApproving,
  quantity,
}: Props) {
  function getDialogText() {
    if (readyToMint) {
      if (isMinting) {
        return "Minting...";
      } else {
        return `Confirm transaction in your wallet to mint ${ quantity == "1" ? "1 cute FlameStarter!" : `${ quantity } cute FlameStarters!`
          }`;
      }
    } else {
      if (isApproving) {
        return `Approving...`;
      } else {
        return `Approve ${ (Number(quantity) * NFT_FEE).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          },
        ) } ${ process.env.NEXT_PUBLIC_TOKEN_SYMBOL } in your wallet to mint ${ quantity == "1" ? "1 FlameStarter." : `${ quantity } FlameStarters.`
          }`;
      }
    }
  }


  function isButtonEnabled() {
    if (readyToMint) {
      if (!mint || isMinting) {
        return false;
      } else {
        return true;
      }
    } else {
      if (!approve || isApproving) {
        return false;
      } else {
        return true;
      }
    }
  }

  function getButtonText() {
    if (readyToMint) {
      return "MINT";
    }
    return "APPROVE";
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-black p-6 text-left align-middle opacity-95 shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-primary"
                  >
                    {readyToMint
                      ? `Confirm NFT Mint`
                      : `Approve ${ process.env.NEXT_PUBLIC_TOKEN_SYMBOL }`}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{getDialogText()}</p>
                  </div>

                  <div className="mt-4">
                    {isApproving || isMinting ? (
                      <ClipLoader color="#FF6B10" />
                    ) : (
                      <div>
                        <button
                          className="h-12 rounded-xl border-2 border-black bg-primary px-5 py-3 font-bold text-black hover:border-primary hover:bg-secondary"
                          disabled={!isButtonEnabled()}
                          onClick={(e) => {
                            if (!readyToMint) {
                              approve?.();
                            } else {
                              mint?.();
                            }
                          }}
                        >
                          {getButtonText()}
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>

          </div>
        </Dialog>
      </Transition>
    </>
  );
}
