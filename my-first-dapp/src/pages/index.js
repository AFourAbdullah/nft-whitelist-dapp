import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { Contract, providers } from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../../constants";
import Head from "next/head";
import styles from "../styles/home.module.css";
import Web3Modal from "web3modal";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [WalletConnected, setWalletConnected] = useState(false);
  const [joinedWhiteList, setjoinedWhiteList] = useState(false);
  const [loading, setloading] = useState(false);
  const [numOfWhitelised, setnumOfWhitelised] = useState(0);
  const web3ModalRef = useRef();
  const getProviderOrSigner = async (needSigner = false) => {
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
        provider
      );
      const _numOfWhiteListed =
        await whitelistContract.numAddressesWhitelisted();
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
  const renderButton = () => {
    if (WalletConnected) {
      if (joinedWhiteList) {
        return;
        <div className={styles.description}>
          Thanks for joining the Whitelist!
        </div>;
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      <button onClick={connectWallet} className={styles.button}>
        Connect Wallet
      </button>;
    }
  };
  useEffect(() => {
    if (!WalletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [WalletConnected]);
  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            {/* Using HTML Entities for the apostrophe */}
            It&#39;s an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numOfWhitelised} has already joined the whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./cryptodevs.svg" />
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}
