import React, { useEffect, useState } from "react";
import Header from "../Components/Staking/Header";
import CardList from "../Components/Staking/CardList";
import Pagination from "../Components/Staking/Pagination";
import {
  nft_contract_abi,
  nft_contract_address,
  staking_contract_abi,
  staking_contract_address,
  chain_id,
  speedy_nodes,
} from "../config";
import Web3 from "web3";
import { toast } from "react-toastify";

// import { ethers } from "ethers";
const Staking = ({ setLoggedin }) => {
  const [isWalletConnected, setisWalletConnected] = useState(false);
  const [web3Global, setWeb3Global] = useState();
  const [connectedAddress, setConnectedAddress] = useState("");
  const [tokensEarned, setTokenEarned] = useState(0);
  const [total_UnStakedNftsByUser, settotal_UnStakedNftsByUser] = useState(0);
  const [rewardsPerDay, setRewardsPerDay] = useState(0);
  const [shortenAddress, setShortenAddress] = useState("");
  const [IdsofUnstakedNfts, setIdsofUnstakedNfts] = useState([]); // List of unstaked nft ids
  const [Idsof_StakedNfts, setIdsof_StakedNfts] = useState([]); // List of staked nft ids
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [nftListinWallet, setNftListInWallet] = useState([]); //List of all nfts, Staked and Unstaked both

  let list_of_1to1s = [
    60, 117, 137, 253, 351, 508, 558, 571, 587, 613, 711, 773, 826, 891, 941,
    945, 972, 990, 996, 1000, 1107, 1227, 1285, 1334, 1430, 4659, 1960, 2083,
    2353, 2753, 2754, 2862, 2928, 3382, 3545, 3612, 4231, 4496, 5196, 5433,
  ];

  useEffect(() => {
    connectWallet();
  }, []);

  async function getImageHash(hashVal) {
    try {
      //console.log("Here getImageHashval : ", hashVal);
      let response = await fetch(hashVal);
      //console.log("Here getImageHash :", response);
      let responseJson = await response.json();
      return responseJson.image;
    } catch (error) {
      console.error(error);
    }
  }
  function is_1to1(num) {
    for (let i = 0; i < list_of_1to1s.length; i++) {
      if (list_of_1to1s[i] == num) {
        return true;
      }
    }
    return false;
  }

  async function fetch_Data_After_Wallet_Connect(connectedAddress) {
    //connectedAddress = "0x227b7e69740d86bd11f256c19bc2d39a3f3324c9";
    setisLoading(true);
    const web3Global = new Web3(window.ethereum);
    // console.log(nft_contract_abi.result)

    const nft_contract = new web3Global.eth.Contract(
      nft_contract_abi,
      nft_contract_address
    );

    let isApproved1 = await nft_contract.methods
      .isApprovedForAll(connectedAddress, staking_contract_address)
      .call();
    console.log("isApproved1: " + isApproved1);

    let list_of_unstaked_ids = await nft_contract.methods
      .tokensOfOwner(connectedAddress)
      .call();
    console.log("list_of_unstaked_ids: " + list_of_unstaked_ids);

    const staking_contract = new web3Global.eth.Contract(
      staking_contract_abi,
      staking_contract_address
    );

    let rewardsEarned = await staking_contract.methods
      .viewRewards(connectedAddress)
      .call();
    setTokenEarned(
      parseFloat(web3Global.utils.fromWei(rewardsEarned, "ether")).toFixed(4)
    );

    // staking_contract.methods.totalNftStaked().call((err,result) => {
    //   console.log("error: "+err);
    //   if(result != null){
    //     setTotalWOCStaked(parseInt(result))
    //   }
    // });
    // let nftStakedByUser = await staking_contract.methods.numberTokensStaked(connectedAddress).call();
    // settotalStakedNftsByUser(parseInt(nftStakedByUser));

    // console.log("connectedAddress: "+connectedAddress)
    let rewardsPerDay = await staking_contract.methods
      .rewardsPerDay(connectedAddress)
      .call();
    setRewardsPerDay(
      web3Global.utils.fromWei(rewardsPerDay.toString(), "ether")
    );
    // console.log("rewardsPerDay: "+rewardsPerDay)
    // console.log("web3Global.utils.fromWei(rewardsPerDay.toString() , 'ether'): "+web3Global.utils.fromWei(rewardsPerDay.toString() , 'ether'))

    let isApproved = await nft_contract.methods
      .isApprovedForAll(connectedAddress, staking_contract_address)
      .call();
    if (isApproved.toString() == "true") {
      setIsApproved(true);
    } else {
      setIsApproved(false);
    }

    let temp_all_data = [];
    // let list_of_unstaked_ids = await nft_contract.methods.tokensOfOwner(connectedAddress).call();
    let list_of_staked_ids = await staking_contract.methods
      .getUserstakedNftIds(connectedAddress)
      .call();
    if (list_of_staked_ids != null) {
      let temp_Idsof_stakedNfts = [];
      console.log("User Staked Ids: " + list_of_staked_ids);
      for (let i = 0; i < list_of_staked_ids.length; i++) {
        let single_data = list_of_staked_ids[i];
        let hashLink =
          "https://ipfs.io/ipfs/bafybeigqhtnjv2izzv77cicficpj3v5uquxs6jv5jgyjcnzvpdkgzeburi/" +
          single_data +
          ".json";
        let temp_img = await getImageHash(hashLink);
        //let temp_img = images_ipfs_link + single_data + ".png";

        let resulting_json = {};
        if (is_1to1(parseInt(single_data))) {
          resulting_json = {
            img: temp_img,
            number: parseInt(single_data),
            staked: true,
            price: 1000,
          };
        } else {
          resulting_json = {
            img: temp_img,
            number: parseInt(single_data),
            staked: true,
            price: 240,
          };
        }
        temp_all_data.push(resulting_json);
        temp_Idsof_stakedNfts.push(parseInt(single_data));
        console.log("resulting_json: " + resulting_json.img);
      }

      //console.log("temp_all_data: "+JSON.stringify(temp_all_data));
      setNftListInWallet(temp_all_data);
      setIdsof_StakedNfts(temp_Idsof_stakedNfts);
    }
    if (list_of_unstaked_ids != null) {
      let temp_IdsofUnstakedNfts = [];
      console.log("Unskaed Nft Ids: " + list_of_unstaked_ids);
      setIdsofUnstakedNfts(list_of_unstaked_ids);
      settotal_UnStakedNftsByUser(list_of_unstaked_ids.length);
      for (let i = 0; i < list_of_unstaked_ids.length; i++) {
        let single_data = list_of_unstaked_ids[i];
        let hashLink =
          "https://ipfs.io/ipfs/bafybeigqhtnjv2izzv77cicficpj3v5uquxs6jv5jgyjcnzvpdkgzeburi/" +
          single_data +
          ".json";
        let temp_img = await getImageHash(hashLink);
        //console.log("TempIMg: "+temp_img)
        //let temp_img = images_ipfs_link + single_data + ".png";
        let resulting_json = {};
        if (is_1to1(parseInt(single_data))) {
          resulting_json = {
            img: temp_img,
            number: parseInt(single_data),
            staked: false,
            price: 1000,
          };
        } else {
          resulting_json = {
            img: temp_img,
            number: parseInt(single_data),
            staked: false,
            price: 240,
          };
        }

        temp_all_data.push(resulting_json);
        temp_IdsofUnstakedNfts.push(parseInt(single_data));
        // console.log("resulting_json: "+resulting_json.img)
      }

      // console.log("temp_all_data: "+temp_all_data);
      // setNftListInWallet(temp_all_data)
      // if(temp_all_data.length > 0){
      //   setSeeCollection(!seeCollection)
      // }
    }

    setisLoading(false);
    if (temp_all_data.length > 0) {
      //setSeeCollection(true)
    }
  }
  const getProvider = () => {
    if ("ethereum" in window) {
      const anyWindow = window;
      const provider = anyWindow.ethereum;

      if (provider?.isPhantom) {
        return provider;
      }
    }

    window.open("https://phantom.app/", "_blank");
  };
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Connect using Web3 provider
        const web3 = new Web3(window.ethereum);

        const addresses = await web3.eth.getAccounts();
        let address = addresses[0];
        console.log("Connected accounts: " + address);
        if (address == undefined) {
          // window.location.href = '/'
          setLoggedin(false);
          return;
          // await window.ethereum.enable();
        }

        // Create an ethers provider from the Web3 provider
        const provider = web3.eth.currentProvider;
        console.log(Object.getOwnPropertyNames(provider));

        provider.on("accountsChanged", (accounts) => {
          console.log(accounts);
          window.location.reload();
        });

        // Subscribe to chainId change
        provider.on("chainChanged", (chainId) => {
          console.log(chainId);
          // window.location.reload();
        });

        // Subscribe to provider connection
        provider.on("connect", (info) => {
          console.log(info);
          // window.location.reload();
        });

        // Subscribe to provider disconnection
        provider.on("disconnect", (error) => {
          console.log(error);
          window.location.href = "/";
          // window.location.reload();
        });
        // Get the signer (account) from the provider
        // const signer = provider.getSigner();
        // let temp = await  web3.eth.net.getId();
        //console.log("Network id: "+Object.getOwnPropertyNames(web3.eth))

        if (provider.isMetamask) {
          web3.eth.net.getId().then((result) => {
            console.log("Network id: " + result);
            if (parseInt(result) != parseInt(chain_id)) {
              //result !== 1
              //alert("Wrong Network Selected. Select Goerli Test Network and Refresh Page");
              try {
                window.ethereum.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: web3.utils.toHex(chain_id) }],
                });
              } catch (e) {
                alert(
                  "Error in Switching Chain, Make Sure you have added Polygon chain in your web3 wallet."
                );
                window.location.reload();
              }
            }
          });
        } else {
          console.log("Not Metamask");
          try {
            window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: web3.utils.toHex(chain_id) }],
            });
          } catch (e) {
            alert(
              "Error in Switching Chain, Make Sure you have added Polygon chain in your web3 wallet."
            );
            window.location.reload();
          }
        }
        // console.log("Network id: "+await web3.eth.getChainId())
        setisWalletConnected(true);
        setConnectedAddress(address.toString());
        setShortenAddress(
          address.toString().slice(0, 4) +
            "..." +
            address.slice(address.length - 3, address.length)
        );

        await fetch_Data_After_Wallet_Connect(address.toString());
        return;

        web3.eth.net.getId().then((result) => {
          console.log("Network id: " + result);
          if (parseInt(result) != parseInt(chain_id)) {
            //result !== 1
            //alert("Wrong Network Selected. Select Goerli Test Network and Refresh Page");
            try {
              window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: web3.utils.toHex(chain_id) }],
              });
            } catch (e) {
              alert(
                "Error in Switching Chain, Make Sure you have added Polygon chain in your web3 wallet."
              );
              window.location.reload();
            }
          } else {
            // let address = address1.toString()
            // Set User account into state
            //console.log("Connected address: "+address)

            setisWalletConnected(true);
            setConnectedAddress(address.toString());
            setShortenAddress(
              address.toString().slice(0, 4) +
                "..." +
                address.slice(address.length - 3, address.length)
            );

            fetch_Data_After_Wallet_Connect(address.toString());
          }
        });
        // Return the signer object
        //return signer;
      } catch (error) {
        console.log(error);
        //alert('Error connecting to wallet', error);
        //return null;
      }
    } else {
      toast.error("Wallet Not Found.");
      // alert("Web3 Not Found. Try refreshing if you have metamask installed.");
      //return null;
    }
  };
  async function fetchdata() {
    const web3 = new Web3(speedy_nodes);
    // setWeb3Global(web3);
    const contract = new web3.eth.Contract(
      staking_contract_abi,
      staking_contract_address
    );
    //let data =  contract.methods.balanceOf("0x850fc869b4cbe3ed1d125ba0e9f3af8c6ceb749c").call();
    let returned_data = {};
    console.log("RewardsPerDAy");
    let test = await contract.methods
      .rewardsPerDay("0xcb55A7a1c0C46ac6a07D62d196AcdBC46cE6A630")
      .call();
    console.log("RewardsPerDAy= " + test);
    let viewRewards = await contract.methods
      .viewRewards("0xcb55A7a1c0C46ac6a07D62d196AcdBC46cE6A630")
      .call();
    console.log("viewRewards= " + viewRewards);
  }

  console.log("nftListinWallet", nftListinWallet);

  const [nftListinWallet1, setnftListinWallet1] = useState();

  useEffect(() => {
    setnftListinWallet1(nftListinWallet);
  }, [nftListinWallet]);

  const sortbyTrue = async () => {
    const sortedData = [...nftListinWallet].sort((a, b) => {
      if (a.staked && !b.staked) {
        return -1;
      }
      if (!a.staked && b.staked) {
        return 1;
      }
      return 0;
    });
    setnftListinWallet1(sortedData);
  };

  const sortByFalse = async () => {
    const sortedData = [...nftListinWallet].sort((a, b) => {
      if (!a.staked && b.staked) {
        return -1;
      }
      if (a.staked && !b.staked) {
        return 1;
      }
      return 0;
    });
    setnftListinWallet1(sortedData);
  };

  const sortDefault = async () => {
    setnftListinWallet1(nftListinWallet);
  };

  const sortByPriceHighToLow = () => {
    const sortedData = [...nftListinWallet].sort((a, b) => b.price - a.price);
    setnftListinWallet1(sortedData);
  };

  const sortByPriceLowToHigh = () => {
    const sortedData = [...nftListinWallet].sort((a, b) => a.price - b.price);
    setnftListinWallet1(sortedData);
  };

  return (
    <>
      <div className="min-h-screen py-24 flex flex-col gap-4  bg-[#F3FCFF]">
        <Header
          setLoggedin={setLoggedin}
          sortByPriceHighToLow={sortByPriceHighToLow}
          sortByPriceLowToHigh={sortByPriceLowToHigh}
          sortbyTrue={sortbyTrue}
          sortByFalse={sortByFalse}
          sortDefault={sortDefault}
          IdsofUnstakedNfts={IdsofUnstakedNfts}
          Idsof_StakedNfts={Idsof_StakedNfts}
          connectedAddress={connectedAddress.toString()}
          tokensEarned={tokensEarned.toString()}
          rewardsPerDay={rewardsPerDay.toString()}
          shortenAddress={shortenAddress.toString()}
          isApproved={isApproved}
        />

        <CardList
          nftList={JSON.stringify(nftListinWallet1)}
          connectedAddress={connectedAddress.toString()}
        />
        {/* <Pagination /> */}
      </div>
    </>
  );
  // master hameed aik so ananja young mounda gate dy samny
};
export default Staking;
