import { useState } from "react";
import { ethers, BigNumber } from "ethers";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import roboPunksNFT from "./RoboPunksNFT.json";
import { ConsoleSqlOutlined, LoadingOutlined } from '@ant-design/icons'
import { Spin, Row, Col } from "antd";
import logo from "./assets/background/trix_logo.png";
import orb from "./assets/background/orbes_azul.png"
import orbVioleta from "./assets/background/orbes_violeta.png"
import ERC721ABI from "./ERC721ABI.json"
import {useRef} from 'react';

var axios = require('axios');
const web3Provider1 = new ethers.providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/m8umOEv-BgiuBfFQJARY_V4gW3HORT1G")
const contractAddress = "0x73dFDaeBD27d1bC3C44daA573E8269a70A55D903"
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
      setTamanho("200vh")
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


    
    if (cont < 25) {
      if (naoPossuiCarteira == true){
        chamadaAPINoMetamask()
      }
      if(naoPossuiCarteira == false){chamadaAPI()}
    }
    if(cont == 25){
      setErroHandler(true)
    }}

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
      <h1 id={"carregando"}> Carregando </h1>
      <span><Spin indicator={<LoadingOutlined style={{ fontSize: 200 }} spin />} /></span>
    </div>)}

  if (confirmTrans == true && naoPossuiCarteira == false) {
    return (
      <Flex justify="center" align="center" height="120vh" paddingBottom="350px" lineHeight="50px" fontFamily={"Poppins, sans-serif;"}>
        <Box width="1200px">
          <h1>Você irá realizar a mintagem de {mintAmount} NFT(s) {orbName} para a carteira {userAddress} na rede Polygon.</h1>
          <h1>Por favor, certifique-se de que inseriu um email válido para que possamos enviar a confirmação de compra do seu NFT e de como visualizá-lo.</h1>
          <h2>Total de {quantidadeUSD}</h2>
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
        <Flex id={"box3"}>
          <Box id={"box2"}> 
          <Text>
            <h1>Você irá realizar a mintagem de {mintAmount} NFT(s) {orbName}</h1>
            <h1>Criaremos uma carteira Polygon para você poder acessar seus NFTs.</h1>
            <h1>Por favor, certifique-se de que <p style={{fontSize: "80%"}}>{(body)}</p> é um email válido e de que apenas você tenha acesso, por ele enviaremos as informações de como acessar a sua nova carteira.</h1>
            <h2>Total de {quantidadeUSD}</h2>
            </Text>
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
          </Box>
      </Flex>
  
      )}


  return (
    <Flex justify="center" align="center" height={tamanho} paddingBottom="1px">
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
              {founderMintIsOver ? (<p>US$ 15,00</p>) : (<p>US$ 10,00</p>)}
            </Text>
          </div>
          ):(
            
          <Text
            fontSize="18px"
            fontFamily='Poppins, sans-serif;'
            marginTop='-4%'
          >
            {founderMintIsOver? (

            <p>Adquira uma orbe coleção interdimensional. 
                A Orbe contém um personagem, que será revelado no evento de abertura, com emote e ícone dentro do jogo.
                
                
            </p>) : (

              <p style={{"margin-bottom":"35px"}}>Adquira uma orbe exclusiva e limitada da coleção Gênesis. 
                A Orbe contém um personagem, que será revelado no evento de abertura, emote e ícone exclusivos dentro do jogo, 
                além da possibilidade de fazer missões exclusivas. <br /> <br /> Faltam {NFTminted} NFTs founders a serem mintados.
              </p>

            )}
            
          </Text>)
          }

          </div>
        </div>

        {isConnected || naoPossuiCarteira ? (
          <div>
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
          <div style={{marginTop: "4%", width: "100%"}}>
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
