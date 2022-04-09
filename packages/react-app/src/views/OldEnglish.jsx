import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Popover, Form, Switch, Input, Radio, Space, Select, Cascader, DatePicker, InputNumber, TreeSelect } from "antd";
import { BorderBottomOutlined, RedoOutlined } from "@ant-design/icons";
import { Address, AddressInput } from "../components";
import { useDebounce } from "../hooks";
import { ethers, BigNumber } from "ethers";
import { useEventListener } from "eth-hooks/events/useEventListener";

//==========my custom import
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/4.json"; // Rinkeby addresses, 1.json would be Rinkeby Testnet 
import "./views.css";
const { Meta } = Card;
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
  zoraTransferHelperContract,
  zmmContract,
  zoraAsksContract,
  lostandfoundNFTContract,
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

  {/*
  state = { value: 1 };

  finderChecker = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  const { value } = this.state;
*/}

  //====my custom addition
  const nftContractAddress = "0x0E0e37De35471924F50598d55F7b69f93703fA01"; //<-- LF | OE -> "0x03D6563e2047534993069F242181B207f80C5dD9";
  // Imports + declartions for ZORA Approval Contracts
  const erc721TransferHelperAddress = mainnetZoraAddresses.ERC721TransferHelper;
  const moduleManagerAddress = mainnetZoraAddresses.ZoraModuleManager;
  const asksModuleV1_1Address = mainnetZoraAddresses.AsksV1_1;
  const oldEnglishContractAddress = "0x03D6563e2047534993069F242181B207f80C5dD9";
  const lostandfoundContractAddress = "0x0E0e37De35471924F50598d55F7b69f93703fA01";

  
  ///this allows you to query the current ask for any given NFt. if no current ask, seller = 0 address
  //const seller = useContractReader(readContracts, zoraAsksContract, "askForNFT", [nftContractAddress, 3]);
  //const seller2 = readContracts()
  //const specificSeller = seller["seller"];
  //===MY SOON TO BE ADDED custom functionality to retrieve state of Asks for each NFT
  
  const fetchMetadataAndUpdate = async id => {
    try {
      const tokenURI = await readContracts[lostandfoundNFTContract].tokenURI(id);
      const nftMetadataURL = "https://ipfs.io/ipfs/" + tokenURI.substring(7); // previous function atob(tokenURI.substring(29));
      const nftMetadataFetch = await fetch(nftMetadataURL); 

      //===CUSTOM UPDATE
      const seller = await readContracts[zoraAsksContract].askForNFT(nftContractAddress, id);
      
      const ownerAddress = await readContracts[lostandfoundNFTContract].ownerOf(id);
      const ownerAddressCleaned = ownerAddress.toString().toLowerCase();

      //const ownerAddressStringLowerCase = ownerAddress.toLowerCase();

      //const ownerAddressString = ownerAddress.toString().toLowerCase();      //console.log(ownerAddress);
     // console.log(ownerAddressString);
      //console.log(ownerAddressStringLowerCase);
      //===CUSTOM UPDATE

      try {
        const nftMetadataObject = await nftMetadataFetch.json();// JSON.parse(jsonManifestString);
        //const nftMetadataObjectFixed = nftMetadataObject.item.imag
        const collectibleUpdate = {};

        //===CUSTOM UPDATE, added askSeller: seller as a key:value pair
        collectibleUpdate[id] = { id: id, uri: tokenURI, askSeller: seller, nftOwner: ownerAddressCleaned, ...nftMetadataObject};

        setAllOldEnglish(i => ({ ...i, ...collectibleUpdate }));
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  };


  const updateAllOldEnglish = async () => {
    if (readContracts[lostandfoundNFTContract] && totalSupply /*&& totalSupply <= receives.length*/) {
      setLoadingOldEnglish(true);
      let numberSupply = totalSupply.toNumber();

      let tokenList = Array(numberSupply).fill(0);

      tokenList.forEach((_, i) => {
        let tokenId = i; //used to be i + 1 for OE
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
    console.log('AllOldEnglishvibes'); // can delete this, just in for testing refresh button
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

  const [form] = Form.useForm();
  const sendForm = id => {
    const [sending, setSending] = useState(false);

    return (
      <div>
        <Form
          form={form}
          layout={"inline"}
          name="sendOE"
          initialValues={{ tokenId: id }}
          onFinish={async values => {
            setSending(true);
            try {
              const txCur = await tx(
                writeContracts[oldEnglishContract]["safeTransferFrom(address,address,uint256)"](
                  address,
                  values["to"],
                  id,
                ),
              );
              await txCur.wait();
              updateOneOldEnglish(id);
              setSending(false);
            } catch (e) {
              console.log("send failed", e);
              setSending(false);
            }
          }}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="to"
            rules={[
              {
                required: true,
                message: "Which address should receive this OE?",
              },
            ]}
          >
            <AddressInput ensProvider={mainnetProvider} placeholder={"to address"} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={sending}>
              Send
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };
  
  const [pourForm] = Form.useForm();
  const pour = id => {
    const [pouring, setPouring] = useState(false);

    return (
      <div>
        <Form
          form={pourForm}
          layout={"inline"}
          name="pourOE"
          initialValues={{ tokenId: id }}
          onFinish={async values => {
            setPouring(true);
            try {
              const currentTokenId = id;
              console.log(currentTokenId);
              console.log("hello")
              const txCur = await tx(writeContracts[oldEnglishContract]["pour"](id, values["to"]));
              await txCur.wait();
              updateOneOldEnglish(id);
              setPouring(false);
            } catch (e) {
              console.log("pour failed", e);
              setPouring(false);
            }
          }}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="to"
            rules={[
              {
                required: true,
                message: "Who's getting a pour?",
              },
            ]}
          >
            <AddressInput ensProvider={mainnetProvider} placeholder={"to address"} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={pouring}>
              Pour
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  let filteredOEs = Object.values(allOldEnglish).sort((a, b) => b.askSeller.askPrice - a.askSeller.askPrice);
  const [mine, setMine] = useState(false);
  if (mine == true && address && filteredOEs) {
    filteredOEs = filteredOEs.filter(function (el) {
      return el.nftOwner == address.toLowerCase();
    });
  }

  //=====MY CUSTOM FUNCTIONALITY====

  //********* CREATE ASK FLOW ***********
  const [createAskForm] = Form.useForm();
  const createAsk = id => {
    const [listing, setListing] = useState(false);

    return (
      <div>
        <Form
          form={createAskForm}
          layout={"inline"}
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
                nftContractAddress,
                id,
                ethers.utils.parseUnits(values["askPrice"], 'ether'), 
                "0x0000000000000000000000000000000000000000",
                values["sellerFundsRecipient"],
                values["findersFeeBps"] * 100
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
            name="askPrice"
            rules={[
              {
                required: true,
                message: "How much are you listing this NFT for??",
              },
            ]}
          >
            <Input
            placeholder={"Listing Price (ETH): "}
            addonAfter={"ETH"}
            />
          </Form.Item>         
          <Form.Item
            name="sellerFundsRecipient"
            rules={[
              {
                required: true,
                message: "Who's gets the funds from this sale?",
              },
            ]}
          >
            <Input
            placeholder={"Seller Funds Recipient (Full Wallet Address):"}
            />
          </Form.Item>
          <Form.Item
            name="findersFeeBps"
            rules={[
              {
                required: true,
                message: "How much is the finder's fee?",
              },
            ]}
          >
            <div>
              <Radio.Group>
                <Radio onClick={createHandleClickFalse} value={""}>Add Finder's Fee</Radio>                
                <Radio onClick={createHandleClickTrue} value={"0x0000000000000000000000000000000000000000"}>No Finder's Fee</Radio>
              </Radio.Group>
              <Input
              placeholder={"Finders Fee BPS in %"}
              addonAfter={"%"}
              disabled={createFinderIsDisabled}
              />
            </div>
          </Form.Item>          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={listing}>
              List
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
          form={setAskForm}
          layout={"inline"}
          name="update ask price"
          initialValues={{ 
            tokenId: id,
            updatedPrice: '',
          }}
          onFinish={async values => {
            setSet(true);
            try {
              const txCur = await tx(writeContracts[zoraAsksContract].setAskPrice(
                nftContractAddress,
                id,
                ethers.utils.parseUnits(values["updatedPrice"], 'ether'), 
                "0x0000000000000000000000000000000000000000"
              ));
              await txCur.wait();
              updateOneOldEnglish(id);
              setSet(false);
            } catch (e) {
              console.log("update ask price failed", e);
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
                message: "What is the new updated price (ETH)?",
              },
            ]}
          >
            <Input
            placeholder={"Updated Listing Price (ETH): "}
            addonAfter={"ETH"}
            />
          </Form.Item>                
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={set}>
              Update Listing
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
          form={cancelAskForm}
          layout={"inline"}
          name="cancel ask "
          initialValues={{ 
            tokenId: id,
          }}
          onFinish={async values => {
            setCancel(true);
            try {
              const txCur = await tx(writeContracts[zoraAsksContract].cancelAsk(
                nftContractAddress,
                id
              ));
              await txCur.wait();
              updateOneOldEnglish(id);
              setCancel(false);
            } catch (e) {
              console.log("cancel ask failed", e);
              setCancel(false);
            }
          }}
          onFinishFailed={onFinishFailed}
        >              
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={cancel}>
              Cancel Listing
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
          form={fillAskForm}
          layout={"inline"}
          name="fill ask "
          initialValues={{ 
            tokenId: id,
            //fillPrice: '',
            finderAddress: '',
            //value: (fillPrice * (10**18)).toString()
          }}
          onFinish={async values => {
            setFill(true);
            try {
              const txCur = await tx(writeContracts[zoraAsksContract].fillAsk(
                nftContractAddress,
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
              console.log("fill ask failed", e);
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
                message: "Who helped facilitate this sale",
              },
            ]}
          >
            <div>
              <Radio.Group>
                <Radio onClick={fillHandleClickFalse} value={""}>Reward the Finder</Radio>                
                <Radio onClick={fillHandleClickTrue} value={"0x0000000000000000000000000000000000000000"}>No Finder Involved</Radio>
              </Radio.Group>
              <Input
                placeholder={"Finder Wallet Address"}
                disabled={fillFinderIsDisabled}
              />
            </div>
          </Form.Item>        
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={fill}>
              Buy
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  return (
    <div className="OldEnglish">
      <div className="beforeTokenRender"> 
          <div style={{ fontSize: "5rem", marginBotton: 0, padding: 0, color: "#02A9EA" }}>
              LOST & FOUND
          </div>
          <div className="approvalManager" style={{ fontSize: "2rem", color: "#F0F66E" }}>
            <div className="pleaseApprove">
              ↓ Please Approve Marketplace Contracts ↓
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
              <div className="erc721Approved" style={{  }}>NFT TRANSFER HELPER APPROVED ✅ </div>
              ) : (
              <Button
              className="erc721ApprovalButton"   
              style= {{ backgroundColor: "#02A9EA", color: "#F0F8EA", border: "3px solid #FF4F75", fontSize: "1.25rem", height: "40px", borderRadius: 20  }}
                type="primary"
                onClick={async () => {
                  console.log("Clicked ERC721Transfer Button");
                  //console.log(readContracts[oldEnglishContract].name)
                  try {
                    const txCur = await tx(writeContracts[lostandfoundNFTContract].setApprovalForAll(
                      "0x029AA5a949C9C90916729D50537062cb73b5Ac92", //change to 'zoraTransferHelperContract'
                      true
                    ));
                    await txCur.wait();
                    updateOneOldEnglish();
                  } catch (e) {
                    console.log("ERC721Transfer HelperApproval Failed", e);
                  }
                }}
              >            
                APPROVE NFT TRANSFER HELPER
              </Button>
              )}
              {zoraModuleManagerApproved == true ? (
              <div className="zmmApproved">
                MARKETPLACE MODULE APPROVED ✅ 
              </div>              
              ) : (
              <Button
                className="zmmApprovalButton"
                style={{ backgroundColor: "#02A9EA", color: "#F0F8EA", border: "3px solid #FF4F75", fontSize: "1.25rem", height: "40px", borderRadius: 20 }}
                type="primary"
                onClick={async () => {
                  console.log("Clicked ZMM Button");
                  try {
                    const txCur = await tx(writeContracts[zmmContract].setApprovalForModule(
                      "0xA98D3729265C88c5b3f861a0c501622750fF4806", /// change to 'zoraAsksContract' 
                      true
                    ));
                    await txCur.wait();
                    updateOneOldEnglish();
                  } catch (e) {
                    console.log("ZORA Module Manager Approval Failed", e);
                  }
                }}
              >      
                APPROVE ZORA MARKETPLACE MODULE
              </Button>
              )}
              <Switch
                className="ownershipFilter"
                disabled={loadingOldEnglish}
                style={{ marginTop: "10px", height: "1.5rem" }}
                value={mine}
                onChange={() => {
                  setMine(!mine);
                  updateYourOldEnglish();
                }}
                checkedChildren="MY COLLECTION"
                unCheckedChildren="FULL COLLECTION"
              />
          </div>
      </div>
      {false ? (
        <Spin style={{ marginTop: 100}} />
      ) : (
        <div className="tokenRenderWrapper">
          <List
            className="tokenRender"
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 3,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            align="center" ///THIS IS WHAT ALIGNS ALL OF THE CARDS!!!!!!
            locale={{ emptyText: `waiting for OEs...` }}
            
            
            /* commenting out pagination

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

              //console.log(item.owner);
              //const nftOwner = await readContracts[lostandfoundNFTContract].ownerOf(id);
              //console.log(nftOwner);       
              return (
                <List.Item className="listItems" key={id}>
                  <Card
                    style={{ height: "auto" }}
                    title={
                      <div className="cardHeaders" >{item.name ? item.name + "   -   " + `LF #${id}` : `LF #${id}`}

                        
{/*     commenting out individual token refresh button                    
                        <Button
                          shape="circle"
                          onClick={() => {
                            updateOneOldEnglish(id);
                          }}
                          icon={<RedoOutlined />}
                        />
 */}

                      </div>

                    }
                  >
                    <a
                      href={`${blockExplorer}token/${
                        readContracts[lostandfoundNFTContract] && readContracts[lostandfoundNFTContract].address
                      }?a=${id}`}
                      target="_blank"
                    >
                      <img className="nftImage"src={imageWithGateway && imageWithGateway} alt={"OldEnglish #" + id} width="80%" />
                    </a>
                    <div className="cardFooters">                  
                      {
                      item.nftOwner == readContracts[lostandfoundNFTContract].address.toLowerCase() ? (
                        <div>{item.description}</div>
                      ) : (
                        <div>
                          <Address
                            address={item.nftOwner}
                            ensProvider={mainnetProvider}
                            blockExplorer={blockExplorer}
                            fontSize={16}
                          />
                          {/*
                          <div>                        
                          v1 List Price = {item.askSeller.askPrice.toString() / (10 ** 18)} ETH              
                          </div>
                          <div>
                          v1 Finder's Fee = {item.askSeller.findersFeeBps / 100} % 
                          </div>
                          */}
                        </div>
                      )}
                      { item.nftOwner == address.toLowerCase() ? ( /// logic asking if you are the owner
                          <>
                            {item.askSeller.seller == "0x0000000000000000000000000000000000000000" ? ( /// logic asking what to do if you are the owner and ask does NOT exist
                              <div>
                                <div>
                                  <div>
                                  ** NOT LISTED **
                                  </div>
                                  <div>
                                  PRICE : N/A
                                  </div>
                                  <div>
                                  FINDER'S FEE : N/A
                                  </div>
                                </div>
                                <div className="marketplaceManager">
                                  <Popover
                                    content={() => {                                                        
                                      return createAsk(id);
                                    }}
                                    title="Create Ask"
                                  >
                                    <Button style={{ borderRadius: 20, border: "1px solid black" }} type="primary">List</Button>
                                  </Popover>
                                  <Button disabled={true} style={{ borderRadius: 20, border: "1px solid black" }} type="primary">UPDATE</Button>
                                  <Button disabled={true} style={{ borderRadius: 20, border: "1px solid black" }} type="primary">CANCEL</Button>
                                  <Button disabled={true} style={{ borderRadius: 20, border: "1px solid black" }} type="primary">BUY</Button>
                                </div>
                              </div>
                              ) : ( ///logic asking if you are the owner and the ask DOES exist
                                <div>
                                  <div>
                                    <div>
                                    ** FOR SALE **
                                    </div>
                                    <div>                        
                                    PRICE : {item.askSeller.askPrice.toString() / (10 ** 18)} ETH
                                    </div>
                                    <div>
                                    FINDER'S FEE : {item.askSeller.findersFeeBps / 100} % 
                                    </div> 
                                  </div>
                                  <div className="marketplaceManager"> 
                                    <Button disabled={true} style={{ borderRadius: 20, border: "1px solid black" }} type="primary">LIST</Button>                                
                                    <Popover
                                      content={() => {                                                        
                                        return updateAskPrice(id);
                                      }}
                                      title="Update Ask"
                                    >
                                      <Button style={{ borderRadius: 20, border: "1px solid black" }} type="primary">UPDATE</Button>
                                    </Popover>
                                    <Popover
                                      content={() => {                                                        
                                        return cancelAsk(id);
                                      }}
                                      title="Cancel Ask"
                                    >
                                      <Button style={{ borderRadius: 20, border: "1px solid black" }} type="primary">CANCEL</Button>
                                    </Popover>
                                    <Button disabled={true} style={{ borderRadius: 20, border: "1px solid black" }} type="primary">BUY</Button>
                                  </div>                                                 
                                </div>
                              )}
                          </>
                        ) : ( /// logic asking what to do if not the owner
                        <>
                          {item.askSeller.seller == "0x0000000000000000000000000000000000000000" ? (  ///logic asking what to do if not owner and ask does NOT exist
                              <div>
                                <div>
                                  <div>
                                  ** NOT LISTED **
                                  </div>
                                  <div>
                                  PRICE : N/A
                                  </div>
                                  <div>
                                  FINDER'S FEE : N/A
                                  </div>
                                </div>
                                <div className="marketplaceManager">
                                  <Button disabled={true} style={{ borderRadius: 20, border: "1px solid black" }} type="primary">LIST</Button>
                                  <Button disabled={true} style={{ borderRadius: 20, border: "1px solid black" }} type="primary">UPDATE</Button>
                                  <Button disabled={true} style={{ borderRadius: 20, border: "1px solid black" }} type="primary">CANCEL</Button>
                                  <Button disabled={true} style={{ borderRadius: 20, border: "1px solid black" }} type="primary">BUY</Button>
                                </div>                                   
                              </div>                                                   
                            ) : ( 
                              <div>
                                <div>
                                  <div>
                                  ** FOR SALE **
                                  </div>
                                  <div>                        
                                  PRICE : {item.askSeller.askPrice.toString() / (10 ** 18)} ETH
                                  </div>
                                  <div>
                                  FINDER's FEE : {item.askSeller.findersFeeBps / 100} % 
                                  </div>
                                </div>
                                <div className="marketplaceManager">
                                  <Button disabled={true} style={{ borderRadius: 20, border: "1px solid black" }} type="primary">LIST</Button>
                                  <Button disabled={true} style={{ borderRadius: 20, border: "1px solid black" }} type="primary">UPDATE</Button>
                                  <Button disabled={true} style={{ borderRadius: 20, border: "1px solid black" }} type="primary">CANCEL</Button>                                    
                                  <Popover
                                    content={() => {                                                        
                                      return fillAsk(id);
                                    }}
                                    title="Fill Ask"
                                  >  
                                    <Button style={{ borderRadius: 20, border: "1px solid black" }} type="primary">BUY</Button>
                                  </Popover>
                                </div> 
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
