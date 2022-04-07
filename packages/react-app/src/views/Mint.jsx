import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Popover, Form, Input, Switch, Typography } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useDebounce } from "../hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";

//==========my custom import
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/4.json"; // Rinkeby addresses, 1.json would be Rinkeby Testnet 
//==========my custom import

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
   priceOfMint
}) {
   const rawDrinks = useEventListener(readContracts, oldEnglishContract, "Drink", localProvider, startBlock - 9000);
   const drinks = useDebounce(rawDrinks, 1000);

   const onFinishFailed = errorInfo => {
      console.log("Failed:", errorInfo);
   };

  //=====MINT FORM
   const [mintForm] = Form.useForm();

   const mintNFT = () => {
      const [mint, setMint] = useState(false);

      return (
      <div>
         <Form
            form={mintForm}
            layout={"inline"}
            name="mint"
            initialValues={{
            numberOfTokens: '',
            }}
            onFinish={async values => {
            setMint(true);

            try {
               const txCur = await tx(writeContracts[lostandfoundNFTContract].mint(
                  values["numberOfTokens"],
                  { value: (priceOfMint * values["numberOfTokens"]).toString() }//* values["numberOfTokens"] ) }
               ));
               await txCur.wait();
               setMint(false);
            } catch(e) {
               console.log("mint failed", e);
               setMint(false);
            }
            }}
            onFinishFailed={onFinishFailed}
         >
            <Form.Item
            name="numberOfTokens"
            rules={[
               {
                  required: true,
                  message: "How Many NFTs Do You Want To Mint?"
               },
            ]}
            >
            <Input placeholder={"Limit 2"} />
            </Form.Item>
            <Form.Item>
            <Button type="primary" style={{ backgroundColor: "red", border: "black"}} htmlType="submit" loading={mint}>MINT</Button>
            </Form.Item>
         </Form>
      </div>
      );
   };

   return (
      <div style={{ margin: "auto", paddingBottom: 32 }}>
         <Popover
         content={() => {
         return mintNFT();
         }}
         title="How Many Will You Mint?"
         >
         <Button type="primary" style={{ width: "10%", backgroundColor: "red", border: "black", marginBottom: 25 }}>MINT NFT</Button>
         </Popover>    
      </div>
   );
}

export default OldEnglish;