"use client";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {useContractRead, useNetwork} from "wagmi";
import {nftABI} from "@/assets/nftABI";
const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${ string }`;
const COLLECTION_NAME = "The FlameStarters";
type Props = {};

export default function CollectionInfo({}: Props) {
  const [totalSupply, setTotalSupply] = useState<number | undefined>(undefined);

  // get chain
  const {chain} = useNetwork();

  // define token contract config
  const nftContract = {
    address: NFT_CONTRACT,
    abi: nftABI,
    chainId: chain?.id,
  };

  // read current limits
  const {data, isSuccess, isError, isLoading} = useContractRead({
    ...nftContract,
    functionName: "totalSupply",
    watch: true,
    cacheTime: 1000,
  });

  useEffect(() => {
    if (data != undefined) {
      setTotalSupply(Number(data));
    }
  }, [data]);

  function getTotalSupplyString() {
    let text: string = "---";
    if (isLoading) {
      text = "Loading...";
    } else if (isSuccess && totalSupply != undefined) {
      text = `${ (totalSupply).toLocaleString() }`;
    } else {
      text = "---";
    }
    return text;
  }

  function getNftsRemainingString() {
    let text: string = "---";
    if (isLoading) {
      text = "Loading...";
    } else if (isSuccess && totalSupply != undefined) {
      text = `${ (177 - totalSupply).toLocaleString() }`;
    } else {
      text = "---";
    }
    return text;
  }

  return (
    <div className="mx-auto w-full rounded-md p-1 bg-gradient-to-b from-primary to-secondary my-3">
      <div className="mx-auto max-w-sm rounded-md  p-8 bg-black  md:max-w-none">
        <h2 className="mb-4 border-b-2 border-primary pb-2 text-xl uppercase text-primary">
          {COLLECTION_NAME}
        </h2>

        <div className="py-4 text-sm text-secondary">
          <p>Contract:</p>

          <a
            href={`${ process.env.NEXT_PUBLIC_NETWORK_SCAN }/address/${ NFT_CONTRACT }#code`}
          >
            <div className="mt-1 overflow-hidden text-ellipsis text-xs text-opacity-60 hover:text-hover">
              {NFT_CONTRACT}
            </div>
          </a>
        </div>
        <div className="pb-4 text-xs text-secondary">
          <table className="w-full table-fixed text-left">
            <thead>
              <tr className="text-sm">
                <th>TRAITS</th>
                <th>RARITY</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>COMMON</td>
                <td>42 %</td>
              </tr>
              <tr>
                <td>UNCOMMON</td>
                <td>38 %</td>
              </tr>
              <tr>
                <td>RARE</td>
                <td>16 %</td>

              </tr>
              <tr>
                <td>LEGENDARY</td>
                <td>4 %</td>
              </tr>

            </tbody>
          </table>
        </div>
        <div className="flex justify-between w-48 text-secondary">
          <h3>NFTs minted: </h3>
          <p>{getTotalSupplyString()}</p>
        </div>
        <div className="flex justify-between w-48 text-secondary">
          <h3>NFTs remaining: </h3>
          <p>{getNftsRemainingString()}</p>
        </div>

      </div>
    </div>
  );
}
