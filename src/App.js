import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [tooted, setTooted] = useState([]);
  const idRef = useRef(); //toode.id
  const nameRef = useRef(); //toode.name
  const priceRef = useRef(); //toode.price
  const [valuut, setvaluut] = useState("euro"); //valuut
  const isActiveRef = useRef(); //toode.active


  useEffect(() => {
    fetch("https://localhost:7043/api/tooted") //показ всех продуктов
      .then(res => res.json())
      .then(json => setTooted(json));
  }, []);

  function kustuta(index) {
    setTimeout(() => { //ТАЙМЕР НА 1 СЕКУНД
      fetch("https://localhost:7043/api/tooted/kustuta/" + index, {"method": "DELETE"}) //Удаление продукта 
        .then(res => res.json())
        .then(json => setTooted(json));
    }, 1000);
  }

  // ////////////////////////
  // function lisa() {
  //   const uusToode = {
  //     "id": Number(idRef.current.value),
  //     "name": nameRef.current.value,
  //     "price": Number(priceRef.current.value),
  //     "isActive": isActiveRef.current.checked
  //   }
  //   fetch("https://localhost:7043/api/tooted/lisa", {"method": "POST", "body": JSON.stringify(uusToode)})
  //     .then(res => res.json())
  //     .then(json => setTooted(json));
  // }
  // ////////////////////////

  function lisa() {                                          ////////////////////////Добавление продукта
    fetch(`https://localhost:7043/api/tooted/lisa/
        ${Number(idRef.current.value)}/${nameRef.current.value}/        
        ${Number(priceRef.current.value)}/${isActiveRef.current.checked}`, {"method": "POST"})
      .then(res => res.json())
      .then(json => setTooted(json));
  }

  function dollariteks() {
    setvaluut(prevValuut => (prevValuut === "euro" ? "dollar" : "euro"));
  }

  async function makePayment(sum) { //операция платежа
    try {
      const response = await fetch(`https://localhost:7043/Payment/${sum}`);
      if (response.ok) {
        let paymentLink = await response.text();
        // Удаляем начальные и конечные двойные кавычки
        paymentLink = paymentLink.replace(/^"|"$/g, '');
        window.open(paymentLink, '_blank'); // Открыть ссылку в новой вкладке
      } else {
        console.error('Payment failed.');
      }
    } catch (error) {
      console.error('Error making payment:', error);
    }
  }
  
  return(
    <div className="App">
      <div className="input">
      <label>ID</label> <br />
      <input ref={idRef} type="number" /> <br />
      <label>Nimi</label> <br />
      <input ref={nameRef} type="text" /> <br />
      <label>Hind</label> <br />
      <input ref={priceRef} type="number" /> <br />
      <label>Aktiivne</label> <br />
      <input ref={isActiveRef} type="checkbox" /> <br />
      <button onClick={() => lisa()}>Lisa</button>
      </div>
      <table>
        <thead>
          <th>ID</th>
          <th>Nimi</th>
          <th>Hind</th>
          <th>Aktiivne</th>
          <th>Maksma</th>
          <th>Dollariteks</th>
        </thead>
        <tbody>
          <td></td>
          {tooted.map((toode, index) =>
          <tr>
            <td><div>{toode.id}</div></td>
            <td><div>{toode.name}</div></td>
            <td>
                {valuut === "euro" ? "€" : "$"}
                {Math.round(toode.price * (valuut === "euro" ? 1 : 1.05) * 100) / 100}
            </td>
            <td><button onClick={() => kustuta(index)}>Kustuta</button></td>
            <td><button onClick={() => makePayment(toode.price) && kustuta(index)}>Maksma</button></td>
            <td><button onClick={() => dollariteks()}>Muuda dollariteksbutton</button></td>     
          </tr>)}
        </tbody>
      </table>
    </div>
    
  );
}

export default App;