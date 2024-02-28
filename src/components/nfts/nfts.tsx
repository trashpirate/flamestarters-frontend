"use client";
import React, {useEffect, useState} from "react";
import {useAccount, useContractReads, useNetwork} from "wagmi";
import {readContracts} from '@wagmi/core';
import {nftABI} from "@/assets/nftABI";
import Image from "next/image";
import Link from "next/link";
import {toHex} from "viem";
import {readContract} from "wagmi/actions";
import getWagmiConfig from "@/app/config";

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${ string }`;
const myWagmiConfig = getWagmiConfig(
  process.env.NEXT_PUBLIC_TESTNET as string,
);

interface NFTMeta {
  name: string;
  path: string;
  id: number;
}

type Props = {};

export default function Nfts({}: Props) {
  const [maxPerWallet, setMaxPerWallet] = useState<number | undefined>(
    undefined,
  );
  const [nftBalance, setNftBalance] = useState<number | undefined>(undefined);
  const [nftsOwned, setNftsOwned] = useState<NFTMeta[] | undefined>(undefined);

  // get account address
  const {address, isConnecting, isDisconnected, isConnected} = useAccount({});

  // get chain
  const {chain} = useNetwork();

  // define token contract config
  const nftContract = {
    address: NFT_CONTRACT,
    abi: nftABI,
    chainId: chain?.id,
  };

  const {data, isSuccess, refetch} = useContractReads({
    contracts: [
      {
        ...nftContract,
        functionName: "getMaxPerWallet",
      },
      {
        ...nftContract,
        functionName: "balanceOf",
        args: [address as `0x${ string }`],
      },
    ],
    enabled: isConnected && address != null,
    watch: true,
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data != undefined) {
      setMaxPerWallet(Number(data[0].result));
      setNftBalance(Number(data[1].result));
    }
  }, [data, isSuccess]);

  async function getNFT() {
    // console.log('fetching');
    const result = await readContract({
      ...nftContract,
      functionName: 'totalSupply'
    });
    const totalSupply = Number(result);

    let numOfNfts: number;
    if (nftBalance === undefined) {
      const result = await readContract({
        ...nftContract,
        functionName: 'balanceOf',
        args: [address as `0x${ string }`]
      });
      numOfNfts = Number(result);
    }
    else {
      numOfNfts = nftBalance;
    }

    let nftArray: NFTMeta[] = [];
    let counter: number = totalSupply;
    while (nftArray.length < 5 && counter > 0 && (totalSupply - counter) < numOfNfts) {
      const owner = await readContract({
        ...nftContract,
        functionName: 'ownerOf',
        args: [BigInt(counter.toString())]
      });
      if (owner == address) {
        const res = await fetch(`https://ipfs.io/ipfs/bafybeid2becus7ppm3nmpgzldkqeegs3hetpjqn7i32ko3eu3imct3ooi4/${ (counter).toString() }`);
        const json = await res.json();
        const [prefix, separator, url, trait, name] = json.image.split("/");
        const imageURL = `https://ipfs.io/ipfs/bafybeihmnzln7owlnyo7s6cjtca66d35s3bl522yfx5tjnn3j7z6ol4aiy/${ trait }/${ name }`;
        let iNft: NFTMeta = {
          name: `#${ counter.toString() }`,
          id: counter,
          path: imageURL,
        };
        nftArray.push(iNft);
      }
      counter--;
    }

    if (nftArray.length < 5) {
      for (let i = nftArray.length; i < 5; i++) {
        let iNft: NFTMeta = {
          name: `#?`,
          id: i + 1000,
          path: "/unrevealed.jpg",
        };
        nftArray.push(iNft);
      }
    }

    setNftsOwned(nftArray);
  }

  useEffect(() => {
    if (isConnected && address !== undefined) {
      getNFT();
    }
  }, [isConnected, nftBalance, address]);

  return (
    <div className="mx-auto h-full w-full max-w-sm md:max-w-none rounded-md p-1 bg-gradient-to-b from-primary to-secondary my-3 text-primary">
      <div className="mx-auto h-full rounded-md bg-black p-8">
        <h2 className="border-b-2 border-primary text-justify text-xl uppercase">
          {`Your NFTs (Max. ${ maxPerWallet })`}
        </h2>
        <div className="my-4 min-h-max">
          <div className="grid grid-cols-2 place-content-center gap-4 sm:grid-cols-3 md:grid-cols-5 ">
            {nftsOwned != undefined &&
              nftsOwned.map(function (nft) {
                let hover: string = "";
                if (nft.id <= 1000) hover = "  hover:border-secondary";
                return (
                  <Link
                    key={nft.id}
                    href={`https://opensea.io/assets/bsc/${ NFT_CONTRACT }/${ nft.id }`}
                  >
                    <div
                      className={
                        "overflow-hidden rounded-md border-2 border-primary bg-white shadow" +
                        hover
                      }
                    >
                      {
                        <Image
                          alt={nft.name || ""}
                          src={`${ nft.path }` as string}
                          width={100}
                          height={100}
                          style={{
                            width: "100%",
                            height: "auto",
                          }}
                        />
                      }
                      <div className="m-2 text-center text-xs font-bold text-black">
                        {nft.name}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
