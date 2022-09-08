import { useState } from "react";
import { ethers, BigNumber } from "ethers";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import roboPunksNFT from "./RoboPunksNFT.json";
import { ConsoleSqlOutlined, LoadingOutlined } from '@ant-design/icons'
import { Spin, Row, Col } from "antd";
var axios = require('axios');


const MaintMint = ({ accounts, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const isConnected = Boolean(accounts[0]);
  const [isMinting, setIsMinting] = useState(false);
  const [confirmTrans, setConfirmTrans] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  async function chamadaAPI() {
    //e.preventDefault();
    setIsMinting(true)
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider)
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      var data = JSON.stringify({
        "quantity": mintAmount.toString(),
        "metamask": address,
        "name": title,
        "email": body
      });
      
      var config = {
        method: 'post',
        url: 'https://parseapi.back4app.com/functions/swapPix',
        headers: { 
          'X-Parse-Application-Id': 'cACXAALjoAERRdB7jMAPSvMwBAfv7MC2yebDYxSw', 
          'X-Parse-REST-API-Key': 'iDcYvliNQkyCRm0L52ca2ghI85cyVNa9zAYI6Xus', 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data.result.charge.paymentLinkUrl));
        window.location.replace(response.data.result.charge.paymentLinkUrl);
      })
      .catch(function (error) {
        console.log(error);
      });

    }


  }

  function cancel() {
    setConfirmTrans(false)
  }

  async function handleMint() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider)
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      await setUserAddress(address);
      if(body.includes("@") && title !== '' && body.includes(".")){
      console.log(accounts[0])
      setConfirmTrans(true)}
      
            /*
      const contract = new ethers.Contract(
        roboPunksNFTAddress,
        roboPunksNFT.abi,
        signer
      );
      try {
        const response = await contract.mint(BigNumber.from(mintAmount), {
            value: ethers.utils.parseEther((0.02 * mintAmount).toString()),
        });
        console.log("response: ", response);
      } catch (err) {
        console.log("error: ", err);
      }
      */
     if(body.includes("@") == false || body.includes(".") == false){
      alert("Por favor, ensira um e-mail válido")
     }
     if(body == '' || title == ''){
      alert("Por favor, preencha todos os campos")
     }
    }
  }

  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };

  if (isMinting == true){
    return(<div>
      <h1>Carregando </h1>
      <span><Spin indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />} /></span>
    </div>)}

  if (confirmTrans == true) {
    return (
      <Flex justify="center" align="center" height="100vh" paddingBottom="350px" lineHeight="50px">
        <Box width="1200px">
          <h1>Você irá realizar a mintagem de {mintAmount} TBT NFT(s) para a carteira {userAddress}</h1>
          <h2>Total de R$0,01</h2>
          <Button
              backgroundColor="red"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0F0F0F"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              margin="10"
              onClick={cancel}
            >
              Cancelar
            </Button>
          <Button
              backgroundColor="#008fd4"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0F0F0F"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              margin="10"
              onClick={chamadaAPI}
            >
              Confirmar
            </Button>
        </Box>
    </Flex>


    )
  }
  return (
    <Flex justify="center" align="center" height="100vh" paddingBottom="350px">
      <Box width="1200px">
        <div>
          <Text fontSize="48px" textShadow="0 5px #000000">
            Trix Battle Tactics NFT
          </Text>
          <Text
            fontSize="30px"
            letterSpacing="-5.5%"
            fontFamily="VT323"
            textShadow="0 2px 2px #000000"
          >
            Minte o NFT com a sua metamask.
          </Text>
        </div>

        {isConnected ? (
          <div>
            <form>
                <input 
                  type="text" 
                  required
                  placeholder="Nome" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "300px", height:"35px", fontFamily: "inherit"}}
                />
                <div>
                <div>
                  <input 
                  type="email" 
                  required 
                  placeholder="Email"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  style={{ width: "300px", height:"35px", fontFamily: "inherit", marginTop: "15px"}}
                />
                </div>
                </div>
            </form>
            <Flex justify="center" align="center">
              <Button
                backgroundColor="#008fd4"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                margin="10"
                onClick={handleDecrement}
              >
                {" "}
                -
              </Button>

              <Input
                readOnly
                fontFamily="inherit"
                width="200px"
                height="40px"
                textAlign="center"
                paddingLeft="19px"
                marginTop="10px"
                type="number"
                value={mintAmount}
              />

              <Button
                backgroundColor="#008fd4"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                margin="10"
                onClick={handleIncrement}
              >
                {" "}
                +
              </Button>
            </Flex>

            <Button
              backgroundColor="#008fd4"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0F0F0F"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              margin="10"
              onClick={handleMint}
            >
              Mintar {mintAmount} NFT
            </Button>
          </div>
        ) : (
          <Text
            marginTop="70px"
            fontSize="30px"
            letterSpacing="5.5%"
            fontFamily="VT323"
            textShadow="0 3px #000000"
            color="#008fd4"
          >
            Connect your wallet to mint.
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default MaintMint;
