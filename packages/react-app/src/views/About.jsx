import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Popover, Form, Switch, Typography } from "antd";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useDebounce } from "../hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";

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
}) {
   const rawDrinks = useEventListener(readContracts, oldEnglishContract, "Drink", localProvider, startBlock - 9000);
   const drinks = useDebounce(rawDrinks, 1000);

   return (
      <div style={{ margin: "auto", paddingBottom: 32 }}>
         <div>
         WHAT IS THIS SITE ?
         </div>
         <div>
         WHO IS DANNY DIAMONDS ?
         </div>
         <div>
         WHO IS TRANQUI.ETH ?
         </div>
         <div>
         HOW TO MAKE YOUR OWN MARKETPLACE
         </div>                           
      </div>
   );
}

export default OldEnglish;