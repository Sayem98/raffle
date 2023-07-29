import React, { useState } from "react";
import CountUp from "react-countup";
import Button from "@mui/material/Button";
import Web3 from "web3";
import {
  chain_id,
  nft_contract_abi,
  nft_contract_address,
  speedy_nodes,
  staking_contract_abi,
  staking_contract_address,
} from "../../config";
import { ethers } from "ethers";
import { withRouter } from "react-router-dom";
import Modal from "@mui/material/Modal";

import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

const Banner = ({setLoggedin}) => {
  const [totalPercentage, settotalPercentage] = useState(0);
  const [approveRequired, setApproveRequired] = useState(false);
  const [connectedAddress, setconnectedAddress] = useState("");

  const getProvider = () => {
    if ('ethereum' in window) {
      const anyWindow = window;
      const provider = anyWindow.ethereum;
     
      if (provider?.isPhantom) {
        return provider;
      }
    }
  
    window.open('https://phantom.app/', '_blank');
  };
  const connectWallet = async () => {
    handleOpen();
    if (window.ethereum) {
      try {
        // Connect using Web3 provider
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        // Create an ethers provider from the Web3 provider
        const provider = web3.eth.currentProvider;
        provider.on("accountsChanged", (accounts) => {
          console.log(accounts);
          window.location.reload();
        });

        // Subscribe to chainId change
        provider.on("chainChanged", (chainId) => {
          console.log(chainId);
          window.location.reload();
        });

        // Subscribe to provider connection
        provider.on("connect", (info) => {
          console.log(info);
          //window.location.reload();
        });

        // Subscribe to provider disconnection
        provider.on("disconnect", (error) => {
          console.log(error);
          //window.location.reload();
        });
        // Get the signer (account) from the provider
        // const signer = provider.getSigner();
        if(provider.isMetamask){
          web3.eth.net.getId().then((result) => { 
      
            console.log("Network id: "+result)
            if(parseInt(result) != parseInt(chain_id)){ //result !== 1
                //alert("Wrong Network Selected. Select Goerli Test Network and Refresh Page");
                try{
                  window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: web3.utils.toHex(chain_id) }]
                  });
                }catch(e){
                 // alert("Error in Switching Chain, Make Sure you have added Polygon chain in your web3 wallet.");
                  toast.error("Error in Switching Chain, Make Sure you have added Polygon chain in your web3 wallet.");
                  window.location.reload();
                }
              }
            });
  
        }else{
          console.log("Not Metamask")
        }

          let accounts = await web3.eth.getAccounts();
          console.log(accounts[0]);
          setconnectedAddress(accounts[0]);
          await check_approve_required(accounts[0]);

          //Take to next page
          setLoggedin(true);
          // window.location.href = "/staking";
        
        // web3.eth.net.getId().then((result) => {

        //   })
        // Return the signer object
        //return signer;
        handleClose();
      } catch (error) {
        console.log("Error: "+error);
        toast.error("Error connecting to wallet");
        // alert("Error connecting to wallet:", error);
        //return null;
        handleClose();
      }
    } else {
      handleClose();
      toast.error("Wallet Not Found.");
      // alert("Web3 Not Found. Try refreshing if you have metamask installed.");
      //return null;
    }
  };
  async function approvenfts(connectedAddress) {
    const web3Global = new Web3(window.ethereum);
    const contract = new web3Global.eth.Contract(
      nft_contract_abi,
      nft_contract_address
    );
    try {
      //setisLoading(true);
      const estemated_Gas = await contract.methods
        .setApprovalForAll(staking_contract_address, true)
        .estimateGas({
          from: connectedAddress,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null,
        });
      console.log(estemated_Gas);
      const result = await contract.methods
        .setApprovalForAll(staking_contract_address, true)
        .send({
          from: connectedAddress,
          gas: estemated_Gas,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null,
        });
      toast.success("Success.");
      alert("Success");
      window.location.reload();
    } catch (e) {
      // setisLoading(false);
      show_error_alert(e);
    }
  }
  const check_approve_required = async (connectedAddress) => {
    const web3Global = new Web3(speedy_nodes);
    const nft_contract = new web3Global.eth.Contract(
      nft_contract_abi,
      nft_contract_address
    );
    let isApproved1 = await nft_contract.methods
      .isApprovedForAll(connectedAddress, staking_contract_address)
      .call();

    setApproveRequired(isApproved1);
  };

  const fetch_data = async () => {
    const web3Global = new Web3(speedy_nodes);
    const staking_contract = new web3Global.eth.Contract(
      staking_contract_abi,
      staking_contract_address
    );
    let totalStaked = await staking_contract.methods.totalNftStaked().call();
    let x = ((100 * totalStaked) / 5555).toFixed(2);
    settotalPercentage(x);
  };
  async function show_error_alert(error) {
    let temp_error = error.message.toString();
    console.log(error);
    let error_list = [
      "Not Started Yet!",
      "Contract doesnot have enough reward Tokens.",
      "Approve Nfts First",
      "0 Nfts to Stake",
      "INVALID_ETH",
      "The caller is another contract",
      "You donot have enough Crumbos.",
      "Select atleast 1 Nft to burn",
      "Add Crumbos Id",
      "Presale have not started yet.",
      "Presale Ended.",
      "Invalid Arguments",
      "Approve CRUMBOS Nfts",
      "Sent Amount Not Enough",
      "Approve CRUMBOS Nfts",
      "insufficient funds",
      "Exceeding Per Tx Limit",
      "mint at least one token",
      "incorrect ether amount",
      "Presale Ended.",
      "Sale is Paused.",
      "Approve Phase 2 Nfts",
      "Approve Phase 1 Nfts",
      "Max Supply Reached.",
      "Public sale is not started",
      "Needs to send more eth",
      "Public Sale Not Started Yet!",
      "Exceed max adoption amount",
      "Private Sale Not Started Yet!",
      "Exceed max minting amount",
    ];

    for (let i = 0; i < error_list.length; i++) {
      if (temp_error.includes(error_list[i])) {
        // set ("Transcation Failed")
        toast.error(error_list[i])
        // alert(error_list[i]);
      }
    }
  }
  fetch_data();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="py-10">
        <img
          src="/l1.png"
          alt="logo"
          className="w-60 h-60 mx-auto capitalize"
        />
        <h1 className="text-center text-white lg:text-6xl md:text-5xl text-4xl font-[400]">
          FADA REDEMPTION SYSTEM
        </h1>
        <h2 className="text-center  lg:text-3xl md:text-2xl text-xl font-semibold text-white mt-3">
          Stake your Faydens to earn points
        </h2>

        <div className="flex justify-center mt-5 lg:mt-10">
          <Button
            onClick={connectWallet}
            variant="contained"
            className="lg:text-2xl md:text-xl text-lg rounded-full capitalize bg-primary px-5 lg:px-10 py-3 "
          >
            Connect Wallet
          </Button>
        </div>

        <div className="grid gap-5 grid-cols-1 mt-10 py-5">
          <div className="">
            <p className="text-center text-white lg:text-2xl md:text-lg text-lg ">
              Faydens staked
            </p>

            <CountUp
              start={0}
              end={totalPercentage}
              delay={0}
              decimals={2}
              duration={6}
            >
              {({ countUpRef }) => (
                <div className="flex justify-center lg:text-5xl md:text-3xl text-2xl mt-2 text-white">
                  <span className="" ref={countUpRef} />%
                </div>
              )}
            </CountUp>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute top-0 bg-black/90 left-0 h-screen w-screen flex justify-center items-center">
          <div className="flex flex-col justify-center text-white font-bold items-center gap-2">
            <CircularProgress />
            <p>Connecting Wallet</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Banner;
