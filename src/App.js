import { useRef } from 'react';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pakiautomaadid, setPakiautomaadid] = useState([]);
  const [prices, setPrices] = useState([]);
  const [chosenCountry, setChosenCountry] = useState("ee");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const startRef = useRef();
  const endRef = useRef();

  useEffect(() => {
    if (start !== "" && end !== "") {
      fetch("https://localhost:7043/nordpool/" + chosenCountry + "/" + start + "/" + end)
        .then(res => res.json())
        .then(json => { setPrices(json); });
    }
    fetch("https://localhost:7043/parcelmachine")
       .then(res => res.json())
       .then(json => setPakiautomaadid(json));
  }, [chosenCountry, start, end]);

  function updateStart() {
    const startIso = new Date(startRef.current.value).toISOString();
    setStart(startIso);
  }

  function updateEnd() {
    const endIso = new Date(endRef.current.value).toISOString();
    setEnd(endIso);
  }

  async function makePayment(sum) {
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
  

  return (
    <div>
      <button onClick={() => setChosenCountry("fi")}>Soome</button>
      <button onClick={() => setChosenCountry("ee")}>Eesti</button>
      <button onClick={() => setChosenCountry("lv")}>Läti</button>
      <button onClick={() => setChosenCountry("lt")}>Leedu</button>
      <input ref={startRef} onChange={updateStart} type="datetime-local" />
      <input ref={endRef} onChange={updateEnd} type="datetime-local" />
      {prices.length > 0 && 
      <table style={{marginLeft: "100px"}}>
        <thead>
          <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Ajatempel</th>
          <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Hind</th>
          <th style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>Maksma</th>
        </thead>
        <tbody>
          <td style={{position: "absolute", left: "30px"}}>{chosenCountry}</td>
          {prices.map(data => 
          <tr key={data.timestamp}>
            <td style={{border: "1px solid #ddd", padding: "8px"}}>{new Date(data.timestamp * 1000).toISOString()}</td>
            <td style={{border: "1px solid #ddd", padding: "8px"}}>{data.price}</td>
            <td><button onClick={() => makePayment(data.price)}>Maksma</button></td>
          </tr>)}
        </tbody>
      </table>}
      <div className="App" style={{border: "1px solid #ddd", padding: "12px", backgroundColor: "#04AA6D"}}>
        <select>
          {pakiautomaadid.map(automaat => 
            <option>
              {automaat.name}
            </option>)}
        </select>
      </div>
    </div>
  );
}

export default App;