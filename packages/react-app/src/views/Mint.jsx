import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Popover, Form, Input, notification, Switch, Typography, Menu, Dropdown, Select } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useDebounce } from "../hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";

//==========my custom import
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/4.json"; // Rinkeby addresses, 1.json would be Rinkeby Testnet 
import "./Mint.css";
import LF_Logo_V1 from "./LF_Logo_V1.png";
import Premint_Artwork from "./Untitled_Artwork.png";
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
            const imageURL1 = "https://ipfs.io/ipfs/" + metadataObject1.image.substring(7);
            setMintImageURL1(imageURL1);

            console.log("metadataObject1 = ", metadataObject1);
            console.log("imageURL1 = ", imageURL1);
            console.log("mintImageURL1 = ", mintImageURL1);
         } catch(e) {
            console.log(e);
         }
      }  catch (e) {
         console.log(e);
      }
   };

   const fetchMetadataMint2 = async (tokenId) => {
      try {
         const mintedTokenId2 = tokenId;
         const metadataURL2 = "https://ipfs.io/ipfs/bafybeiervi5luxk2had5y7v7cbhvn3nqr5ci6ivdavvfifftwnpcodmoja/" + mintedTokenId2 + ".token.json";
         const mintMetadataFetch2 = await fetch(metadataURL2);

         console.log("mintedTokenId2 = ", mintedTokenId2);
         console.log("metadataURL2 = ", metadataURL2);
         console.log("mintMetadataFetch2 = ", mintMetadataFetch2);
         
         try {
            const metadataObject2 = await mintMetadataFetch2.json();
            const imageURL2 = "https://ipfs.io/ipfs/" + metadataObject2.image.substring(7);
            setMintImageURL2(imageURL2);

            console.log("metadataObject2 = ", metadataObject2);
            console.log("imageURL2 = ", imageURL2);
            console.log("mintImageURL2 = ", mintImageURL2);
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
               <img width="50%"  src={LF_Logo_V1}></img>
               <br /> 
               <div className="mintPageExplanationBody" >
               {"" + maxSupply - totalSupply} / {"" + maxSupply} PIECES REMAIN
               </div>
               <div className="mintPageExplanationBody">
               LIMIT = 2 MINTS PER WALLET
               </div>
               <div className="mintPageExplanationBody">
               PRICE PER TOKEN = {"" + (priceOfMint / (10**18))} ETH
               </div>

            </div>
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
                     // functionality that tracks the state of user tokenId mints
                     const receipt = await txCur.wait();
/*                      let mintedTokenID = null;   */                   
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
                              fetchMetadataMint2(mintedTokenID);
                              console.log("Mint Image URL after else = " + mintImageURL2)  
                        }
                        count += 1;
/*                         console.log("count after end of for loop = " + count);   */
                     } 
                     setMint(false);
                     notification.open({
                        message: "Thanks for supporting my dream and welcome to the Lost & Found! Love, Danny Diamonds",
                        description: "- Danny Diamonds",
                     });                     
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
                     <label></label>
                  <Select placeholder="Quantity" size="large" style={{ marginTop: 0, marginBottom: 0, padding: 0, color: "white", fontSize: "1.2rem", backgroundColor: "#9b8deb", border: "2px #3d3280 solid", borderRadius: 10, width: "auto"}} >
                     <Option value="1">1</Option>
                     <Option value="2">2</Option>
                  </Select>  
                  </Form.Item>
                  <Form.Item>
                  <Button type="primary" style={{ fontSize: "1.2rem", backgroundColor: "#72a500", border: "2px solid #005a00", borderRadius: 10, color: "#F0F8EA", height: "auto", width: "125px" }} htmlType="submit" loading={mint}>MINT</Button>
                  </Form.Item>
               </Form>
            </div>
         </div>
            <div className="mintRenderWrapper">
               {(mintImageURL1 != "" && mintImageURL2 != "") ? (
                  <div className="mintRenderTwoNFTs">
                     <div className="twoMintedNFTRenderTitle1">TOKEN ID #{tokenIdMinted1}</div>
                     <div className="twoMintedNFTRenderTitle2">TOKEN ID #{tokenIdMinted2}</div>
                     <a
                        className="twoMintedNFTRender1" 
                        href={`${blockExplorer}token/${
                        readContracts[lostandfoundNFTContract] && readContracts[lostandfoundNFTContract].address
                        }?a=${tokenIdMinted1}`}
                        target="_blank"                                        
                     >
                        <img  src={mintImageURL1} width="100%"  />
                     </a>
                     <a
                        className="twoMintedNFTRender2"
                        href={`${blockExplorer}token/${
                        readContracts[lostandfoundNFTContract] && readContracts[lostandfoundNFTContract].address
                        }?a=${tokenIdMinted2}`}
                        target="_blank"                                             
                     >
                        <img  src={mintImageURL2} width="100%" />
                     </a>
                     <Link style={{ color: "#cc0083", fontSize: "1.5rem", marginTop: "10px" }} to="/"><u>CHECK IT OUT IN THE MARKETPLACE</u></Link>
                     <Link style={{ color: "#cc0083", fontSize: "1.5rem", marginTop: "10px" }} to="/"><u>CHECK IT OUT IN THE MARKETPLACE</u></Link>
                  </div>                                    
               ) : (
                  <>
                     {(mintImageURL1 != "" && mintImageURL2 == "") ? (
                     <div className="mintRenderOneNFT">
                        <div className="oneMintedNFTRenderTitle">Token ID #{tokenIdMinted1}</div>
                        <a
                           className="oneMintedNFTRender"
                           href={`${blockExplorer}token/${
                           readContracts[lostandfoundNFTContract] && readContracts[lostandfoundNFTContract].address
                           }?a=${tokenIdMinted1}`}
                           target="_blank"
                        >
                           <img src={mintImageURL1} width="100%" />
                        </a>
                        <Link style={{ color: "#cc0083", fontSize: "1.5rem", marginTop: "10px" }} to="/"><u>CHECK IT OUT IN THE MARKETPLACE</u></Link>
                     </div>
                     ) : (
                     <div className="mintRenderOneNFT">
                        <div className="oneMintedNFTRenderTitle">Token ID #? - Mint to Find Out</div>
                        <div className="oneMintedNFTRender">
                           <img src={Premint_Artwork} width="100%" />
                        </div>
{/*                         <div className="oneMintedNFTRenderTitle" style={{color: "#F0F66E"}}>WAITING FOR MINT</div>
                        <div className="oneMintedNFTRender"></div>   */}                      
                     </div>
                     )}
                  </>  
               )}                        
            </div>
      </div>
   );
}

export default OldEnglish;