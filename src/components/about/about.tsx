import Image from "next/image";

type Props = {};

export default function About({}: Props) {
  return (
    <div className="mx-auto h-full w-full rounded-md p-1 bg-gradient-to-b from-primary to-secondary my-3 text-primary">
      <div className="h-full mx-auto max-w-sm rounded-md bg-black px-8 pt-4 pb-8 md:max-w-none">

        <Image
          src="/flamestarters_header.jpg"
          width={250}
          height={250}
          alt="Flameling NFTs"
          style={{
            width: "100%",
            height: "auto",
          }}
          priority
        />
        <div className="text-sm font-thin text-secondary">
          <p className="py-2">An OG collection of 177 AI-generated, human-curated themed NFTs. These instruments of fire are not just great to look at, but will earn holders a share of the Fire Pit's asset growth.</p>
          <p className="py-2">User your NFT to get rewarded in an upcoming exclusive 0x177 staking pool. Earn huge staking bonuses for rare and legendary NFTs.</p>
          <p className="py-2">The FlameStarters are just the beginning of your EARNing journey with 0x177!</p>

        </div>


      </div>
    </div>
  );
}
