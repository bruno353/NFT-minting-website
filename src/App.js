import{ useState } from 'react';
import './App.css';
import MainMint from './MainMint';
import NavBar from './NavBar';
import SecondMint from './SecondMint.js';
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";


function App() {
  const [accounts, setAccounts] = useState([]);
  const [proximo, setProximo] = useState(false);

  return (
    <div className="overlay">
    <div className="App">
  
  <div className="App">
    {proximo ? (   
      <Flex overflow={"scroll"} height={"800px"} justify={"center"}>
      <div>
      <MainMint accounts={accounts} setAccounts={setAccounts}  proximo={proximo} setProximo={setProximo}/>

    </div></Flex>) : (
      <Flex id={"page"}>
      <div>
      <MainMint accounts={accounts} setAccounts={setAccounts}  proximo={proximo} setProximo={setProximo}/>
      <NavBar accounts={accounts} setAccounts={setAccounts} proximo={proximo} setProximo={setProximo}/>
    </div>
    </Flex>
    )}

</div>
<div className="moving-background"> </div>

</div>

  </div>);
}


export default App;
