"use client";
import {nftABI} from "@/assets/nftABI";
import {tokenABI} from "@/assets/tokenABI";
import React, {useEffect, useState} from "react";
import Image from "next/image";

import {formatEther, parseEther, parseUnits} from "viem";
import {
  useAccount,
  useBalance,
  useContractReads,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";


import MintMessage from "./mintMessage";
import MintInputPanel from "./mintInputPanel";
import MintButton from "./mintButton";
import PopUp from "./popUp";

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${ string }`;
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as `0x${ string }`;
const NFT_FEE = Number(process.env.NEXT_PUBLIC_MINT_FEE);

type Props = {};

export default function Minter({}: Props) {

  // user input states
  const [quantity, setQuantity] = useState<string>("1");
  const [tokenTransferAmount, setTokenTransferAmount] = useState<bigint>(
    parseEther(
      NFT_FEE.toString()
    ),
  );
  const [ethTransferAmount, setEthTransferAmount] = useState<bigint>(
    parseEther("0.1"),
  );


  // native balance states
  const [ethBalance, setEthBalance] = useState<bigint | undefined>(
    undefined,
  );

  // token contract states
  const [tokenBalance, setTokenBalance] = useState<bigint | undefined>(
    undefined,
  );
  const [approvedAmount, setApprovedAmount] = useState<bigint | undefined>(
    undefined,
  );


  // nft contract states
  const [nftBalance, setNftBalance] = useState<number | undefined>(undefined);
  const [maxPerWallet, setMaxPerWallet] = useState<number | undefined>(
    undefined,
  );
  const [batchLimit, setBatchLimit] = useState<number | undefined>(undefined);
  const [totalSupply, setTotalSupply] = useState<number | undefined>(undefined);
  const [ethFee, setEthFee] = useState<bigint | undefined>(parseEther("0.001"));

  // mint eligibility checks

  const [mintStarted, setMintStarted] = useState<boolean>(false);
  const [readyToMint, setReadyToMint] = useState<boolean>(false);
  const [insufficientFunds, setInsufficientFunds] = useState<boolean>(false);
  const [maxExceeded, setMaxExceeded] = useState<boolean>(false);


  // get account address
  const {address, isConnecting, isDisconnected, isConnected} = useAccount({});


  // get chain
  const {chain} = useNetwork();

  // get native balance
  const nativeBalance = useBalance({
    address: address,
    chainId: chain?.id,
  });

  // define token contract config
  const tokenContract = {
    address: TOKEN_CONTRACT,
    abi: tokenABI,
    chainId: chain?.id,
  };

  // define token contract config
  const nftContract = {
    address: NFT_CONTRACT,
    abi: nftABI,
    chainId: chain?.id,
  };

  // read token info
  const {
    data: accountData,
    refetch: refetchTokenContract,
    isSuccess: isTokenReadSuccess,
  } = useContractReads({
    contracts: [
      {
        ...tokenContract,
        functionName: "balanceOf",
        args: [address as `0x${ string }`],
      },
      {
        ...tokenContract,
        functionName: "allowance",
        args: [address as `0x${ string }`, NFT_CONTRACT],
      },
    ],
    enabled: isConnected && address != null,
    watch: true,
  });

  // read nft info
  const {
    data: nftData,
    refetch: refetchNftContract,
    isSuccess: isNftReadSuccess,
  } = useContractReads({
    contracts: [
      {
        ...nftContract,
        functionName: "balanceOf",
        args: [address as `0x${ string }`],
      },
      {
        ...nftContract,
        functionName: "getBatchLimit",
      },
      {
        ...nftContract,
        functionName: "getMaxPerWallet",
      },
      {
        ...nftContract,
        functionName: "totalSupply",
      },
      {
        ...nftContract,
        functionName: "getEthFee",
      },
    ],
    enabled: isConnected && address != null,
    watch: true,
  });

  // set nft contract states
  useEffect(() => {

    if (nftData !== undefined) {
      setNftBalance(Number(nftData[0].result));
      setBatchLimit(Number(nftData[1].result));
      setMaxPerWallet(Number(nftData[2].result));
      setTotalSupply(Number(nftData[3].result));
      setEthFee(nftData[4].result);
    }

  }, [nftData]);

  // set chain states
  useEffect(() => {
    if (nativeBalance.data?.formatted !== undefined) {
      setEthBalance(parseEther(nativeBalance.data?.formatted));
    }
  }, [nativeBalance]);

  // token contract states
  useEffect(() => {
    if (accountData !== undefined) {
      setTokenBalance(accountData[0].result);
      setApprovedAmount(accountData[1].result);
    }

  }, [accountData]);

  // WRITE CONTRACTS
  // =========================================================

  // approving funds
  const {config: approvalConfig} = usePrepareContractWrite({
    address: TOKEN_CONTRACT as `0x${ string }`,
    abi: tokenABI,
    functionName: "approve",
    args: [NFT_CONTRACT, tokenTransferAmount],
    enabled: isConnected
  });

  const {
    data: approvedData,
    write: approve,
    isError: approvalError,
  } = useContractWrite(approvalConfig);

  const {isLoading: isApprovalLoading, isSuccess: isApprovalSuccess} =
    useWaitForTransaction({
      confirmations: 1,
      hash: approvedData?.hash,
    });

  // mint nfts
  const {config: mintConfig} = usePrepareContractWrite({
    ...nftContract,
    functionName: "mint",
    value: ethTransferAmount,
    args: [BigInt(quantity)],
    enabled: readyToMint === true && isConnected,
  });

  const {
    data: mintData,
    write: mint,
    isError: mintError,
  } = useContractWrite(mintConfig);

  const {isLoading: isMintLoading, isSuccess: isMintSuccess} =
    useWaitForTransaction({
      confirmations: 2,
      hash: mintData?.hash,
    });

  useEffect(() => {
    refetchTokenContract();
    refetchNftContract();
  }, []);

  // handle error
  useEffect(() => {
    if (mintError || approvalError) {
      closeModal();
    }
  }, [mintError, approvalError]);

  // refetch data after approval and mint
  useEffect(() => {
    if (isMintSuccess) {
      refetchTokenContract();
      refetchNftContract();
      closeModal();
    }
  }, [isMintSuccess]);

  useEffect(() => {
    if (isApprovalSuccess) {
      refetchTokenContract();
      refetchNftContract();
    }
  }, [isApprovalSuccess]);

  // update authorization for minting
  useEffect(() => {
    const isReadyToMint = () => {
      if (
        approvedAmount !== undefined &&
        nftBalance !== undefined &&
        maxPerWallet !== undefined &&
        tokenTransferAmount !== undefined
      ) {
        if (
          Number(quantity) > 0 &&
          nftBalance + Number(quantity) <= maxPerWallet &&
          approvedAmount >= tokenTransferAmount
        ) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    };
    setReadyToMint(isReadyToMint());
  }, [
    approvedAmount,
    tokenTransferAmount,
    quantity,
    nftBalance,
    maxPerWallet
  ]);

  // update transfer amount
  useEffect(() => {
    if (Number(quantity) > 0 && ethFee !== undefined) {
      const tokenAmount = parseEther(`${ Number(quantity) * NFT_FEE }`);
      setTokenTransferAmount(tokenAmount);
      const ethAmount = parseEther(`${ Number(formatEther(ethFee)) * Number(quantity) }`);
      setEthTransferAmount(ethAmount);
    }
  }, [quantity]);

  // update mint status
  useEffect(() => {
    if (batchLimit !== undefined) {
      if (batchLimit === 0) setMintStarted(false);
      else setMintStarted(true);
    }
  }, [batchLimit]);

  // update isufficient funds
  useEffect(() => {
    if (tokenBalance !== undefined && ethBalance !== undefined) {
      if (tokenBalance < tokenTransferAmount || ethBalance < ethTransferAmount) setInsufficientFunds(true);
      else setInsufficientFunds(false);
    }

  }, [tokenBalance, tokenTransferAmount]);

  // update max per wallet exceeded
  useEffect(() => {
    if (nftBalance !== undefined && maxPerWallet !== undefined) {
      if (nftBalance + Number(quantity) > maxPerWallet) setMaxExceeded(true);
      else setMaxExceeded(false);
    }
  }, [nftBalance, quantity, maxPerWallet]);

  // update button enabled
  function isButtonEnabled() {
    if (readyToMint) {
      if (isApprovalLoading || isMintLoading || !mint) {
        return false;
      } else {
        return true;
      }
    } else {
      if (!approve) {
        return false;
      } else {
        return true;
      }
    }
  };

  // ============================================================================
  // display elements

  const setMintQuantity = (value: string) => {
    console.log(readyToMint);
    setQuantity(value);
  };

  const getMintQuantity = () => {
    return quantity;
  };

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-md p-1 bg-gradient-to-b from-primary to-secondary my-3">
      <div className="mx-auto h-full w-full max-w-sm flex-col justify-between rounded-lg bg-black p-8 md:max-w-none">
        <div className="mx-auto mb-4 w-full max-w-xs overflow-hidden rounded border-2 border-primary bg-white">
          <Image
            src="/featured_image.jpg"
            width={250}
            height={250}
            alt="The FlameStarters"
            style={{
              width: "100%",
              height: "auto",
            }}
            priority
          />
          <div className="m-4">
            <div className="m-1 font-bold text-black ">{"The FlameStarters"}</div>
            <div className="m-1 text-black text-sm">{`${ ethFee ? formatEther(ethFee) : "" }${ String.fromCharCode(8239) }BNB & ${ NFT_FEE / 1000000
              }${ String.fromCharCode(8239) }M $${ process.env.NEXT_PUBLIC_TOKEN_SYMBOL
              } PER NFT`}</div>
          </div>
        </div>


        {mintStarted ? (
          <div className="pt-2">
            <div className="my-4 justify-center text-center">
              <MintMessage
                mintOpen={mintStarted}
                soldOut={(totalSupply === 177)}
              ></MintMessage>
              <MintInputPanel
                setMintQuantity={setMintQuantity}
                getMintQuantity={getMintQuantity}
                batchLimit={batchLimit}
              ></MintInputPanel>
            </div>
            {/* <div className="mt-2 flex justify-center">{mintButton()}</div> */}
            <div className="mt-2 flex justify-center">
              <MintButton
                insufficientFunds={insufficientFunds}
                maxExceeded={maxExceeded}
                maxPerWallet={maxPerWallet}
                readyToMint={readyToMint}
                buttonEnabled={isButtonEnabled()}
                approve={approve}
                mint={mint}
                openPopUp={openModal}
                closePopUp={closeModal}
                disconnected={(isConnected == undefined || isConnected == false)}
              ></MintButton>
            </div>
          </div>
        ) : (
          <div className="flex-col justify-center gap-4 text-center pt-4">
            <MintMessage
              mintOpen={mintStarted}
              soldOut={(totalSupply === 177)}
            ></MintMessage>
            <div className="mx-auto my-2 flex h-12 w-fit rounded-xl border-2 border-black bg-primary px-4 align-middle font-bold text-black hover:border-primary hover:bg-secondary">
              <a
                className="m-auto"
                href={`https://pancakeswap.finance/swap?chain=bsc&outputCurrency=${ process.env.NEXT_PUBLIC_TOKEN_CONTRACT }`}
                target={"_blank"}
              >
                <p>{`BUY $${ process.env.NEXT_PUBLIC_TOKEN_SYMBOL }`}</p>
              </a>
            </div>
          </div>
        )}
        <PopUp
          isOpen={isOpen}
          openModal={openModal}
          closeModal={closeModal}
          mint={mint}
          approve={approve}
          readyToMint={readyToMint}
          isApproving={isApprovalLoading}
          isMinting={isMintLoading}
          quantity={quantity}
        ></PopUp>
      </div>
    </div>
  );
}
