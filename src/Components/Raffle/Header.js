import React from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="container-sk ">
      <div className="border-b border-primary pb-5">
        <div>
          <h1 className="lg:text-2xl md:text-xl text-lg font-bold text-primary">
            Raffle
          </h1>
          <h4 className="text-sm lg:text-base text-gray-500 mt-1">
            Stake your Faydens and earn points that can be redeemed in our
            upcoming redemption system, which will be available soon.
          </h4>
        </div>

        <div className="flex lg:flex-row lg:items-center flex-col lg:justify-between gap-8 mt-5">
          <div className="flex md:flex-row flex-col gap-4 justify-center mt-5 md:mt-0">
            <div className="flex gap-2 items-center">
              <Button
                className="capitalize bg-white text-primary hover:bg-white flex gap-2 items-center w-full md:w-auto"
                variant="contained"
                title="My Balance"
              >
                <img
                  src="ring.png"
                  className="w-4 h-4 object-contain"
                  alt="ring-icon"
                />
                Balance: 500
              </Button>
            </div>

            <div>
              <Button
                onClick={handleClick}
                className="capitalize bg-gray-600 hover:bg-gray-800 w-full md:w-auto"
                variant="contained"
                title="Wallet Address"
              >
                Wallet Address: x123saqd12
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
                    /* Your disconnectbtn function */
                  }}
                >
                  Disconnect
                </MenuItem>
              </Menu>
            </div>
          </div>

          <div className="w-full lg:w-60">
            <TextField
              id="outlined-basic"
              label="Search"
              size="small"
              variant="outlined"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
