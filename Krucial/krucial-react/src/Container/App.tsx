import React from 'react';
import { Footer, Header } from '../Components/Layout';
import { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  useEffect(() =>{
    fetch("https://localhost:7110/api/Product").then((response) => response.json()).then((data)=>{
      console.log(data);
      

    });

  }, []);
  return (
    <div >
      <Header />
      Main Component
      <Footer />
    </div>
  );
}

export default App;
