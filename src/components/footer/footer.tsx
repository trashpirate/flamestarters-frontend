import Image from "next/image";
import Link from "next/link";

type Props = {};

export default function Footer({}: Props) {
    return (<footer className="text-secondary text-center my-6 text-opacity-40">
        <div>
            Created by <Link className="font-bold" href="https://twitter.com/CreativeCuse">@CreativeCuse</Link> & <Link className="font-bold" href="https://twitter.com/N0_crypto">@N0_crypto</Link>
        </div>

    </footer>);
}