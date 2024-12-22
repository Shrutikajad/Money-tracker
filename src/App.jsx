
import './App.css';
import { useEffect, useState } from 'react';




function App() {

  const [name,setName]=useState('');
  const[datetime,setDatetime]=useState('');
  const[description,setDescription]=useState('')
 const[transactions,setTransactions]=useState('')

  useEffect(()=>{
    getTransactions().then(setTransactions)
   },[])
   
   async function getTransactions() {
     const url= 'http://localhost:8000/api/transaction';
     const response =await fetch(url, {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },});
      return await response.json();
   }


  async function addNewtransaction(ev) {
    ev.preventDefault();
    const url = 'http://localhost:8000/api/transaction';
    // const price= name.split('')[0];
    const priceInput = name.split('')[0]; // Assuming this is how you extract the price
    const price = parseFloat(priceInput);

    if (isNaN(price)) {
        alert("Invalid price value");
        return; // Prevent the form from submitting
    }

   await fetch(url, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ 
          price,
          name,//.substring(price.length+1)
          description,
          datetime 
        })
    }).then(response=>{
      response.json().then(json=>{
        setName('');
        setDatetime('');
        setDescription('');
        setTransactions([...transactions,json])
        console.log('result',json);
      });
    });
  }

  let balance=0;
  for(const transaction of transactions){
     balance=balance+ transaction.price;
  }
  balance=balance.toFixed(2);
  const fraction =balance.split('.')[1];
  balance= balance.split('.')[0];
  
 

  return (
  <main>
   <h1>${balance}<span>.00</span></h1>
   
   <form onSubmit={addNewtransaction}> 
    <div className='basic'>
       <input type='text' value={name} onChange={ev=>setName(ev.target.value)} placeholder='+200 new Tv'></input>
       <input type='datetime-local' value={datetime} onChange={ev=>setDatetime(ev.target.value)}></input>  
    </div>

    <div className='description'>
      <input type='text' placeholder='description' value={description} onChange={ev=>setDescription(ev.target.value)}></input>
    </div>

   <button type='submit'>Add new transaction</button>

   </form>

   <div className='transactions'>
    
   {transactions.length > 0 && transactions.map(transaction => {
    return (
        <div className='transaction'> 
            <div className='left'>
                <div className='name'>{transaction.name}</div>
                <div className='description'>{transaction.description}</div>
            </div>
            <div className='right'>
                <div className='price'>{transaction.price}</div>
                <div className='datetime'>{transaction.datetime}</div>
            </div>
        </div>
    );//{'price' + (transaction.price < 0 ? ' red' : ' green')}
})}

        
    </div>
   </main>
  );
}

export default App;
