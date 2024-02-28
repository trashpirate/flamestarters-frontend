import {getDefaultWallets} from "@rainbow-me/rainbowkit";
import {configureChains, createConfig} from "wagmi";
import {bscTestnet, bsc} from "wagmi/chains";
import {publicProvider} from "wagmi/providers/public";
import {jsonRpcProvider} from '@wagmi/core/providers/jsonRpc';

export default function getWagmiConfig(useTest: string) {
  if (useTest == "true") {
    const {chains, publicClient} = configureChains(
      [bscTestnet],
      [
        jsonRpcProvider({
          rpc: (chain) => ({
            http: `${ process.env.NEXT_PUBLIC_RPC_TESTNET }`,
          }),
        }),
        publicProvider(),
      ],
    );

    const {connectors} = getDefaultWallets({
      appName: process.env.NEXT_PUBLIC_PROJECT_NAME as string,
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
      chains,
    });

    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    });

    return {config: wagmiConfig, chains: chains};
  } else {
    const {chains, publicClient} = configureChains(
      [bsc],
      [
        jsonRpcProvider({
          rpc: (chain) => ({
            http: `${ process.env.NEXT_PUBLIC_RPC_MAINNET }`,
          }),
        }),
        publicProvider(),
      ],
    );

    const {connectors} = getDefaultWallets({
      appName: process.env.NEXT_PUBLIC_PROJECT_NAME as string,
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
      chains,
    });

    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    });

    return {config: wagmiConfig, chains: chains};
  }
}
