import{ useState } from 'react';
import './App.css';
import MainMint from './MainMint';
import NavBar from './NavBar';
import SecondMint from './SecondMint.js';


function App() {
  const [accounts, setAccounts] = useState([]);
  const [proximo, setProximo] = useState(false);

  return (
    <div className="overlay">
    <div className="App">
  
  <div className="App">
    {proximo ? (   
      <div>
      <MainMint accounts={accounts} setAccounts={setAccounts}  proximo={proximo} setProximo={setProximo}/>

    </div>) : (
      <div>
      <MainMint accounts={accounts} setAccounts={setAccounts}  proximo={proximo} setProximo={setProximo}/>
      <NavBar accounts={accounts} setAccounts={setAccounts} proximo={proximo} setProximo={setProximo}/>
    </div>
    )}

</div>
<div className="moving-background"> </div>

</div>

  </div>);
}


export default App;
