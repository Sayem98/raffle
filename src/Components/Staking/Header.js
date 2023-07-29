import { Button } from "@mui/material";
import React from "react";
import SelectDropdown from "../Staking/SelectDropdown";
import WalletIcon from "@mui/icons-material/Wallet";
import {
  speedy_nodes,
  staking_contract_abi,
  staking_contract_address,
  nft_contract_address,
  nft_contract_abi,
  chain_id,
} from "../../config";
import Web3 from "web3";
import { toast } from "react-toastify";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

async function stakeNft(listOfIds, connectedAddress) {

  try {
    console.log("listOfIds: " + listOfIds);
    const web3Global = new Web3(window.ethereum);
    const provider = web3Global.eth.currentProvider;
    const contract = new web3Global.eth.Contract(
      staking_contract_abi,
      staking_contract_address
    );
    // setisLoading(true);
    let estemated_Gas = await contract.methods
      .stakeNfts(listOfIds)
      .estimateGas({
        from: connectedAddress,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      });
      estemated_Gas = estemated_Gas + estemated_Gas;
    console.log(estemated_Gas);
    if(provider.isPhantom){
      console.log("Is Phantom")
      const result = await contract.methods.stakeNfts(listOfIds).send({
        from: connectedAddress,
        gas: estemated_Gas,
        maxFeePerGas: null,
      });
    }else{
      const result = await contract.methods.stakeNfts(listOfIds).send({
        from: connectedAddress,
        gas: estemated_Gas,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      });
    }

    toast.success("Staking Success");
    // alert("Staking Success");
    window.location.reload();
    // fetch_Data_After_Wallet_Connect(connectedAddress);
    // setisLoading(false);
  } catch (e) {
    console.log(e);
    show_error_alert(e);
    // setisLoading(false);
  }
}
async function unstakeNft(listOfIds, connectedAddress) {
  const web3Global = new Web3(window.ethereum);
  const provider = web3Global.eth.currentProvider;
  const contract = new web3Global.eth.Contract(
    staking_contract_abi,
    staking_contract_address
  );
  try {
    console.log("listOfIds: " + listOfIds);
    // setisLoading(true);
    let estemated_Gas = await contract.methods
      .unstakeNfts(listOfIds)
      .estimateGas({
        from: connectedAddress,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      });
      estemated_Gas = estemated_Gas + estemated_Gas;
    console.log(estemated_Gas);
    if(provider.isPhantom){
      const result = await contract.methods.unstakeNfts(listOfIds).send({
        from: connectedAddress,
        gas: estemated_Gas,
        maxFeePerGas: null,
      });

    }else{
      const result = await contract.methods.unstakeNfts(listOfIds).send({
        from: connectedAddress,
        gas: estemated_Gas,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      });
    }


    // await fetch_Data_After_Wallet_Connect(connectedAddress);
    // setisLoading(false);
    toast.success("Success");
    // alert("Success");
    window.location.reload();
  } catch (e) {
    show_error_alert(e);
    // setisLoading(false);
  }
}
async function approvenfts(connectedAddress1) {

  try {
    // await connectWallet();
    const web3Global = new Web3(window.ethereum);
    let accounts = await web3Global.eth.getAccounts();
    console.log(accounts[0]);

    const provider = web3Global.eth.currentProvider;
    
    let connectedAddress = accounts[0].toString();

    const contract = new web3Global.eth.Contract(
      nft_contract_abi,
      nft_contract_address
    );
    //setisLoading(true);
    let estemated_Gas = await contract.methods
      .setApprovalForAll(staking_contract_address.toString(), "true")
      .estimateGas({
        from: connectedAddress,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
      });
      estemated_Gas = estemated_Gas + estemated_Gas;
    console.log(estemated_Gas);
    if(provider.isPhantom){
      const result = await contract.methods
      .setApprovalForAll(staking_contract_address.toString(), "true")
      .send({
        from: connectedAddress,
        gas: estemated_Gas,
        // maxPriorityFeePerGas: null,
        maxFeePerGas: null
      });
    }else{
      const result = await contract.methods
      .setApprovalForAll(staking_contract_address.toString(), "true")
      .send({
        from: connectedAddress,
        gas: estemated_Gas,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
      });
    }

    toast.success("Success");
    // alert("Success");
    window.location.reload();
  } catch (e) {
    // setisLoading(false);
    console.log(e);
    show_error_alert(e);
  }
}
const connectWallet = async () => {
  if (window.ethereum) {
    try {
      // Connect using Web3 provider
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      // Create an ethers provider from the Web3 provider
      const provider = web3.currentProvider;
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
        window.location.reload();
      });

      // Subscribe to provider disconnection
      provider.on("disconnect", (error) => {
        console.log(error);
        window.location.reload();
      });
      // Get the signer (account) from the provider
      // const signer = provider.getSigner();

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
            toast.error(
              "Error in Switching Chain, Make Sure you have added Polygon chain in your web3 wallet."
            );
            // alert(
            //   "Error in Switching Chain, Make Sure you have added Polygon chain in your web3 wallet."
            // );
            window.location.reload();
          }
        } else {
          // setisWalletConnected(true);
          //console.log("Changing Page")
          //router.push('/staking');
          // this.props.history.push('/staking');
          //window.location.href = '/staking';
        }
      });
      // Return the signer object
      //return signer;
    } catch (error) {
      console.log(error);
      toast.error("Error connecting to wallet.");
      // alert("Error connecting to wallet:", error);
      //return null;
    }
  } else {
    toast.error("Wallet Not Found.");
    // alert("Web3 Not Found. Try refreshing if you have metamask installed.");
    //return null;
  }
};
async function show_error_alert(error) {
  let temp_error = error.message.toString();
  console.log(error);
  let error_list = [
    "You are not owner of this nft.",
    "Missing or invalid parameters.",
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
      // alert(error_list[i]);
      toast.error(error_list[i]);
    }
  }
}

