import { useState } from "react";
import { ethers, BigNumber } from "ethers";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import roboPunksNFT from "./RoboPunksNFT.json";
import { ConsoleSqlOutlined, LoadingOutlined } from '@ant-design/icons'
import { Spin, Row, Col } from "antd";
import logo from "./assets/background/trix_logo.png";
import orb from "./assets/background/orbes_amarelo.png"
import ERC721ABI from "./ERC721ABI.json"

var axios = require('axios');
const web3Provider1 = new ethers.providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/m8umOEv-BgiuBfFQJARY_V4gW3HORT1G")
const contractAddress = "0x7A3ba1B544C0349A378471A248A7F75faC95c06f"
const contract = new ethers.Contract(contractAddress, ERC721ABI, web3Provider1);
let contador;

const MaintMint = ({ accounts, setAccounts, proximo, setProximo }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const isConnected = Boolean(accounts[0]);
  const [isMinting, setIsMinting] = useState(false);
  const [confirmTrans, setConfirmTrans] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [NFTminted, setNFTsMinted] = useState("Na");
  const [tamanho, setTamanho] = useState("80vh")
  const [naoPossuiCarteira, setNaoPossuiCarteira] = useState(false)
  const [erroHandler, setErroHandler] = useState(false)

    async function connectAccount(){
      if(window.ethereum) {
          const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
          });
      setAccounts(accounts);
      setTamanho("100vh")
      setProximo(true)
      }

  }

  async function criarCarteira() {
    setTamanho("100vh")
    setProximo(true)
    setNaoPossuiCarteira(true)
  }

  async function contadorNFTs() {
    if (contador != 1) {
    var config = {
      method: 'post',
      url: 'https://parseapi.back4app.com/functions/nftsmintados',
      headers: { 
        'X-Parse-Application-Id': 'cACXAALjoAERRdB7jMAPSvMwBAfv7MC2yebDYxSw', 
        'X-Parse-REST-API-Key': 'iDcYvliNQkyCRm0L52ca2ghI85cyVNa9zAYI6Xus', 
        'Content-Type': 'application/json'
      },
    };
    
    await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(Number(response.data.result.hex)));
      setNFTsMinted(2500 - Number(response.data.result.hex))
      contador = 1
    })}
  }
  contadorNFTs();

  //OUVINDO O CONTRATO - QUANTOS NFTS FORAM CRIADOS:
  contract.on("NFTMinted", (id, category, uri) => {
    let info = {
      id: id,
      category: category,
      uri: uri
    };
    let nfts = 2500 - Number(id)
    setNFTsMinted(nfts)
  })

  async function handleConfirmacaoCompra() {
    setIsMinting(true)
    var config = {
      method: 'post',
      url: 'https://parseapi.back4app.com/functions/nftsmintados',
      headers: { 
        'X-Parse-Application-Id': 'cACXAALjoAERRdB7jMAPSvMwBAfv7MC2yebDYxSw', 
        'X-Parse-REST-API-Key': 'iDcYvliNQkyCRm0L52ca2ghI85cyVNa9zAYI6Xus', 
        'Content-Type': 'application/json'
      },
    };
    
    let cont;
    await axios(config).then(function (response) {
      cont = Number(response.data.result.hex)
    })

    if (cont <= 10) {
      if (naoPossuiCarteira == true){
        chamadaAPINoMetamask()
      }

      else{chamadaAPI()}
    }
    else{
      setErroHandler(true)
    }
  }

  async function chamadaAPINoMetamask() {
    //e.preventDefault();
    setIsMinting(true)

    var data = JSON.stringify({
      "quantity": mintAmount.toString(),
      "name": title,
      "email": body
    });
    
    var config = {
      method: 'post',
      url: 'https://parseapi.back4app.com/functions/swapPixNoMetamask',
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
    if (mintAmount >= 100) return;
    setMintAmount(mintAmount + 1);
  };


  if (erroHandler == true) {
    return(<div fontFamily={"Poppins, sans-serif;"} >
    <h1 style={{fontFamily: "Poppins, sans-serif", fontSize: "70px", marginTop: "150px"}}> Ops... algum erro aconteceu, atualize a página. </h1>
  </div>)
  }

  if (isMinting == true){
    return(<div fontFamily={"Poppins, sans-serif;"} >
      <h1 style={{fontFamily: "Poppins, sans-serif", fontSize: "100px", marginTop: "150px"}}> Carregando </h1>
      <span><Spin indicator={<LoadingOutlined style={{ fontSize: 200 }} spin />} /></span>
    </div>)}

  if (confirmTrans == true && naoPossuiCarteira == false) {
    return (
      <Flex justify="center" align="center" height="100vh" paddingBottom="350px" lineHeight="50px" fontFamily={"Poppins, sans-serif;"}>
        <Box width="1200px">
          <h1>Você irá realizar a mintagem de {mintAmount} TBT NFT(s) para a carteira {userAddress} na rede Polygon</h1>
          <h1>Por favor, certifique-se de que inseriu um email válido para que possamos enviar a confirmação de compra do seu NFT e de como visualizá-lo.</h1>
          <h2>Total de R$0,01</h2>
          <Button
          backgroundColor="red"
          borderRadius="15px"
          boxShadow={"0px 3px 6px #00000029;"}
          border={"2px solid red;"}
          color="white"
          cursor="pointer"
          id="buttonCancelar"
          padding="15px"
          margin="0 15px"
          width={"280px"}
          fontSize='21px'
          fontWeight={'900'}
          fontFamily='Poppins, sans-serif;'
          height={"66px"}
          onClick={cancel}
            >
              CANCELAR
            </Button>
          <Button
            backgroundColor="#1EE0FF"
            borderRadius="15px"
            boxShadow={"0px 3px 6px #00000029;"}
            border={"2px solid #1EE0FF;"}
            color="white"
            cursor="pointer"
            padding="15px"
            margin="0 15px"
            width={"280px"}
            id="buttonID"
            fontSize='21px'
            fontWeight={'900'}
            fontFamily='Poppins, sans-serif;'
            height={"66px"}
            onClick={handleConfirmacaoCompra}
            >
              CONFIRMAR
            </Button>
        </Box>
    </Flex>

    )}

    if (confirmTrans == true && naoPossuiCarteira == true) {
      return (
        <Flex justify="center" align="center" height="100vh" paddingBottom="350px" lineHeight="50px" fontFamily={"Poppins, sans-serif;"}>
          <Box width="1200px">
            <h1>Você irá realizar a mintagem de {mintAmount} TBT NFT(s)</h1>
            <h1>Criaremos uma carteira Polygon para você poder acessar seus NFTs</h1>
            <h1>Por favor, certifique-se de que {body} é um email válido e de que apenas você tenha acesso, por ele enviaremos as informações de como acessar a sua nova carteira.</h1>
            <h2>Total de R$0,01</h2>
            <Button
            backgroundColor="red"
            borderRadius="15px"
            boxShadow={"0px 3px 6px #00000029;"}
            border={"2px solid red;"}
            color="white"
            cursor="pointer"
            id="buttonCancelar"
            padding="15px"
            margin="0 15px"
            width={"280px"}
            fontSize='21px'
            fontWeight={'900'}
            fontFamily='Poppins, sans-serif;'
            height={"66px"}
            onClick={cancel}
              >
                CANCELAR
              </Button>
            <Button
              backgroundColor="#1EE0FF"
              borderRadius="15px"
              boxShadow={"0px 3px 6px #00000029;"}
              border={"2px solid #1EE0FF;"}
              color="white"
              cursor="pointer"
              padding="15px"
              margin="0 15px"
              width={"280px"}
              id="buttonID"
              fontSize='21px'
              fontWeight={'900'}
              fontFamily='Poppins, sans-serif;'
              height={"66px"}
              onClick={handleConfirmacaoCompra}
              >
                CONFIRMAR
              </Button>
          </Box>
      </Flex>
  
      )}


  return (
    <Flex justify="center" align="center" height={tamanho} paddingBottom="1px">
      <Box width="1200px">
        <div>
          <img src={logo} width="274px" height="122px" marginBottom="-100px" paddingBottom="0" marginTop="100px"/>
          <div><img src={orb}  width="350px" height="350px" marginBottom="0px"  paddingBottom="0px" marginTop="-50px" style={{opacity: '1'}}/>
          {isConnected || naoPossuiCarteira ? (
          <div>
            <Text
              fontSize="25px"
              fontWeight={"900"}
              color="#1EE0FF"
              fontFamily='Poppins, sans-serif;'
              marginBottom="0px"
              paddingBottom="0px"
              marginTop="-40px"
            >
              ORBE BOM
            </Text>
            <Text
              fontSize="16px"
              fontFamily='Poppins, sans-serif;'
              marginBottom="30px"
              marginTop="0px"
            >
              R$200,00
            </Text>
          </div>
          ):(
          <Text
            fontSize="18px"
            fontFamily='Poppins, sans-serif;'
          >
            Faltam {NFTminted} NFTs founders a serem mintados.
          </Text>)
          }

          </div>
        </div>

        {isConnected || naoPossuiCarteira ? (
          <div>
            <form style={{fontFamily:"Poppins, sans-serif"}}>
                <input 
                  id="inputID"
                  type="text" 
                  required
                  placeholder="Nome" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "326px", 
                  height:"55px", 
                  border: "2px solid #7F33A8", 
                  boxShadow: "0px 3px 6px #00000029", 
                  borderRadius: "15px", 
                  backgroundColor: "transparent", 
                  fontSize:"21px", 
                  color:"#fff", 
                  textShadow:"0px 3px 6px #00000029", 
                  letterSpacing:"2.1px",
                  paddingLeft:"33px"}}
                />
                <div>
                <div>
                  <input 
                  type="email"
                  id="inputID" 
                  required 
                  placeholder="Email"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  style={{ width: "326px", 
                  height:"55px", 
                  marginTop:"15px",
                  border: "2px solid #7F33A8", 
                  boxShadow: "0px 3px 6px #00000029", 
                  borderRadius: "15px", 
                  backgroundColor: "transparent", 
                  fontSize:"21px", 
                  color:"#fff", 
                  textShadow:"0px 3px 6px #00000029", 
                  letterSpacing:"2.1px",
                  paddingLeft:"33px"}}
                />
                </div>
                </div>
            </form>
            <Flex justify="center" align="center">
              <Button
                backgroundColor="#7F33A8"
                borderRadius="15px"
                boxShadow="0px 3px 6px #00000029"
                border= "2px solid #7F33A8"
                color= "#3C1153"
                fontWeight= "900"
                cursor="pointer"
                fontSize="50px"
                fontFamily="Poppins, sans-serif"
                height="55px"
                width="83px"
                paddingBottom="15px"
                marginTop="15"
                marginRight="12px"
                onClick={handleDecrement}
              >
                {" "}
                -
              </Button>

              <Input
                readOnly
                fontFamily="Poppins, sans-serif"
                textAlign="center"
                id="inputID"
                type="number"
                style={{ width: "136px", 
                height:"55px", 
                marginTop:"15px",
                border: "2px solid #7F33A8", 
                boxShadow: "0px 3px 6px #00000029", 
                borderRadius: "15px", 
                backgroundColor: "transparent", 
                fontSize:"21px", 
                color:"#fff", 
                textShadow:"0px 3px 6px #00000029", 
                letterSpacing:"2.1px",
                paddingLeft:"20px"}}
                value={mintAmount}
              />

              <Button
                backgroundColor="#7F33A8"
                borderRadius="15px"
                boxShadow="0px 3px 6px #00000029"
                border= "2px solid #7F33A8"
                color= "#3C1153"
                fontWeight= "900"
                cursor="pointer"
                fontSize="50px"
                fontFamily="Poppins, sans-serif"
                height="55px"
                width="83px"
                marginTop="15"
                marginLeft="12px"
                onClick={handleIncrement}
              >
                {" "}
                +
              </Button>
            </Flex>

            <Button
              backgroundColor="#1EE0FF"
              borderRadius="15px"
              boxShadow={"0px 3px 6px #00000029;"}
              border={"2px solid #1EE0FF;"}
              color="white"
              cursor="pointer"
              padding="15px"
              margin="30px 15px"
              width={"326px"}
              fontSize='21px'
              fontWeight={'900'}
              fontFamily='Poppins, sans-serif;'
              height={"55px"}
              letterSpacing="2.1px"
              onClick={handleMint}
            >
              MINTAR NFT
            </Button>
          </div>
        ) : (
          <div style={{marginTop: "100px", marginBottom: "-125px"}}>
          <Button 
          backgroundColor="#1EE0FF"
          borderRadius="15px"
          boxShadow={"0px 3px 6px #00000029;"}
          border={"2px solid #1EE0FF;"}
          color="white"
          cursor="pointer"
          padding="15px"
          width={"326px"}
          id={"buttonID"}
          fontSize='21px'
          fontWeight={'900'}
          fontFamily='Poppins, sans-serif;'
          height={"66px"}
          onClick={connectAccount}
          >CONECTAR CARTEIRA</Button>
          <Button 
          backgroundColor="transparent"
          borderRadius="15px"
          boxShadow={"0px 3px 6px #00000029;"}
          border={"2px solid #1EE0FF;"}
          color="white"
          cursor="pointer"
          marginLeft={"15px"}
          padding="15px"
          id={"buttonID"}
          width={"326px"}
          fontSize='21px'
          fontWeight={'600'}
          fontFamily='Poppins, sans-serif;'
          height={"66px"}
          onClick={criarCarteira}
          >CRIAR UMA CARTEIRA</Button>
          </div>
        )}

      </Box>
    </Flex>
  );
};

export default MaintMint;
