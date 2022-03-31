import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Popover, Form, Switch, Input } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { Address, AddressInput } from "../components";
import { useDebounce } from "../hooks";
import { ethers } from "ethers";
import { useEventListener } from "eth-hooks/events/useEventListener";

//========== ZORA IMPORTS
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/4.json"; // Rinkeby addresses, 1.json would be Rinkeby Testnet 
import { IERC721__factory } from "@zoralabs/v3/dist/typechain/factories/IERC721__factory";
import { IERC20__factory } from "@zoralabs/v3/dist/typechain/factories/IERC20__factory";
import { ZoraModuleManager__factory } from "@zoralabs/v3/dist/typechain/factories/ZoraModuleManager__factory";
import { AsksV11__factory } from "@zoralabs/v3/dist/typechain/factories/AsksV11__factory";



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
  zmmContract
}) {
  const [allOldEnglish, setAllOldEnglish] = useState({});
  const [loadingOldEnglish, setLoadingOldEnglish] = useState(true);
  const perPage = 12;
  const [page, setPage] = useState(0);

  const fetchMetadataAndUpdate = async id => {
    try {
      const tokenURI = await readContracts[oldEnglishContract].tokenURI(id);
      const jsonManifestString = atob(tokenURI.substring(29));

      try {
        const jsonManifest = JSON.parse(jsonManifestString);
        const collectibleUpdate = {};
        collectibleUpdate[id] = { id: id, uri: tokenURI, ...jsonManifest };

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



            <Input placeholder={"Token ID # of NFT to List"}/>
            <Input placeholder={"List Price (in ETH)"}/>
            <Input placeholder={"Wallet Address to receive funds from sale (full address not ENS name)"}/>
            <Input placeholder={"Finder's Fee %"}/>
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
            <Input placeholder={"Token ID # of NFT to List"}/>
            <Input placeholder={"List Price (in ETH)"}/>
            <Input placeholder={"Wallet Address to receive funds from sale (full address not ENS name)"}/>
            <Input placeholder={"Finder's Fee %"}/>
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

  //=====MY CUSTOM FUNCTIONALITY

  const [zoraCreateAskForm] = Form.useForm();
  const createAsk = id => {
    const [createAsk, setCreateAsk] = useState(false);

    return (
      <div>
        <Form
          form={zoraCreateAskForm}
          layout={"inline"}
          name="Create Ask"
          initialValues={{ tokenId: id }}
          onFinish={async values => {
            setCreateAsk(true);
            try {
              const txCur = await tx(writeContracts[oldEnglishContract]["pour"](id, values["to"]));
              await txCur.wait();
              updateOneOldEnglish(id);
              setCreateAsk(false);
            } catch (e) {
              console.log("pour failed", e);
              setCreateAsk(false);
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
            <Input placeholder={"Token ID # of NFT to List"}/>
            <Input placeholder={"List Price (in ETH)"}/>
            <Input placeholder={"Wallet Address to receive funds from sale (full address not ENS name)"}/>
            <Input placeholder={"Finder's Fee %"}/>
            <AddressInput ensProvider={mainnetProvider} placeholder={"to address"} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createAsk}>
              Create Ask
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const [zoraUpdateAskForm] = Form.useForm();
  const updateAsk = id => {
    const [updateAsk, setUpdateAsk] = useState(false);

    return (
      <div>
        <Form
          form={zoraUpdateAskForm}
          layout={"inline"}
          name="Update Ask"
          initialValues={{ tokenId: id }}
          onFinish={async values => {
            setUpdateAsk(true);
            try {
              const txCur = await tx(writeContracts[oldEnglishContract]["pour"](id, values["to"]));
              await txCur.wait();
              updateOneOldEnglish(id);
              setUpdateAsk(false);
            } catch (e) {
              console.log("pour failed", e);
              setUpdateAsk(false);
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
            <Input placeholder={"Token ID # of NFT to List"}/>
            <Input placeholder={"List Price (in ETH)"}/>
            <Input placeholder={"Wallet Address to receive funds from sale (full address not ENS name)"}/>
            <Input placeholder={"Finder's Fee %"}/>
            <AddressInput ensProvider={mainnetProvider} placeholder={"to address"} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={updateAsk}>
              Update Ask
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const [zoraCancelAskForm] = Form.useForm();
  const cancelAsk = id => {
    const [cancelAsk, setCancelAask] = useState(false);

    return (
      <div>
        <Form
          form={zoraCancelAskForm}
          layout={"inline"}
          name="Update Ask"
          initialValues={{ tokenId: id }}
          onFinish={async values => {
            setCancelAsk(true);
            try {
              const txCur = await tx(writeContracts[oldEnglishContract]["pour"](id, values["to"]));
              await txCur.wait();
              updateOneOldEnglish(id);
              setCancelAsk(false);
            } catch (e) {
              console.log("pour failed", e);
              setCancelAsk(false);
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
            <Input placeholder={"Token ID # of NFT to List"}/>
            <Input placeholder={"List Price (in ETH)"}/>
            <Input placeholder={"Wallet Address to receive funds from sale (full address not ENS name)"}/>
            <Input placeholder={"Finder's Fee %"}/>
            <AddressInput ensProvider={mainnetProvider} placeholder={"to address"} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={cancelAsk}>
              Cancel Ask
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const [zoraFillAskForm] = Form.useForm();
  const fillAsk = id => {
    const [fillAsk, setFillAsk] = useState(false);

    return (
      <div>
        <Form
          form={zoraFillAskForm}
          layout={"inline"}
          name="Update Ask"
          initialValues={{ tokenId: id }}
          onFinish={async values => {
            setFillAsk(true);
            try {
              const txCur = await tx(writeContracts[oldEnglishContract]["pour"](id, values["to"]));
              await txCur.wait();
              updateOneOldEnglish(id);
              setFillAsk(false);
            } catch (e) {
              console.log("pour failed", e);
              setFillAsk(false);
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
            <Input placeholder={"Token ID # of NFT to List"}/>
            <Input placeholder={"List Price (in ETH)"}/>
            <Input placeholder={"Wallet Address to receive funds from sale (full address not ENS name)"}/>
            <Input placeholder={"Finder's Fee %"}/>
            <AddressInput ensProvider={mainnetProvider} placeholder={"to address"} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={fillAsk}>
              Fill Ask
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
                return updateAllOldEnglish();
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
                    "0x029AA5a949C9C90916729D50537062cb73b5Ac92",
                    false
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
                    "0xA98D3729265C88c5b3f861a0c501622750fF4806",
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
                      </div>
                    )}
                    {address && item.owner == address.toLowerCase() && (
                      <>
                        {item.attributes[0].value < 13 ? (
                          <>
                            {/*
                            <Button
                              type="primary"
                              onClick={async () => {
                                try {
                                  const txCur = await tx(writeContracts[oldEnglishContract].sip(id));
                                  await txCur.wait();
                                  updateOneOldEnglish(id);
                                } catch (e) {
                                  console.log("sip failed", e);
                                }
                              }}
                            >
                              Sip
                            </Button>
                            <Popover
                              content={() => {
                                return pour(id);
                              }}
                              title="Pour OE"
                            >
                              <Button type="primary">Pour</Button>
                            </Popover>
                            */}
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
                                return createAsk(id);
                              }}
                              title="Update Ask"
                            >
                              <Button type="primary">Update</Button>
                            </Popover>
                            <Popover
                              content={() => {
                                return cancelAsk(id);
                              }}
                              title="Cancel Ask"
                            >
                              <Button type="primary">Cancel</Button>
                            </Popover>
                            <Popover
                              content={() => {
                                return fillAsk(id);
                              }}
                              title="Fill Ask"
                            >
                              <Button type="primary">Buy</Button>
                            </Popover>
                          </>
                        ) : (
                          <Button
                            type="primary"
                            onClick={async () => {
                              try {
                                const txCur = await tx(writeContracts[oldEnglishContract].recycle(id));
                                await txCur.wait();
                                updateOneOldEnglish(id);
                              } catch (e) {
                                console.log("recycle failed", e);
                              }
                            }}
                          >
                            Recycle
                          </Button>
                        )}
                        {/*
                        <Button
                          type="primary"
                          onClick={async () => {
                            try {
                              const txCur = await tx(writeContracts[oldEnglishContract].wrap(id));
                              await txCur.wait();
                              updateOneOldEnglish(id);
                            } catch (e) {
                              console.log("wrap failed", e);
                            }
                          }}
                        >
                          Wrap
                        </Button>
                        <Popover
                          content={() => {
                            return sendForm(id);
                          }}
                          title="Pass it:"
                        >
                          <Button type="primary">Pass it!</Button>
                        </Popover>
                        */}
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