const Header = (props) => {
  const {
    sortbyTrue,
    sortByFalse,
    sortDefault,
    sortByPriceHighToLow,
    sortByPriceLowToHigh,
    setLoggedin,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };




  
  const disconnectbtn = async () => {
   
   
    sessionStorage.setItem("testdata", false);
    setLoggedin(false);
  };

  return (
    <div className="container-sk ">
      <div className="  border-b border-primary pb-5  ">
        <div className="   ">
          <h1 className="lg:text-2xl md:text-xl text-lg font-bold text-primary">
            Stake your Faydens
          </h1>
          <h4 className="text-sm   lg:text-base text-gray-500 mt-1">
            Stake your Faydens and earn points that can be redeemed in our
            upcoming redemption system, which will be available soon.
          </h4>
        </div>

        <div className="flex lg:flex-row lg:items-center flex-col lg:justify-between gap-8 mt-5">
          <div className="flex gap-2 ">
            {/* <Button
              variant="contained"
              className="bg-gray-600 hover:bg-gray-800 h-fit"
            >
              Claim&nbsp;All
            </Button> */}
            {props.isApproved && (
              <>
                <Button
                  variant="contained"
                  className="bg-gray-600 hover:bg-gray-800 h-fit"
                  onClick={() => {
                    stakeNft(props.IdsofUnstakedNfts, props.connectedAddress);
                  }}
                >
                  Stake&nbsp;All
                </Button>
                <Button
                  variant="contained"
                  className="bg-gray-600 hover:bg-gray-800 h-fit"
                  onClick={() => {
                    unstakeNft(props.Idsof_StakedNfts, props.connectedAddress);
                  }}
                >
                  Unstake&nbsp;All
                </Button>
              </>
            )}
            {!props.isApproved && (
              <Button
                variant="contained"
                className="bg-gray-600 hover:bg-gray-800 h-fit"
                onClick={() => {
                  approvenfts(props.connectedAddress);
                }}
              >
                Approve&nbsp;Nfts
              </Button>
            )}
          </div>
          <div className="w-full lg:w-60">
            <SelectDropdown
              sortbyTrue={sortbyTrue}
              sortByFalse={sortByFalse}
              sortDefault={sortDefault}
              sortByPriceLowToHigh={sortByPriceLowToHigh}
              sortByPriceHighToLow={sortByPriceHighToLow}
            />
          </div>
        </div>
      </div>

      <div className="border-b pb-5 mt-5 md:flex justify-between items-center gap-5 flex-wrap">
        <div className="grid grid-cols-2 gap-4 lg:gap-10 md:w-fit">
          <div className="flex flex-col  items-center">
            <span className="text-sm lg:text-base text-gray-600">
              Total Nfts Staked
            </span>
            <span className="text-primary text-base md:text-lg  font-bold">
              {props.Idsof_StakedNfts.length}
            </span>
          </div>
          <div className="flex flex-col  items-center">
            <span className="text-sm lg:text-base text-gray-600">
              Rewards Per Day
            </span>
            <span className="text-primary text-base md:text-lg  font-bold">
              {props.rewardsPerDay}
            </span>
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-4 justify-center mt-5 md:mt-0">
          <div className="flex gap-2 items-center">
        
            <Button
              className="capitalize bg-white text-primary hover:bg-white flex gap-2 items-center  w-full md:w-auto"
              variant="contained"
              title="My Balance"
            >
                  <img src="ring.png" className="w-4 h-4 object-contain" />
              Balance : {props.tokensEarned}
            </Button>
          </div>

          <div>
            <Button
              onClick={handleClick}
              className="capitalize bg-gray-600 hover:bg-gray-800 w-full md:w-auto"
              variant="contained"
              title="Wallet Address"
            >
              Wallet Address : {props.shortenAddress}
            </Button>

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              className="p-0"
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={() => {
                  disconnectbtn();
                }}
              >
                Disconnect
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
