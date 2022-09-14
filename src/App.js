import{ useState } from 'react';
import './App.css';
import MainMint from './MainMint';
import NavBar from './NavBar';
import SecondMint from './SecondMint.js';


function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    <div className="overlay">
    <div className="App">
  
  <div className="App">
    
    <MainMint accounts={accounts} setAccounts={setAccounts} />
    <NavBar accounts={accounts} setAccounts={setAccounts} />
</div>
<div className="moving-background"> </div>

</div>

  </div>);
}


export default App;
