import React, {useState} from "react";

type Props = {
  setMintQuantity: any;
  getMintQuantity: any;
  batchLimit: number | undefined;
  totalSupply: number | undefined;
};

const MAX_SUPPLY = 177;

export default function MintInputPanel({
  setMintQuantity,
  getMintQuantity,
  batchLimit,
  totalSupply
}: Props) {
  const remaining = MAX_SUPPLY - 1 - Number(totalSupply);
  const validBatchLimit = batchLimit ? batchLimit : 5;
  const maxMint = remaining < validBatchLimit ? remaining : validBatchLimit;
  return (
    <div className="my-4 justify-center text-center  text-secondary">
      <form>
        <label>
          Enter Number of NFTs:
          <input
            className="mx-auto ml-3 rounded bg-inputBackground p-1 text-center"
            type="number"
            value={getMintQuantity()}
            max={maxMint}
            min="1"
            placeholder="1"
            onChange={(e) => {
              setMintQuantity(e.target.value);
            }}
          />
        </label>
      </form>
    </div>
  );
}
