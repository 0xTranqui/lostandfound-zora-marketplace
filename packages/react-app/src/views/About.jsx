import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Popover, Form, Input, notification, Switch, Typography } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useDebounce } from "../hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";

//==========my custom import
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/4.json"; // Rinkeby addresses, 1.json would be Rinkeby Testnet 
import "./About.css";
//==========my custom import

var count = 0; ///this saves count that is used to determine what state setting is used when picking up mints

function OldEnglish({
   readContracts,
   mainnetProvider,
   blockExplorer,
   totalSupply,
   DEBUG,
   writeContracts,
   tx,
   address,
   localProvider,
   oldEnglishContract,
   startBlock,
   //===my custom imports
   lostandfoundNFTContract,
   priceOfMint,
   maxSupply,
   remainingMints
}) {


   return (
      <div className="aboutPageWrapper">
         <div className="aboutPage">
            <div className="sections">
               <div className="aboutPageHeaders">
                  WHAT IS THIS SITE
               </div>
               <div className="aboutPageBody">
                  - This site serves as a direct link between Danny Diamonds and people looking to interact with his work <br/>
                  - The marketplace functionality is build on top of the ZORA Protocol, which is a public / permisssionesless / free-to-use marketplace protocol that enables creators to own their own marketplaces and curate custom experiences for their community <br/>
                  - What you see here is Danny's first step into reclaiming the value and context of his art which has been been held for ransom from predatory third-parties in previous iterations of fan economies
               </div>
            </div>
            <div className="sections">
               <div className="aboutPageHeaders">
                  WHO IS <a href="https://twitter.com/dannydiamondss"><u>DANNY DIAMONDS</u></a>
               </div>
               <div className="aboutPageBody">
                  - Danny Diamonds is the fuckin shit yo
               </div>
            </div>
            <div className="sections">
               <div className="aboutPageHeaders">
                  WHO IS <a href="https://twitter.com/0xTranqui"><u>TRANQUI.ETH</u></a>
               </div>
               <div className="aboutPageBody">
                  - tranqui.eth is a web3 developer focused on creating new forms of public digital infrastructure uniquely enabled by blockchains
               </div>
            </div>
            <div className="sections">
               <div className="aboutPageHeaders">
                  HOW TO MAKE YOUR OWN MARKETPLACE
               </div>
               <div className="aboutPageBody">
                  - This marketplace was created to serve as a template for all creatives who want to gain control of how their work is interacted with <br />
                  - Check out the following links to a video tutorial, written guide, and the public GitHub Repository for this project to get started <br />
                  - Need help building your own marketplace? tranqui.eth is open to commission work on a per project basis. Hit his <a href="https://twitter.com/0xTranqui"><u>DMs</u></a> to inquire
               </div>
            </div>        
         </div>
      </div>
   );
}

export default OldEnglish;