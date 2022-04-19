import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Popover, Form, Input, notification, Switch, Typography, Menu, Dropdown, Select, Row } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useDebounce } from "../hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";

//==========my custom import
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/4.json"; // Rinkeby addresses, 1.json would be Rinkeby Testnet 
import "./Mint.css";
import LF_Logo_V2_5 from "./LF_Logo_V2_5.png";
import Premint_Artwork from "./Untitled_Artwork.png";
import Confetti from 'react-confetti';
import { useWindowSize, useWindowWidth, useWindowHeight } from '@react-hook/window-size';
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
   remainingMints,
   nftContractURI
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

   //====saving nft names for each mint
   const [mintName1, setMintName1] = useState("");
   const [mintName2, setMintName2] = useState("");

   //====defining window size for confetti animation
   const width = useWindowWidth();
   const height = useWindowHeight();

   //===fetching metadata
   const fetchMetadataMint1 = async (tokenId) => {
      try {
         const mintedTokenId1 = tokenId;
         const metadataURL1 = "https://ipfs.io/ipfs/" + nftContractURI.substring(7) + "/" + mintedTokenId1 + ".token.json"; 
         const mintMetadataFetch1 = await fetch(metadataURL1);

         console.log("mintedTokenId1 = ", mintedTokenId1);
         console.log("metadataURL1 = ", metadataURL1);
         console.log("mintMetadataFetch1 = ", mintMetadataFetch1);
/*          console.log("tokenURI1", tokenURI1); */
/*          console.log("v2_metadataURl1", v2_metadataURl1); */
         
         try {
            const metadataObject1 = await mintMetadataFetch1.json();
            const imageURL1 = "https://ipfs.io/ipfs/" + metadataObject1.image.substring(7);
            const nftName1 = metadataObject1.name;
            setMintImageURL1(imageURL1);
            setMintName1(nftName1);

            console.log("metadataObject1 = ", metadataObject1);
            console.log("imageURL1 = ", imageURL1);
            console.log("mintImageURL1 = ", mintImageURL1);
            console.log("mintName1 = ", mintName1);
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
         const metadataURL2 = "https://ipfs.io/ipfs/" + nftContractURI.substring(7) + "/" + mintedTokenId2 + ".token.json";
         const mintMetadataFetch2 = await fetch(metadataURL2);

         console.log("mintedTokenId2 = ", mintedTokenId2);
         console.log("metadataURL2 = ", metadataURL2);
         console.log("mintMetadataFetch2 = ", mintMetadataFetch2);
         
         try {
            const metadataObject2 = await mintMetadataFetch2.json();
            const imageURL2 = "https://ipfs.io/ipfs/" + metadataObject2.image.substring(7);
            const nftName2 = metadataObject2.name;
            setMintImageURL2(imageURL2);
            setMintName2(nftName2);

            console.log("metadataObject2 = ", metadataObject2);
            console.log("imageURL2 = ", imageURL2);
            console.log("mintImageURL2 = ", mintImageURL2);
            console.log("mintName2 = ", mintName2);
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
               <img className="logoWidth" src={LF_Logo_V2_5}></img>
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
                        message: "Thanks for supporting my dream and welcome to the Lost & Found! Love,",
                        description: "Danny Diamonds",
                     });                     
                  } catch(e) {
                     console.log("mint failed", e);
                     setMint(false);
                  }
                  }}                 
                  onFinishFailed={onFinishFailed}
               >
                  <Form.Item
                  label={<label style={{ color: "#3e190f", fontSize: "1.5rem" }}>QUANTITY :</label>}
                  style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}
                  name="numberOfTokens"
                  rules={[
                     {
                        required: true,
                        message: "How Many NFTs Do You Want To Mint?"
                     },
                  ]}
                  >
                     <Select placeholder="Q" size="large" style={{ marginTop: 0, marginBottom: 0, padding: 0, color: "white", fontSize: "1.2rem", backgroundColor: "#9b8deb", border: "2px #3d3280 solid", borderRadius: 10, width: "auto"}} >
                        <Select.Option value="1">1</Select.Option>
                        <Select.Option value="2">2</Select.Option>
                     </Select>  
                  </Form.Item>
                  <Form.Item>
                     <Button type="primary" style={{ fontSize: "1.2rem", backgroundColor: "#72a500", border: "2px solid #005a00", borderRadius: 10, color: "#F0F8EA", height: "auto", width: "auto" }} htmlType="submit" loading={mint}>MINT !</Button>
                  </Form.Item>               
               </Form>
            </div>
         </div>
            <div className="mintRenderWrapper">
               {(mintImageURL1 != "" && mintImageURL2 != "") ? (
                  <div className="mintRenderTwoNFTs">
                     <Confetti
                        height={document.body.scrollHeight}
                        width={width * .99}
                     />                     
                     <div className="twoMintedNFTRenderTitle1">LF #{tokenIdMinted1 + " - " + mintName1}</div>
                     <div className="twoMintedNFTRenderTitle2">LF #{tokenIdMinted2 + " - " + mintName2}</div>
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
                     <Link to="/">
                        <Button
                        style={{ backgroundColor: "#3e190f", color: "white", borderRadius: 20, fontSize: "1.5rem", height: "auto", marginTop: "20px" }}
                        >
                           VIEW IN MARKETPLACE
                        </Button>
                     </Link>
                     <Link to="/">
                        <Button
                        style={{ backgroundColor: "#3e190f", color: "white", borderRadius: 20, fontSize: "1.5rem", height: "auto", marginTop: "20px" }}
                        >
                           VIEW IN MARKETPLACE
                        </Button>
                     </Link>
                  </div>                                    
               ) : (
                  <>
                     {(mintImageURL1 != "" && mintImageURL2 == "") ? (
                     <div className="mintRenderOneNFT">
                        <Confetti
                           height={document.body.scrollHeight}
                           width={width * .99}
/*                         width={width} */
                        />
                        <div className="oneMintedNFTRenderTitle">LF #{tokenIdMinted1 + " - " + mintName1}</div>
                        <a
                           className="oneMintedNFTRender"
                           href={`${blockExplorer}token/${
                           readContracts[lostandfoundNFTContract] && readContracts[lostandfoundNFTContract].address
                           }?a=${tokenIdMinted1}`}
                           target="_blank"
                        >
                           <img src={mintImageURL1} width="100%" />
                        </a>
                        <Link to="/">
                           <Button
                           style={{ backgroundColor: "#3e190f", color: "white", borderRadius: 20, fontSize: "1.5rem", height: "auto", marginTop: "20px" }}
                           >
                              VIEW IN MARKETPLACE
                           </Button>
                        </Link>
                     </div>
                     ) : (
                     <div className="mintRenderOneNFT">
                        <div className="oneMintedNFTRenderTitle">LF #? - Mint to Find Out</div>
                        <div className="oneMintedNFTRender" style={{width: "40%"}}>
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