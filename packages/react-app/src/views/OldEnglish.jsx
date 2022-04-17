import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Popover, Form, Switch, Input, InputNumber, Radio, Space, Select, Cascader, DatePicker, TreeSelect } from "antd";
import { BorderBottomOutlined, PicCenterOutlined, RedoOutlined } from "@ant-design/icons";
import { Address, AddressInput } from "../components";
import { useDebounce } from "../hooks";
import { ethers, BigNumber } from "ethers";
import { useEventListener } from "eth-hooks/events/useEventListener";

//==========my custom import
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/4.json"; // Rinkeby addresses, 1.json would be Rinkeby Testnet 
import "./Marketplace.css";
import LF_Logo_V2_5 from "./LF_Logo_V2_5.png";

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
  balance,
  startBlock,
  ///=======my custom imports
/*   zoraTransferHelperContract,
*/
  zmmContract,
  zoraAsksContract,
  lostandfoundNFTContract,
  lostandfoundNFTContractAddress,
  erc721TransferHelperApproved,
  zoraModuleManagerApproved,
  maxSupply
  ///=======my custom imports
}) {
  const [allOldEnglish, setAllOldEnglish] = useState({});
  const [loadingOldEnglish, setLoadingOldEnglish] = useState(true);
  const perPage = 12;
  const [page, setPage] = useState(0);

  //===CUSTOM STATE SETTING TO HANDLE FINDERS FEE INPUT LOGIC
  const [createFinderIsDisabled, setCreateFinderIsDisabled] = useState(true);
  
  const createHandleClickFalse = () => {
    setCreateFinderIsDisabled(false)
  };

  const createHandleClickTrue = () => {
    setCreateFinderIsDisabled(true)
  };

  const [fillFinderIsDisabled, setFillFinderIsDisabled] = useState(true);
  
  const fillHandleClickFalse = () => {
    setFillFinderIsDisabled(false)
  };

  const fillHandleClickTrue = () => {
    setFillFinderIsDisabled(true)
  };

  //====my custom addition
  const fetchMetadataAndUpdate = async id => {
    try {
      const tokenURI = await readContracts[lostandfoundNFTContract].tokenURI(id);
      const nftMetadataURL = "https://ipfs.io/ipfs/" + tokenURI.substring(7); 
      const nftMetadataFetch = await fetch(nftMetadataURL); 

      //===CUSTOM UPDATE
      const seller = await readContracts[zoraAsksContract].askForNFT(lostandfoundNFTContractAddress, id);
      const ownerAddress = await readContracts[lostandfoundNFTContract].ownerOf(id);
      const ownerAddressCleaned = ownerAddress.toString().toLowerCase();
      //===CUSTOM UPDATE

      try {
        const nftMetadataObject = await nftMetadataFetch.json();
        const collectibleUpdate = {};

        //===CUSTOM UPDATE, added askSeller: seller and nftOwner: ownerAddress as key:value pairs
        collectibleUpdate[id] = { id: id, uri: tokenURI, askSeller: seller, nftOwner: ownerAddressCleaned, ...nftMetadataObject};
        //====CUSTOM UPDATE

        setAllOldEnglish(i => ({ ...i, ...collectibleUpdate }));
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  };


  const updateAllOldEnglish = async () => {
    if (readContracts[lostandfoundNFTContract] && totalSupply) {
      setLoadingOldEnglish(true);
      let numberSupply = totalSupply.toNumber();

      let tokenList = Array(numberSupply).fill(0);

      tokenList.forEach((_, i) => {
        let tokenId = i; // make this i + 1 if your first token ID is 1 instead of 0
        if (tokenId <= numberSupply - page * perPage && tokenId >= numberSupply - page * perPage - perPage) {
          fetchMetadataAndUpdate(tokenId);
        } else if (!allOldEnglish[tokenId]) {
          const simpleUpdate = {};
          simpleUpdate[tokenId] = { id: tokenId };
          setAllOldEnglish(i => ({ ...i, ...simpleUpdate }));
        }
      });

      setLoadingOldEnglish(false);
    }
  };

  const updateYourOldEnglish = async () => {
    for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
      try {
        const tokenId = await readContracts[oldEnglishContract].tokenOfOwnerByIndex(address, tokenIndex);
        fetchMetadataAndUpdate(tokenId);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const updateOneOldEnglish = async id => {
    if (readContracts[lostandfoundNFTContract] && totalSupply) {
      fetchMetadataAndUpdate(id);
    }
  };

  useEffect(() => {
    if (totalSupply && totalSupply.toNumber() > 0) updateAllOldEnglish();
  }, [readContracts[lostandfoundNFTContract], (totalSupply || "0").toString(), page]);

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  let filteredOEs = Object.values(allOldEnglish).sort((a, b) => b.askSeller.askPrice - a.askSeller.askPrice);
  const [mine, setMine] = useState(false);
  if (mine == true && address && filteredOEs) {
    filteredOEs = filteredOEs.filter(function (el) {
      return el.nftOwner == address.toLowerCase();
    });
  }

  //========MY CUSTOM FUNCTIONALITY=======

  //********* CREATE ASK FLOW ***********
  const [createAskForm] = Form.useForm();
  const createAsk = id => {
    const [listing, setListing] = useState(false);

    return (
      <div >
        <Form
/*           className="createAskFormPopoverManager" */ // not using actively
          layout={"horizontal"}
          form={createAskForm}
          name="create ask"
          initialValues={{ 
            tokenId: id,
            askPrice: '',
            sellerFundsRecipient: '',
            findersFeeBps: '',
          }}
          onFinish={async values => {
            setListing(true);
            try {
              const txCur = await tx(writeContracts[zoraAsksContract].createAsk(
                lostandfoundNFTContractAddress,
                id,
                ethers.utils.parseUnits(values["askPrice"], 'ether'), 
                "0x0000000000000000000000000000000000000000",
                values["sellerFundsRecipient"],
                (Number(values["findersFeeBps"]).toFixed(2)) * 100 // converts inputted % into a whole number of basis points between 0 - 10000
              ));
              await txCur.wait();
              updateOneOldEnglish(id);
              setListing(false);
            } catch (e) {
              console.log("create ask failed", e);
              setListing(false);
            }
          }}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            style={{marginTop: 0, marignBottom: 0, paddingTop: 0, paddingBottom: 0}}              
            name="askPrice"
            label="LIST PRICE "
            rules={[
              {
                required: true,
                message: "HOW MUCH ARE YOU LISTING THIS NFT FOR?",
              },
            ]}
          >
            <Input
            addonAfter={"ETH"}
            />
          </Form.Item>         
          <Form.Item
            style={{marginTop: 0, marignBottom: 0, paddingTop: 0, paddingBottom: 0}}
            name="sellerFundsRecipient"
            label="SELLER FUNDS RECIPIENT"
            rules={[
              {
                required: true,
                message: "WHO GETS THE FUNDS FROM THIS SALE?",
              },
            ]}
          >
            <Input
            placeholder={"FULL WALLET ADDRESS (NO .ETH NAMES)"}
            />
          </Form.Item>
          <Form.Item
            style={{marginTop: 0, marignBottom: 0, paddingTop: 0, paddingBottom: 0}}
            name="findersFeeBps"
            rules={[
              {
                required: true,
                message: "INPUT REQUIRED IF 'FINDER'S FEE IS SELECTED'",
              },
            ]}
          >
            <div>
              <Radio.Group>
                <Radio onClick={createHandleClickFalse} value={""}>ADD FINDER'S FEE</Radio>                
                <Radio onClick={createHandleClickTrue} value={"0x0000000000000000000000000000000000000000"}>NO FINDER'S FEE</Radio> {/*returns the zero address if no finder selected */}
              </Radio.Group>
              <Input            
              style={{ marginTop: "5px", width: "50%" }}
              addonAfter={"%"}
              disabled={createFinderIsDisabled}
              />
            </div>
          </Form.Item>          
          <Form.Item>
            <Button
            style={{ backgroundColor: "#ffb300", color: "#c43b00", border: "4px solid #c43b00", fontSize: "1.25rem", height: "auto", borderRadius: 20  }} 
            type="primary"
            htmlType="submit"
            loading={listing}>
              LIST
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };  

  //********* Set Ask Price FLOW ***********
  const [setAskForm] = Form.useForm();
  const updateAskPrice = id => {
    const [set, setSet] = useState(false);

    return (
      <div>
        <Form
          className="updateAskFormPopoverManager"
          form={setAskForm}
          name="update ask price"
          initialValues={{ 
            tokenId: id,
            updatedPrice: '',
          }}
          onFinish={async values => {
            setSet(true);
            try {
              const txCur = await tx(writeContracts[zoraAsksContract].setAskPrice(
                lostandfoundNFTContractAddress,
                id,
                ethers.utils.parseUnits(values["updatedPrice"], 'ether'), 
                "0x0000000000000000000000000000000000000000"
              ));
              await txCur.wait();
              updateOneOldEnglish(id);
              setSet(false);
            } catch (e) {
              console.log("UPDATE LISTING PRICE FAILED", e);
              setSet(false);
            }
          }}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="updatedPrice"
            rules={[
              {
                required: true,
                message: "WHAT IS THE UPDATED LISTING PRICE?",
              },
            ]}
          >
            <Input
            style={{width: "300px"}}
            placeholder={"UPDATED LISTING PRICE"}
            addonAfter={"ETH"}
            />
          </Form.Item>                
          <Form.Item>
            <Button
            style={{ backgroundColor: "#579dfa", color: "#283cc4", border: "4px solid #283cc4", fontSize: "1.25rem", height: "auto", borderRadius: 20  }} 
            type="primary"
            htmlType="submit"
            loading={set}
            >
              UPDATE
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };  

  //********* Cancel Ask FLOW ***********
  const [cancelAskForm] = Form.useForm();
  const cancelAsk = id => {
    const [cancel, setCancel] = useState(false);

    return (
      <div>
        <Form
          className="cancelAskFormPopoverManager"
          form={cancelAskForm}
          name="cancel ask "
          initialValues={{ 
            tokenId: id,
          }}
          onFinish={async values => {
            setCancel(true);
            try {
              const txCur = await tx(writeContracts[zoraAsksContract].cancelAsk(
                lostandfoundNFTContractAddress,
                id
              ));
              await txCur.wait();
              updateOneOldEnglish(id);
              setCancel(false);
            } catch (e) {
              console.log("CANCEL ASK FAILED", e);
              setCancel(false);
            }
          }}
          onFinishFailed={onFinishFailed}
        >              
          <Form.Item>
            <Button
            style={{ backgroundColor: "#e26843", color: "#791600", border: "4px solid #791600", fontSize: "1.25rem", height: "auto", borderRadius: 20  }} 
            type="primary"
            htmlType="submit"
            loading={cancel}
            >
            CANCEL
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };  

  //********* Fill Ask FLOW ***********
  const [fillAskForm] = Form.useForm();
  const fillAsk = id => {
    const [fill, setFill] = useState(false);

    return (
      <div>
        <Form
          className="filllAskFormPopoverManager"      
          form={fillAskForm}
/*           layout={"inline"} */
          name="fill ask "
          initialValues={{ 
            tokenId: id,
            finderAddress: '',
          }}
          onFinish={async values => {
            setFill(true);
            try {
              const txCur = await tx(writeContracts[zoraAsksContract].fillAsk(
                lostandfoundNFTContractAddress,
                id,
                "0x0000000000000000000000000000000000000000", // 0 address for ETH sale               
                BigNumber.from(allOldEnglish[id].askSeller.askPrice).toString(),
                values['finderAddress'],
                { value: BigNumber.from(allOldEnglish[id].askSeller.askPrice).toString() }
              ));
              await txCur.wait();
              updateOneOldEnglish(id);
              setFill(false);
            } catch (e) {
              console.log("FILL ASK FAILED", e);
              setFill(false);
            }
          }}
          onFinishFailed={onFinishFailed}
        >                
          <Form.Item
            name="finderAddress"
            rules={[
              {
                required: true,
                message: "WHO FACILITATED THIS SALE?",
              },
            ]}
          >
            <div className="fillAskPopver">
              <Radio.Group >
                <Radio onClick={fillHandleClickFalse} value={""}>REWARD A FINDER</Radio>                
                <Radio onClick={fillHandleClickTrue} value={"0x0000000000000000000000000000000000000000"}>NO FINDER INVOLVED</Radio>
              </Radio.Group>
              <Input
                style={{ marginTop: "5px", width: "100%" }}
                placeholder={"FINDER WALLET ADDRESS (NO .ETH NAMES)"}
                disabled={fillFinderIsDisabled}
              />
            </div>
          </Form.Item>        
          <Form.Item>
            <Button
            style={{ backgroundColor: "#72a500", color: "#005a00", border: "4px solid #005a00", fontSize: "1.25rem", height: "auto", borderRadius: 20  }} 
            type="primary"
            htmlType="submit"
            loading={fill}>
              BUY
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const marketplaceManager = () => {
    const [transferHelper, setTransferHelper] = useState(false);
    const [moduleManager, setModuleManager] = useState(false);

    return (
      <div className="approvalPopOverManager">
        <div className="pleaseApprovePopover">
        Lost & Found Marketplace is built on the ZORA Protocol. Please sign the following approvals to allow the protocol to interact with your assets : {/* ↓ ↓ */}
        </div>

        {/* commenting out refresh button 
        <Button
          onClick={() => {
            return updateAllOldEnglish();
          }}              
        >
          Refresh              
        </Button>
        */}

        {erc721TransferHelperApproved == true ? (
          <div
            className="erc721ApprovedPopover"
            style={{  }}>
            NFT TRANSFER HELPER IS APPROVED ✅
          </div>
          ) : (
          <Button
          className="erc721ApprovalButtonPopover"   
          style= {{ backgroundColor: "#d87456", color: "#791600", border: "4px solid #791600", fontSize: "1rem", height: "auto", borderRadius: 20  }}
            type="primary"
            loading={transferHelper}
            onClick={async () => {
              setTransferHelper(true);
              try {
                const txCur = await tx(writeContracts[lostandfoundNFTContract].setApprovalForAll(
                  mainnetZoraAddresses.ERC721TransferHelper,
                  true
                ));
                await txCur.wait();
                updateOneOldEnglish();
                setTransferHelper(false);
              } catch (e) {
                console.log("ERC721Transfer HelperApproval Failed", e);
                setTransferHelper(false);
              }
            }}
          >            
            APPROVE NFT TRANSFER HELPER
          </Button>
          )}
          {zoraModuleManagerApproved == true ? (
          <div className="zmmApprovedPopover">
            MARKETPLACE PROTOCOL IS APPROVED ✅ 
          </div>              
          ) : (
          <Button
            className="zmmApprovalButtonPopover"
            style={{ backgroundColor: "#4998ff", color: "#283cc4", border: "4px solid #283cc4", fontSize: "1rem", height: "auto", borderRadius: 20, verticalAlign: "center" }}
            type="primary"
            loading={moduleManager}
            onClick={async () => {
              setModuleManager(true);
              try {
                const txCur = await tx(writeContracts[zmmContract].setApprovalForModule(
                  mainnetZoraAddresses.AsksV1_1, 
                  true
                ));
                await txCur.wait();
                updateOneOldEnglish();
                setModuleManager(false);
              } catch (e) {
                console.log("ZORA Module Manager Approval Failed", e);
                setModuleManager(false);
              }
            }}
          >      
            APPROVE MARKETPLACE PROTOCOL
          </Button>
          )}
      </div>
    )
  }

  return (
    <div className="OldEnglish">
      <div className="beforeTokenRender"> 
        <div style={{ marginBottom: 15}} >
            <img width="50%" src={LF_Logo_V2_5}></img>
        </div>
        <div className="ownershipFilterWrapper">
          <div className="ownershipFilterOptions">
            FULL COLLECTION
          </div>
          <Switch
          className="ownershipFilterSwitch"
            disabled={loadingOldEnglish}
            style={{ height: "50%", width: "5%", border: "4px #3e190f solid" }}
            value={mine}
            onChange={() => {
              setMine(!mine);
              updateYourOldEnglish();
            }}
          >
          </Switch>
          <div className="ownershipFilterOptions">
            MY COLLECTION 
          </div>
        </div>
      </div>
      {false ? (
        <Spin />
      ) : (
        <div className="tokenRenderWrapper">
          <List            
            className="tokenRender"
            grid={{
              gutter: 30,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 3,
            }}
            align="center" ///THIS IS WHAT ALIGNS ALL OF THE CARDS!!!!!!
            locale={{ emptyText: `Fetching Markteplace Items...` }}
                        
            /* commenting out pagination (having multiple pages of NFTs)
            pagination={{
              total: mine ? filteredOEs.length : totalSupply,
              defaultPageSize: perPage,
              defaultCurrent: page,
              onChange: currentPage => {
                setPage(currentPage - 1);
                console.log(currentPage);
              },
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${mine ? filteredOEs.length : maxSupply} items`,
            }}
            */
            
            loading={loadingOldEnglish}
            dataSource={filteredOEs ? filteredOEs : []}
            renderItem={item => {
              const id = item.id;
              const imageWithGateway = "https://ipfs.io/ipfs/" + item.image.substring(7);                   
              return (
                <List.Item className="listItems" key={id}>
                  <Card
                    className="cards"                
                    style={{ border: "4px solid black", borderRadius: 2 }}
                    title={
                      <div
                        className="cardHeaders"
                      >
                        {item.name ? `LF #${id}` + "   -   " + item.name : `LF #${id}`}
                      </div>
                    }
                  >
                    <a                      
                      href={`${blockExplorer}token/${
                        readContracts[lostandfoundNFTContract] && readContracts[lostandfoundNFTContract].address
                      }?a=${id}`}
                      target="_blank"
                    >
                      <img className="nftImage" src={imageWithGateway && imageWithGateway} alt={"LF #" + id} width="100%" />
                    </a>
                    <div className="cardFooters"> {/* LMAO THIS LINE IS HOLDING EVERYTHING/*/}                                  
                      { item.nftOwner == address.toLowerCase() ? ( /// logic asking if you are the owner
                          <>
                            {item.askSeller.seller == "0x0000000000000000000000000000000000000000" ? ( /// logic asking what to do if you are the owner and ask does NOT exist
                              <div>
                                <div className="listingStatusManager">
                                  <div>
                                    <Address
                                      className="listingOwner"
                                      address={item.nftOwner}
                                      ensProvider={mainnetProvider}
                                      blockExplorer={blockExplorer}
                                      fontSize={16}
                                    />
                                  </div>
                                  <div className="listingStatus">
                                  LISTING : INACTIVE
                                  </div>
                                  <div className="listingPrice">
                                  PRICE : N/A
                                  </div>
                                  <div className="listingFindersFee">
                                  FINDER'S FEE : N/A
                                  </div>
                                </div>                                
                                { erc721TransferHelperApproved && zoraModuleManagerApproved == true ? ( 
                                <div className="marketplaceManager">                                    
                                  <Button
                                    className="marketplaceApprovalButton"
                                    disabled={true}
                                    style={{ borderRadius: 2, border: "1px solid black", width: "100%", fontSize: "1.2rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} 
                                    type="primary"
                                  >
                                    MARKETPLACE PROTOCOLS ARE APPROVED
                                  </Button>
                                  <Popover
                                  placement="top"
                                  /* style={{ display: "flex", flexDirection: "column", jusitfyContent: "center" }} */
                                    content={() => {                                                        
                                      return createAsk(id);
                                    }}
                                  >
                                    <Button style={{ borderRadius: 2, border: "1px solid black", backgroundColor: "white", color: "#3e190f", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">LIST</Button>
                                  </Popover>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">UPDATE</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">CANCEL</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">BUY</Button>
                                </div>  
                                ) : (
                                <div className="marketplaceManager">
                                  <Popover
                                    className="popoverMaster"
                                    placement="top"
                                    content={() => {                                                        
                                      return marketplaceManager();
                                    }}
                                  >
                                    <Button
                                      className="marketplaceApprovalButton"
                                      disabled={false}
                                      style={{ borderRadius: 2, border: "1px solid black", backgroundColor: "white", color: "#3e190f", fontSize: "1.2rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} 
                                      type="primary"
                                    >
                                      APPROVE MARKETPLACE PROTOCOLS
                                    </Button>
                                  </Popover>                                    
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">LIST</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">UPDATE</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">CANCEL</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">BUY</Button>
                                </div>
                                )}
                              </div>
                              ) : ( ///logic asking if you are the owner and the ask DOES exist
                                <div>
                                  <div className="listingStatusManager">                                 
                                    <div>
                                      <Address
                                        className="listingOwner"
                                        address={item.nftOwner}
                                        ensProvider={mainnetProvider}
                                        blockExplorer={blockExplorer}
                                        fontSize={16}
                                      />
                                    </div>                                    
                                    <div>
                                    LISTING : ACTIVE 
                                    </div>
                                    <div>                        
                                    PRICE : {item.askSeller.askPrice.toString() / (10 ** 18)} ETH
                                    </div>
                                    <div>
                                    FINDER'S FEE : {item.askSeller.findersFeeBps / 100} % 
                                    </div> 
                                  </div>
                                  { erc721TransferHelperApproved && zoraModuleManagerApproved == true ? (
                                  <div className="marketplaceManager"> 
                                    <Button
                                    className="marketplaceApprovalButton"
                                    disabled={true}
                                    style={{ borderRadius: 2, border: "1px solid black", width: "100%", fontSize: "1.2rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} 
                                    type="primary"
                                    >
                                      MARKETPLACE PROTOCOLS ARE APPROVED
                                    </Button>                                  
                                    <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">LIST</Button>                                
                                    <Popover
                                      placement="top"                                                     
                                      content={() => {                                                        
                                        return updateAskPrice(id);
                                      }}
                                    >
                                      <Button style={{ borderRadius: 2, border: "1px solid black", backgroundColor: "white", color: "#3e190f", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">UPDATE</Button>
                                    </Popover>
                                    <Popover
                                      content={() => {                                                        
                                        return cancelAsk(id);
                                      }}
                                    >
                                      <Button style={{ borderRadius: 2, border: "1px solid black", backgroundColor: "white", color: "#3e190f", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">CANCEL</Button>
                                    </Popover>
                                    <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">BUY</Button>
                                  </div>
                                  ) : (
                                  <div className="marketplaceManager">
                                    <Popover
                                      className="popoverMaster"
                                      placement="top"
                                      content={() => {                                                        
                                        return marketplaceManager();
                                      }}
                                    >
                                      <Button
                                        className="marketplaceApprovalButton"
                                        disabled={false}
                                        style={{ borderRadius: 2, border: "1px solid black", backgroundColor: "white", color: "#3e190f", fontSize: "1.2rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} 
                                        type="primary"
                                      >
                                        APPROVE MARKETPLACE PROTOCOLS
                                      </Button>
                                    </Popover>
                                    <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">LIST</Button>
                                    <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">UPDATE</Button>
                                    <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">CANCEL</Button>
                                    <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">BUY</Button>                                                                         
                                  </div>
                                  )} 
                                </div>
                              )}
                          </>
                        ) : ( /// logic asking what to do if user not the owner
                        <>
                          {item.askSeller.seller == "0x0000000000000000000000000000000000000000" ? (  ///logic asking what to do if not owner and ask does NOT exist
                              <div>
                                <div className="listingStatusManager">
                                  <div>
                                    <Address
                                      className="listingOwner"
                                      address={item.nftOwner}
                                      ensProvider={mainnetProvider}
                                      blockExplorer={blockExplorer}
                                      fontSize={16}
                                    />
                                  </div>
                                  <div className="listingStatus">
                                  LISTING : INACTIVE
                                  </div>
                                  <div className="listingPrice"> 
                                  PRICE : N/A
                                  </div>
                                  <div className="listingFindersFee">
                                  FINDER'S FEE : N/A
                                  </div>
                                </div>
                                <div className="marketplaceManager">
                                  <Button
                                    className="marketplaceApprovalButton"
                                    disabled={true}
                                    style={{ borderRadius: 2, border: "1px solid black", width: "100%", fontSize: "1.2rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} 
                                    type="primary"
                                  >
                                    NO AVAILABLE ACTIONS FOR THIS ITEM
                                  </Button>                                  
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">LIST</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">UPDATE</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">CANCEL</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">BUY</Button>
                                </div>                                   
                              </div>                                                   
                            ) : ( 
                              <div>
                                <div className="listingStatusManager">
                                  <div>
                                    <Address
                                      className="listingOwner"
                                      address={item.nftOwner}
                                      ensProvider={mainnetProvider}
                                      blockExplorer={blockExplorer}
                                      fontSize={16}
                                    />
                                  </div>
                                  <div className="listingStatus">
                                  LISTING : ACTIVE
                                  </div>
                                  <div className="listingPrice">                        
                                  PRICE : {item.askSeller.askPrice.toString() / (10 ** 18)} ETH
                                  </div>
                                  <div className="listingFindersFee">
                                  FINDER'S FEE : {item.askSeller.findersFeeBps / 100} % 
                                  </div>
                                </div>
                                { erc721TransferHelperApproved && zoraModuleManagerApproved == true ? (                                
                                <div className="marketplaceManager">
                                  <Button
                                    className="marketplaceApprovalButton"
                                    disabled={true}
                                    style={{ borderRadius: 2, border: "1px solid black", width: "100%", fontSize: "1.2rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} 
                                    type="primary"
                                  >
                                    MARKETPLACE PROTOCOLS ARE APPROVED
                                  </Button>                                  
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">LIST</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">UPDATE</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">CANCEL</Button>                                    
                                  <Popover
                                    className="fillAskPopver"
                                    content={() => {                                                        
                                      return fillAsk(id);
                                    }}
                                    
                                  >  
                                    <Button style={{ borderRadius: 2, border: "1px solid black", backgroundColor: "white", color: "#3e190f", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">BUY</Button>
                                  </Popover>
                                </div>
                                ) : (
                                <div className="marketplaceManager">
                                  <Popover
                                    className="popoverMaster"
                                    placement="top"
                                    content={() => {                                                        
                                      return marketplaceManager();
                                    }}
                                  >
                                    <Button
                                      className="marketplaceApprovalButton"
                                      disabled={false}
                                      style={{ borderRadius: 2, border: "1px solid black", backgroundColor: "white", color: "#3e190f", fontSize: "1.2rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} 
                                      type="primary"
                                    >
                                      APPROVE MARKETPLACE PROTOCOLS
                                    </Button>
                                  </Popover>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">LIST</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">UPDATE</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">CANCEL</Button>
                                  <Button disabled={true} style={{ borderRadius: 2, border: "1px solid black", fontSize: "1.4rem", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} type="primary">BUY</Button>                                                                  
                                </div>
                                )} 
                              </div>
                          )}
                          
                        </>
                      )}
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

export default OldEnglish;
