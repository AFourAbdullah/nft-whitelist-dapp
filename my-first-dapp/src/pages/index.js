import Image from "next/image";
import { Inter } from "next/font/google";
import { useRef, useState } from "react";
import { Contract, providers } from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../../constants";
import Head from "next/head";
import styles from "../styles/home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [WalletConnected, setWalletConnected] = useState(false);
  const [joinedWhiteList, setjoinedWhiteList] = useState(false);
  const [loading, setloading] = useState(false);
  const [numOfWhitelised, setnumOfWhitelised] = useState(0);
  const web3ModalRef = useRef();
  const getProviderOrSigner = async (getSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3provider = new providers.Web3Provider(provider);
    const { chainId } = await web3provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }
    if (needSigner) {
      const signer = web3provider.getSigner();
      return signer;
    }
    return web3provider;
  };
  const addToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await whitelistContract.addAddressToWhiteList();
      setloading(true);
      await tx.wait();
      setloading(false);
      await getNumberOfWhiteListed();
      setjoinedWhiteList(true);
    } catch (error) {}
  };
  const getNumberOfWhiteListed = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const _numOfWhiteListed =
        await whitelistContract.numOfAddressesWhitelisted();
      setnumOfWhitelised(_numOfWhiteListed);
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const address = await signer.getAddress();
      const _joinedList = await whitelistContract.whiteListedAddress(address);
      setjoinedWhiteList(_joinedList);
    } catch (error) {
      console.log(error);
    }
  };
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressInWhitelist();
      getNumberOfWhiteListed();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
