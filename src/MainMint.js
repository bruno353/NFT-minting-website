import { useState } from "react";
import { ethers, BigNumber } from "ethers";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import roboPunksNFT from "./RoboPunksNFT.json";
import { ConsoleSqlOutlined, LoadingOutlined } from '@ant-design/icons'
import { Spin, Row, Col } from "antd";
import logo from "./assets/background/trix_logo.png";
import orb from "./assets/background/orbes_azul.png"
import orbVioleta from "./assets/background/orbes_violeta.png"
import recolher from "./assets/background/but_recolher.png"
import ERC721ABI from "./ERC721ABI.json"
import {useRef} from 'react';

var axios = require('axios');
const web3Provider1 = new ethers.providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/m8umOEv-BgiuBfFQJARY_V4gW3HORT1G")
const contractAddress = "0x4093b3920c9a1C41794E43597439eDb9C5E878f5"
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
  const [tamanho, setTamanho] = useState("90vh")
  const [naoPossuiCarteira, setNaoPossuiCarteira] = useState(false)
  const [erroHandler, setErroHandler] = useState(false)
  const [founderMintIsOver, setFounderMintIsOver] = useState(false)
  const [orbName, setOrbName] = useState("ORBE GÊNESIS")
  const [orbCategory, setOrbCategory] = useState(1)
  const [quantidadeUSD, setQuantidadeUSD] = useState("")

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
      setNFTsMinted(25 - Number(response.data.result.hex))
      if(Number(response.data.result.hex) == 25){
        setFounderMintIsOver(true)
        setOrbName("ORBE INTERDIMENSIONAL")
        setOrbCategory(2)
      }
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
    let nfts = 25 - Number(id)
    if(Number(id) == 25){
      setFounderMintIsOver(true)
      setOrbName("ORBE INTERDIMENSIONAL")
      setOrbCategory(2)
    }
    setNFTsMinted(nfts)
  })

  async function handleConfirmacaoCompra() {
    setIsMinting(true)

    //primeira chamada para verificar se ainda existem nfts:
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


    if (25 - cont < mintAmount && orbName == "ORBE GÊNESIS") {
      setErroHandler(true)
      return
    }
    if (cont < 25 || orbName == "ORBE INTERDIMENSIONAL") {
      if (naoPossuiCarteira == true){
        await chamadaAPINoMetamask()
        return
      }
      if(naoPossuiCarteira == false){
      await chamadaAPI()
      return}
    }
    if(cont == 25 && orbName != "ORBE INTERDIMENSIONAL"){
      setErroHandler(true)
      return
    }

  }

  async function chamadaAPINoMetamask() {
    //e.preventDefault();
    setIsMinting(true)

    var data = JSON.stringify({
      "quantity": mintAmount.toString(),
      "name": title,
      "email": body,
      "category": orbCategory
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

  function retornar() {
    window.location.reload(false);
  }




  async function chamadaAPI() {
    //e.preventDefault();
    setIsMinting(true)
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider)
      const signer = provider.getSigner();
      const address = await signer.getAddress();

          //segunda chamada para ver se o address não possui mais que x quantidade de nfts:
    var data2 = JSON.stringify({
      "address": "0x079DEe37766f5336DB2D92312129fD42B6172138"
    });
    var config2 = {
      method: 'post',
      url: 'https://parseapi.back4app.com/functions/NFTsByAddress',
      headers: { 
        'X-Parse-Application-Id': 'cACXAALjoAERRdB7jMAPSvMwBAfv7MC2yebDYxSw', 
        'X-Parse-REST-API-Key': 'iDcYvliNQkyCRm0L52ca2ghI85cyVNa9zAYI6Xus', 
        'Content-Type': 'application/json'
      },
      data: data2
    };
    
    let cont2;
    await axios(config2).then(function (response) {
     cont2 = Number(response.data.result.hex)
     console.log(cont2 + " <- aquii")
    })

    if ((cont2 + mintAmount) < 100) {

      var data = JSON.stringify({
        "quantity": mintAmount.toString(),
        "metamask": address,
        "name": title,
        "email": body,
        "category": orbCategory
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


  }

  function cancel() {
    setConfirmTrans(false)
  }

  async function handleMint() {
    if(founderMintIsOver){setQuantidadeUSD(`US$${mintAmount * 15}`)}
    if(!founderMintIsOver){setQuantidadeUSD(`US$${mintAmount * 10}`)}
    if(body == '' || title == ''){
      alert("Por favor, preencha todos os campos")
      return
     }
     if(body.includes("@") == false || body.includes(".") == false){
      alert("Por favor, ensira um e-mail válido")
      return
     }
    if(naoPossuiCarteira == true) {
      setConfirmTrans(true)
    }
    if (window.ethereum && naoPossuiCarteira == false) {
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


    }
  }

  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if(NFTminted > 0) {    
    if (NFTminted < 10){
      if(mintAmount >= NFTminted){
        alert("Limite máximo de NFTs atingido!")
        return
      }
    }
    if (mintAmount >= 10) {
      alert("Limite máximo de NFTs por carteira")
      return
    }
    setMintAmount(mintAmount + 1);
    return}
    else {
      if (mintAmount >= 10) {
        alert("Limite máximo de NFTs por carteira")
        return
      }
      setMintAmount(mintAmount + 1);
      return
    }
  };


  if (erroHandler == true) {
    return(<div fontFamily={"Poppins, sans-serif;"} >
    <h1 style={{fontFamily: "Poppins, sans-serif", fontSize: "70px", marginTop: "150px"}}> Ops... algum erro aconteceu, tente novamente. </h1>
  </div>)
  }

  if (isMinting == true){
    return(<div fontFamily={"Poppins, sans-serif;"}>
      <h1 id={"carregando"}> Carregando </h1>
      <span><Spin indicator={<LoadingOutlined style={{ fontSize: 200, marginBottom: "200%" }} spin />} /></span>
    </div>)}

  if (confirmTrans == true && naoPossuiCarteira == false) {
    return (
      
      <Flex justify="center"  height={tamanho} paddingBottom="3%" paddingTop="3%">
        
        <Box id={"box"}>
        <img src={logo} id={"oi"} style={{height: "12%"}}/>
            <div>
            {founderMintIsOver ? (<img src={orb} id={"orbs"}/>) : 
            (<img src={orbVioleta}  id={"orbs"}/>)}
              <Text
              fontSize="25px"
              fontWeight={"900"}
              color="#1EE0FF"
              fontFamily='Poppins, sans-serif;'
              marginBottom="0px"
              paddingBottom="0px"
              marginTop="-40px"
            >
              {founderMintIsOver ? (<p>ORBE INTERDIMENSIONAL</p>) : (<p>ORBE GÊNESIS</p>)}
            </Text>
            <Text fontSize="130%"
            fontFamily='Poppins, sans-serif;'>
            <p>Total de {quantidadeUSD}</p>
            </Text>
            <Text id={"box4"}>
              <h1>Você irá realizar a mintagem de {mintAmount} NFT(s) {orbName} para a carteira {userAddress} na rede Polygon. Por favor, certifique-se de que inseriu um email válido para que possamos enviar a confirmação de compra do seu NFT e de como visualizá-lo.</h1>
          </Text>
          <div id={"boxConfirmarCompra"}>
          <Button
            id={"buttonID3"}
            onClick={handleConfirmacaoCompra}
            >
              CONFIRMAR
            </Button>
          <Button
          id={"buttonID4"}
          onClick={cancel}
            >
              CANCELAR
            </Button>
            </div>
            </div>
        </Box>
    </Flex>

    )}

    if (confirmTrans == true && naoPossuiCarteira == true) {
      return (
        <Flex justify="center"  height={tamanho} paddingBottom="3%" paddingTop="3%">
        <Box id={"box"}>
            <img src={logo} id={"oi"} style={{height: "12%"}}/>
            <div>
            {founderMintIsOver ? (<img src={orb} id={"orbs"}/>) : 
            (<img src={orbVioleta}  id={"orbs"}/>)}
              <Text
              fontSize="25px"
              fontWeight={"900"}
              color="#1EE0FF"
              fontFamily='Poppins, sans-serif;'
              marginBottom="0px"
              paddingBottom="0px"
              marginTop="-40px"
            >
              {founderMintIsOver ? (<p>ORBE INTERDIMENSIONAL</p>) : (<p>ORBE GÊNESIS</p>)}
            </Text>
            <Text fontSize="130%"
            fontFamily='Poppins, sans-serif;'>
            <p>Total de {quantidadeUSD}</p>
            </Text>
          <Text id={"box4"}>
            <h1>Você irá realizar a mintagem de {mintAmount} NFT(s) {orbName} para a rede Polygon. Por favor, certifique-se de que inseriu um email válido para que possamos enviar a confirmação de compra do seu NFT e de como visualizá-lo.</h1>
          </Text>
          <div id={"boxConfirmarCompra"}>
            <Button
              id={"buttonID3"}
              onClick={handleConfirmacaoCompra}
              >
                CONFIRMAR
              </Button>
            <Button
            id={"buttonID4"}
            onClick={cancel}
              >
                CANCELAR
              </Button>
              </div>
          </div>
            
        </Box>
        </Flex>
      )}


  return (
    <Flex justify="center"  height={tamanho} paddingBottom="3%" paddingTop="3%">
    { isConnected || naoPossuiCarteira ? (<img src={recolher} id={"recolher"} onClick={retornar}/>):(<></>)}
      <Box id={"box"}>
        <div>
          <img src={logo} id={"oi"}/>
          <div>
          {founderMintIsOver ? (<img src={orb} id={"orbs"}/>) : 
          (<img src={orbVioleta}  id={"orbs"}/>)}
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
              {founderMintIsOver ? (<p>ORBE INTERDIMENSIONAL</p>) : (<p>ORBE GÊNESIS</p>)}
            </Text>
            <Text
              fontSize="16px"
              fontFamily='Poppins, sans-serif;'
              marginBottom="30px"
              marginTop="0px"
            >
              {founderMintIsOver ? (<p>US$ {mintAmount * 15},00</p>) : (<p>US$ {mintAmount * 10},00</p>)}
            </Text>
          </div>
          ):(
            
          <Text
              id={"textoDescrito"}
          >
            {founderMintIsOver? (

            <p style={{"margin-bottom":"35px"}}> <h1 id={"titulo"}>ORBE INTERDIMENSIONAL</h1> ADQUIRA JÁ O SEU
            </p>) : (

              <p style={{"margin-bottom":"35px"}}> <h1 id={"titulo"}>ORBE GÊNESIS</h1> ADQUIRA JÁ O SEU <br /> UNIDADES LIMITADAS <br /> <br /> Faltam {NFTminted} NFTs founders a serem mintados.
              </p>

            )}
            
          </Text>)
          }

          </div>
        </div>

        {isConnected || naoPossuiCarteira ? (
          
          <div align="flex-end">
            <form id="pageMintarNFT2">
                <input 
                  id="inputID"
                  type="text" 
                  required
                  placeholder="Nome" 
                  value={title}
                  style={{marginBottom: "1%"}}
                  onChange={(e) => setTitle(e.target.value)}
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
              
                />
                </div>
                </div>
            </form>
            <Flex id="pageMintarNFT">
              <Button
                id={"buttonMinus"}
                onClick={handleDecrement}
              >
                {" "}
                -
              </Button>

              <Input
                readOnly
                id="inputIDAmountMint"
                type="number"
                value={mintAmount}
              />

              <Button
                id={"buttonPlus"}
                onClick={handleIncrement}
              >
                {" "}
                +
              </Button>
            </Flex>
          <Flex id={"flexMintarNFT"}>
            <Button
              id={"buttonMintarNFT"}
              onClick={handleMint}
            >
              MINTAR NFT
            </Button>
          </Flex>
          </div>
        ) : (
          <div id="botoes" >
          <Button 
          id={"buttonID2"}
          onClick={connectAccount}
          >CONECTAR CARTEIRA</Button>
          <Button 
          id={"buttonID"}
          onClick={criarCarteira}
          >CRIAR UMA CARTEIRA</Button>
          </div>
        )}

      </Box>
    </Flex>

  );
};

export default MaintMint;
