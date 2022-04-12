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
import "./Mint.css";
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
   maxSupply
}) {
   const rawDrinks = useEventListener(readContracts, oldEnglishContract, "Drink", localProvider, startBlock - 9000);
   const drinks = useDebounce(rawDrinks, 1000);



   const onFinishFailed = errorInfo => {
      console.log("Failed:", errorInfo);
   };

   //=====MINT FORM + STATE
   const [mintForm] = Form.useForm();
   const [mint, setMint] = useState(false);

   //====SAVING MINT STATE
   const [tokenIdMinted1, setTokenIdMinted1] = useState("");
   const [tokenIdMinted2, setTokenIdMinted2] = useState("");

   //=====Saving image urls for each mint
   const [mintImageURL1, setMintImageURL1] = useState("");
   const [mintImageURL2, setMintImageURL2] = useState("");

/*    //==rendering mint objects???
   const currentTokensMinted = tokenIdMinted1.concat(tokenIdMinted2); */

   //===fetching metadata
   const fetchMetadataMint1 = async (tokenId) => {
      try {
         const mintedTokenId1 = tokenId;
         const metadataURL1 = "https://ipfs.io/ipfs/bafybeiervi5luxk2had5y7v7cbhvn3nqr5ci6ivdavvfifftwnpcodmoja/" + mintedTokenId1 + ".token.json";
         const mintMetadataFetch1 = await fetch(metadataURL1);

         console.log("mintedTokenId1 = ", mintedTokenId1);
         console.log("metadataURL1 = ", metadataURL1);
         console.log("mintMetadataFetch1 = ", mintMetadataFetch1);
         
         try {
            const metadataObject1 = await mintMetadataFetch1.json();
            const imageURL = "https://ipfs.io/ipfs/" + metadataObject1.image.substring(7);
            setMintImageURL1(imageURL);

            console.log("metadataObject1 = ", metadataObject1);
            console.log("imageURL = ", imageURL);
            console.log("mintImageURL1 = ", mintImageURL1);
         } catch(e) {
            console.log(e);
         }
      }  catch (e) {
         console.log(e);
      }
   };

/*    useEffect(() => {
      fetchMetadataMint1(mintedTokenID);
   }) */

   return (
      <div className="mint">
         <div className="beforeMintRender">
            <div className="mintPageExplanation">
               <div className="mintPageExplanationHead">
               THIS IS THE LOST & FOUND, VOL. 1 COLLECTION
               </div>
               <div className="mintPageExplanationBody">
               A BODY OF WORK BY DANNY DIAMONDS
               </div>
               <br />
               <div className="mintPageExplanationBody" style={{ color: "#F0F66E" }} >
               {"" + maxSupply - totalSupply} / {"" + maxSupply} PIECES REMAIN
               </div>
               <div className="mintPageExplanationBody">
               HOW MANY WILL YOU MINT ?
               </div>
            </div>
            <br />
            <div>
               <Form
                  className="mintFormStyling"
                  /* style={{border: "1px solid yellow"}} */
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

                     // functionality that tracks the tokenId mints
                     const receipt = await txCur.wait();
                     let mintedTokenID = null;                     
                     for (const event of receipt.events) {
                        if (event.event !== 'Transfer') {
                           continue
                        }                        
                        let mintedTokenID = await event.args.tokenId.toString();
                        console.log("MINTED TOKEN ID = " + mintedTokenID);
                        console.log("count before second if = " + count);
                           if (count < 1) {
                              setTokenIdMinted1(mintedTokenID);
                              fetchMetadataMint1(mintedTokenID);
                              console.log("Mint Image URL after 2nd if = " + mintImageURL1)
                                                         
                              console.log("count after second if = " + count);
                           }  else {
                              console.log("count after else = " + count);
                              setTokenIdMinted2(mintedTokenID);  
                        }
                        count += 1;
/*                         console.log("count after end of for loop = " + count);   */
                     } 
                     setMint(false);
                     notification.open({
                        message: "Your support means the world <3",
                        description: "- Danny Diamonds",
                     });                     
                  } catch(e) {
                     console.log("mint failed", e);
                     setMint(false);
                  }
                  }}                 
                  onFinishFailed={onFinishFailed}
               >
                  <Form.Item style={{ fontSize: "1rem", color: "#A8C686"}} >
                  QUANTITY : ID 1 {"" + tokenIdMinted1} + ID 2 {"" + tokenIdMinted2}
                  </Form.Item>
                  <Form.Item
                  name="numberOfTokens"
                  rules={[
                     {
                        required: true,
                        message: "How Many NFTs Do You Want To Mint?"
                     },
                  ]}
                  >
                  <Input style={{ backgroundColor: "grey", border: "2px #A8C686 solid", textAlign: "center"}} placeholder={"LIMIT = 2"} />
                  </Form.Item>
                  <Form.Item>
                  <Button type="primary" style={{ backgroundColor: "#A8C686", border: "2px solid grey", color: "black"}} htmlType="submit" loading={mint}>MINT</Button>
                  </Form.Item>
               </Form>
            </div>



         </div>
{/*          {false ? (
            <Spin style={{ marignTop: 100}} />
         ) : ( */}
            <div className="mintRenderWrapper">
               {mintImageURL1 == "" ? (
                  <div>No IMAGE YET</div>
               ) : (
                  <div>
                     <img src={mintImageURL1 && mintImageURL1} width="100%" />
                  </div>
               )}
{/*                <List
                  grid={{
                     gutter: 16,
                     xs: 1,
                     sm: 2,
                     md: 2,
                     lg: 2,
                     xl: 2,
                     xxl: 2,
                  }}
                  align="center" ///THIS IS WHAT ALIGNS ALL OF THE CARDS!!!!!!
                  locale={{ emptyText: `waiting for LFs...` }}
                  //loading={loadingMints}
                  dataSource={currentTokensMinted}
                  renderItem={ async item => {
                     console.log("item", item)
                     try {
                        const tokenId = item;
                        console.log("tokenId", tokenId)
                        const metadataURL = "https://ipfs.io/ipfs/bafybeiervi5luxk2had5y7v7cbhvn3nqr5ci6ivdavvfifftwnpcodmoja/" + {tokenId} + ".token.json"
                        console.log("metadataURL", metadataURL)
                        const metadataFetch = await fetch(metadataURL);
                        console.log("metadataFetch", metadataFetch)
                        const metadataObject = await metadataFetch.json();
                        console.log("metadataObject", metadataObject)
                        const imageGateway = "https://ipfs.io/ipfs/" + metadataObject.image.substring(7);
                        console.log("imageGateway", imageGateway)
                     } catch (e) {
                        console.log(e)
                     }

                     return (
                        <List.Item key={tokenId}>
                           <Card
                              bodyStyle={{ padding: "0", margin: "0" }}
                              style={{ border: "2px solid black", borderRadius: 2 }}
                           >
                              <img src={imageGateway ** imageGateway} alt={"LF #" + tokenId} width="100%" />
                           </Card>
                        </List.Item>
                     )
                  }}  
               >
               </List> */}                
            </div>
         {/* )} */}
      </div>
   );
}

export default OldEnglish;