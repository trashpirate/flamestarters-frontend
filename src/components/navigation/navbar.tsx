import Image from "next/image";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="mx-auto my-3 flex justify-between gap-5 align-middle md:w-full">
      <div className="my-auto h-fit w-fit flex-row rounded-xl border-2 border-black bg-button font-bold text-black hover:bg-buttonHover sm:w-36 sm:justify-between">
        <a
          className="pointer-events-auto mx-auto flex items-center text-right align-middle text-lg uppercase sm:gap-4 lg:p-0"
          href="https://buyholdearn.com"
          rel="noopener noreferrer"
        >
          <Image
            src="/logo.jpg"
            alt="EARN logo"
            className="ml-0 h-10 w-auto overflow-hidden rounded-xl p-1"
            width={40}
            height={40}
            priority
          />
          <div className="w-0 scale-0 sm:w-fit sm:scale-100">Home</div>
        </a>
      </div>
      <div className="my-auto h-fit w-fit flex-row rounded-xl border-2 border-black bg-button font-bold text-black hover:bg-buttonHover sm:w-44 sm:justify-between">
        <a
          className="pointer-events-auto mx-auto flex h-10 items-center align-middle text-lg uppercase sm:gap-1 sm:text-center lg:p-0 "
          href="https://www.rareboard.com/"
          rel="noopener noreferrer"
        >
          <Image
            src="/rareboard.jpg"
            alt="Opeansea logo"
            className="mx-1 h-8 w-auto overflow-hidden rounded-full"
            width={40}
            height={40}
            priority
          />
          <div className="w-0 scale-0 justify-self-center sm:w-fit sm:scale-100">
            RAREBOARD
          </div>
        </a>
      </div>

      <div className="my-auto h-fit w-fit flex-row rounded-xl border-2 border-black bg-button font-bold text-black hover:bg-buttonHover sm:w-44 sm:justify-between">
        <a
          className="pointer-events-auto mx-auto flex h-10 items-center align-middle text-lg uppercase sm:gap-1 sm:text-center lg:p-0 "
          href={`https://pancakeswap.finance/swap?chain=bsc&outputCurrency=${ process.env.NEXT_PUBLIC_TOKEN_CONTRACT }`}
          rel="noopener noreferrer"
        >
          <Image
            src="/pancakeswap.png"
            alt="Pancakeswap logo"
            className="mx-1 h-8 w-auto overflow-hidden rounded-xl"
            width={40}
            height={40}
            priority
          />
          <div className="w-0 scale-0 sm:w-fit sm:scale-100">BUY $0X177</div>
        </a>
      </div>
    </nav>
  );
}
