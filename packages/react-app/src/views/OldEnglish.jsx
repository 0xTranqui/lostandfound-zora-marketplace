import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Popover, Form, Switch, Input, Radio, Select, Cascader, DatePicker, InputNumber, TreeSelect } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { Address, AddressInput } from "../components";
import { useDebounce } from "../hooks";
import { ethers } from "ethers";
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
  balance,
  startBlock,
  ///=======my custom imports
  zoraTransferHelperContract,
  zmmContract,
  zoraAsksContract,
  lostandfoundNFTContract
  ///=======my custom imports
}) {
  const [allOldEnglish, setAllOldEnglish] = useState({});
  const [loadingOldEnglish, setLoadingOldEnglish] = useState(true);
  const perPage = 12;
  const [page, setPage] = useState(0);
  
  //====my custom addition
  const nftContractAddress = "0x03D6563e2047534993069F242181B207f80C5dD9"; //oldenglish
  
  ///this allows you to query the current ask for any given NFt. if no current ask, seller = 0 address
  //const seller = useContractReader(readContracts, zoraAsksContract, "askForNFT", [nftContractAddress, 3]);
  //const seller2 = readContracts()
  //const specificSeller = seller["seller"];
  //===MY SOON TO BE ADDED custom functionality to retrieve state of Asks for each NFT
  
  const fetchMetadataAndUpdate = async id => {
    try {
      const tokenURI = await readContracts[oldEnglishContract].tokenURI(id);
      const jsonManifestString = atob(tokenURI.substring(29));

      //===CUSTOM UPDATE
      const seller = await readContracts[zoraAsksContract].askForNFT(nftContractAddress, id);
      //===CUSTOM UPDATE

      try {
        const jsonManifest = JSON.parse(jsonManifestString);
        const collectibleUpdate = {};

        //===CUSTOM UPDATE, added askSeller: seller as a key:value pair
        collectibleUpdate[id] = { id: id, uri: tokenURI, askSeller: seller, ...jsonManifest, ...specificSeller };

        setAllOldEnglish(i => ({ ...i, ...collectibleUpdate }));
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  };


  const updateAllOldEnglish = async () => {
    if (readContracts[oldEnglishContract] && totalSupply /*&& totalSupply <= receives.length*/) {
      setLoadingOldEnglish(true);
      let numberSupply = totalSupply.toNumber();

      let tokenList = Array(numberSupply).fill(0);

      tokenList.forEach((_, i) => {
        let tokenId = i + 1;
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
    if (readContracts[oldEnglishContract] && totalSupply) {
      fetchMetadataAndUpdate(id);
    }
  };

  useEffect(() => {
    if (totalSupply && totalSupply.toNumber() > 0) updateAllOldEnglish();
  }, [readContracts[oldEnglishContract], (totalSupply || "0").toString(), page]);

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

  let filteredOEs = Object.values(allOldEnglish).sort((a, b) => b.id - a.id);
  const [mine, setMine] = useState(false);
  if (mine == true && address && filteredOEs) {
    filteredOEs = filteredOEs.filter(function (el) {
      return el.owner == address.toLowerCase();
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
            <Input
            placeholder={"Finders Fee BPS in %"}
            />
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

    //0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170

    return (
      <div>
        <Form
          form={fillAskForm}
          layout={"inline"}
          name="fill ask "
          initialValues={{ 
            tokenId: id,
            fillPrice: '',
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
                ethers.utils.parseUnits(values['fillPrice'], 'ether'),
                values['finderAddress'],
                { value: (values['fillPrice'] * (10 ** 18)).toString() }
                //values['value']
              ));
              await txCur.wait();
              updateOneOldEnglish(id);
              setFill(false);
            } catch (e) {
              console.log("fill sk failed", e);
              setFill(false);
            }
          }}
          onFinishFailed={onFinishFailed}
        >            
          <Form.Item
            name="fillPrice"
            rules={[
              {
                required: true,
                message: "How much are you purchasing this NFT for??",
              },
            ]}
          >
            <Input
            placeholder={"Purchase Price (ETH): "}
            />
          </Form.Item>         
          <Form.Item
            name="finderAddress"
            rules={[
              {
                required: false,
                message: "Who helped facilitate this sale",
              },
            ]}
          >
            <Input
            placeholder={"Finder address (Full Wallet Address):"}
            />
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

  



// Imports + declartions for ZORA Approval Contracts
  const erc721TransferHelperAddress = mainnetZoraAddresses.ERC721TransferHelper;
  const moduleManagerAddress = mainnetZoraAddresses.ZoraModuleManager;
  const asksModuleV1_1Address = mainnetZoraAddresses.AsksV1_1;
  const oldEnglishContractAddress = "0x03D6563e2047534993069F242181B207f80C5dD9";
  const lostandfoundContractAddress = "0x0E0e37De35471924F50598d55F7b69f93703fA01";




  return (
    <div style={{ width: "auto", margin: "auto", paddingBottom: 25, minHeight: 800 }}>
      {false ? (
        <Spin style={{ marginTop: 100 }} />
      ) : (
        <div>
          <div style={{ marginBottom: 5 }}>
            <Button
              onClick={() => {
                {
                  updateAllOldEnglish(),
                  updateAllAsks();
                }
              }}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              onClick={async () => {
                console.log("Clicked ERC721Transfer Button");
                try {
                  const txCur = await tx(writeContracts[oldEnglishContract].setApprovalForAll(
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
              APPROVE ERC721 TRANSFER HELPER
            </Button>
            <Button
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
              APPROVE ZORA MODULE MANAGER
            </Button>
            <Switch
              disabled={loadingOldEnglish}
              style={{ marginLeft: 5 }}
              value={mine}
              onChange={() => {
                setMine(!mine);
                updateYourOldEnglish();
              }}
              checkedChildren="mine"
              unCheckedChildren="all"
            />
          </div>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 4,
            }}
            locale={{ emptyText: `waiting for OEs...` }}
            pagination={{
              total: mine ? filteredOEs.length : totalSupply,
              defaultPageSize: perPage,
              defaultCurrent: page,
              onChange: currentPage => {
                setPage(currentPage - 1);
                console.log(currentPage);
              },
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${mine ? filteredOEs.length : totalSupply} items`,
            }}
            loading={loadingOldEnglish}
            dataSource={filteredOEs ? filteredOEs : []}
            renderItem={item => {
              const id = item.id;              
              return (
                <List.Item key={id}>
                  <Card
                    title={
                      <div>
                        <span style={{ fontSize: 18, marginRight: 8 }}>{item.name ? item.name : `OE #${id}`}</span>
                        <Button
                          shape="circle"
                          onClick={() => {
                            updateOneOldEnglish(id);
                          }}
                          icon={<RedoOutlined />}
                        />
                      </div>
                    }
                  >
                    <a
                      href={`${blockExplorer}token/${
                        readContracts[oldEnglishContract] && readContracts[oldEnglishContract].address
                      }?a=${id}`}
                      target="_blank"
                    >
                      <img src={item.image && item.image} alt={"OldEnglish #" + id} width="100" />
                    </a>
                    {item.owner &&
                    item.owner.toLowerCase() == readContracts[oldEnglishContract].address.toLowerCase() ? (
                      <div>{item.description}</div>
                    ) : (
                      <div>
                        <Address
                          address={item.owner}
                          ensProvider={mainnetProvider}
                          blockExplorer={blockExplorer}
                          fontSize={16}
                        />
                        <div>
                        Seller = {item.askSeller.seller.substring(0, 5) + '...' +item.askSeller.seller.substring(37, 42) }                           
                        </div>
                        <div>                        
                        List Price = {item.askSeller.askPrice.toString() / (10 ** 18)} ETH              
                        </div>
                        <div>
                        Finder's Fee = {item.askSeller.findersFeeBps / 100} % 
                        </div>
                      </div>
                    )}
                    {address && item.owner == address.toLowerCase() ? (
                        <>
                          <Popover
                            content={() => {
                              return createAsk(id);
                            }}                            
                            title="Create Ask"
                          >
                            <Button type="primary">List</Button>
                          </Popover>
                          <Popover
                            content={() => {
                              return updateAskPrice(id);
                            }}
                            title="Update Listing Price"
                          >
                            <Button type="primary">Update Listing</Button>
                          </Popover>
                          <Popover
                            content={() => {
                              return cancelAsk(id);
                            }}
                            title="Cancel Listing"
                          >
                            <Button type="primary"
                            >Cancel Listing</Button>
                          </Popover>
                        </>
                      ) : (
                      <>
                        {"fam" != "0x0000000000000000000000000000000000000000" ? (
                            <Popover
                              content={() => {                                
                                return fillAsk(id);
                              }}
                              title="Fill Ask"
                            >
                              <Button type="primary">Buy</Button>
                            </Popover>
                          ) : ( 
                            <div>~ No Active Listing ~</div>
                        )}
                        
                      </>
                    )}
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
