import React, { useState } from "react";
import { Button, IconButton, MenuItem } from "@mui/material";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import { Link } from "react-router-dom";
import Select from "@mui/material/Select";

import { useLocation } from "react-router-dom";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
export default function Header({ loggedin, setLoggedin }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const location = useLocation();
  const { pathname } = location;

  const selectStyles = {
    borderRadius: "9999px", // This value makes the border fully rounded, giving a circular appearance
    color: "white", // Set the text color to black (or any other color you prefer)
  };
  return (
    <nav
      className={`${
        loggedin === false && pathname == "/" && pathname == "/"
          ? "bg-white/50"
          : "bg-primary/80"
      }`}
    >
      <div className="container-sk py-2 lg:py-3 flex justify-between gap-8 items-center">
        <Link to="/">
          <img
            placeholder="blur"
            src={`${
              loggedin === false && pathname == "/" ? "logo.png" : "logo2.png"
            }`}
            width={500}
            height={500}
            alt="logo"
            className="cursor-pointer object-contain h-10 md:h-[40px] p-1 w-fit my-auto"
            blurDataURL="/blur.png"
            onClick={() => setLoggedin(false)}
          />
        </Link>

        <div className="hidden md:flex justify-between items-center gap-6 tracking-wide lg:text-lg text-base">
          {loggedin === false && pathname === "/" && (
            <Button
              variant="contained"
              className={`${
                loggedin === false &&
                pathname === "/" &&
                "bg-primary text-white font-bold shadow-md"
              } hover:bg-primary text-white hover:shadow shadow-none capitalize  lg:text-base duration-300 rounded-full `}
            >
              Home
            </Button>
          )}
          {pathname !== "/" && loggedin === false && (
            <Link to="/">
              <Button
                variant="contained"
                className={`${
                  loggedin === false &&
                  pathname === "/" &&
                  "bg-primary text-white font-bold shadow-md"
                } hover:bg-primary text-white hover:shadow shadow-none capitalize  lg:text-base duration-300 rounded-full `}
              >
                Home
              </Button>
            </Link>
          )}
          {loggedin === true && (
            <Link to="/">
              <Button
                variant="contained"
                className={`${
                  loggedin === true && pathname == "/"
                    ? "bg-primary text-white font-bold shadow"
                    : "text-white "
                } hover:bg-primary hover:text-white hover:shadow  shadow-none capitalize lg:text-base duration-300 rounded-full `}
              >
                Staking
              </Button>
            </Link>
          )}

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={10}
            size="small"
            style={selectStyles} // Apply the custom styles here
          >
            <MenuItem hidden value={10}>
              Redemption
            </MenuItem>
            <Link to="/raffle">
              <MenuItem value={20}>Raffle</MenuItem>
            </Link>
            <Link to="/auction">
              <MenuItem value={30}>Auction</MenuItem>
            </Link>
          </Select>
        </div>

        <IconButton
          onClick={toggleDrawer}
          className="bg-secondary/10 hover:bg-secondary/30 duration-300 md:hidden lg:hidden"
        >
          <MenuIcon className="text-black" />
        </IconButton>
      </div>

      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        className="text-black"
      >
        <div className="h-full bg-primary">
          <IconButton onClick={() => toggleDrawer()} className="m-3">
            <CloseIcon className="text-white" />
          </IconButton>
          <Link to="/">
            <img
              placeholder="blur"
              src="/logo2.png"
              width={500}
              height={500}
              alt="logo"
              className="object-contain h-[85px] w-fit p-5 my-auto mx-auto "
              blurDataURL="/blur.png"
              onClick={() => {
                setLoggedin(false);
                setIsOpen(false);
              }}
            />
          </Link>

          <div className="flex justify-center items-center flex-col gap-4 tracking-wide lg:text-lg text-base mt-10">
            {loggedin === false && pathname == "/" && (
              <Button
                onClick={toggleDrawer}
                variant="contained"
                className={`${
                  pathname === "/"
                    ? "bg-primary shadow-md text-white shadow-white"
                    : "text-gray-700"
                } hover:bg-primary hover:text-white hover:shadow shadow-none capitalize lg:text-base duration-300 `}
              >
                Home
              </Button>
            )}

            {loggedin === true && (
              <Link to="/">
                <Button
                  onClick={toggleDrawer}
                  variant="contained"
                  className={`${
                    loggedin === true
                      ? "bg-primary shadow-md text-white shadow-white"
                      : "text-white"
                  } hover:bg-primary hover:text-white hover:shadow shadow-none capitalize lg:text-base duration-300 `}
                >
                  Staking
                </Button>
              </Link>
            )}

            <span
              className={`${
                loggedin === true
                  ? "bg-primary shadow-md text-white shadow-white"
                  : "text-white"
              } hover:bg-primary border-b border-white/50 hover:text-white hover:shadow shadow-none capitalize lg:text-base duration-300 `}
            >
              Redemption <ArrowDropDownIcon />
            </span>

            <Link to="/auction">
              <Button
                onClick={toggleDrawer}
                variant="contained"
                className={`${
                  loggedin === true
                    ? "bg-primary shadow-md text-white shadow-white"
                    : "text-white"
                } hover:bg-primary  hover:text-white hover:shadow shadow-none capitalize lg:text-base duration-300 `}
              >
                Auction
              </Button>
            </Link>
            <Link to="/raffle">
              <Button
                onClick={toggleDrawer}
                variant="contained"
                className={`${
                  loggedin === true
                    ? "bg-primary shadow-md text-white shadow-white"
                    : "text-white"
                } hover:bg-primary  hover:text-white hover:shadow shadow-none capitalize lg:text-base duration-300 `}
              >
                Raffle
              </Button>
            </Link>
          </div>
        </div>
      </Drawer>
    </nav>
  );
}
