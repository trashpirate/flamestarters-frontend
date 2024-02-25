import Image from "next/image";

type Props = {};

export default function About({}: Props) {
  return (
    <div className="mx-auto w-full rounded-md p-1 bg-gradient-to-b from-primary to-secondary my-3 text-primary">
      <div className="mx-auto max-w-sm rounded-md bg-black p-8 md:max-w-none">
        <h2 className="mb-4 border-b-2 border-primary pb-2 text-xl uppercase">
          About The FlameStarters
        </h2>
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
        <p className="text-sm font-thin text-secondary py-3">
          {process.env.NEXT_PUBLIC_PROJECT_DESCRIPTION}
        </p>

      </div>
    </div>
  );
}
