import { useState, useEffect } from 'react';
import axios from 'axios';

interface QueryResponse {
    chance: number;
    action_2: string;
    action_3: string;
    action_4: string;
    action_5: string;
    action_6: string;
    action_7: string;
    action_8: string;
    action_9: string;
    action_10: string;
    action_11: string;
    action_12: string;
}

function App() {
  const [numbers, setNumber] = useState<number[]>(Array(9).fill(1));
  const [chance, setChance] = useState<number | null>(null);
  const [actions, setActions] = useState<string[]>(Array(10).fill(null));
  const [ins, setIns] = useState<number[]>(Array(3).fill(0));


  useEffect(() => {
    const fetchData = async () => {
        try {
                const API_BASE = process.env.REACT_APP_API_URL || '';
                const response = await axios.post<QueryResponse>(`${API_BASE}/query`, {
                    numbers: numbers,
                    ins: ins[0] + ins[1] + ins[2]
                });

                const data = response.data;
                setChance(data.chance);
                setActions([data.action_2, data.action_3, data.action_4, data.action_5, data.action_6, data.action_7, data.action_8, data.action_9, data.action_10, data.action_11, data.action_12]);
                console.log("Backend response:", response.data);
            } catch (error) {
                console.error("Error querying backend:", error);
            }
        };

        fetchData();

    }, [numbers, ins]);

    const clickNumber = (index:number) => {
        setNumber(prev => prev.map((val, i) => i === index ? (val === 0 ? 1 : 0) : val))
    }

    const clickIns = (index:number) => {
        setIns(prev => prev.map((val, i) => i === index ? (val === 0 ? 1 : 0) : val))
    }

    const reset = () => {
        setNumber(Array(9).fill(1));
        setIns(Array(3).fill(0));
    }

  return (
      <div style={{ display:'flex', padding: '2rem' }}>
          <div style = {{ display: 'flex', flexDirection: 'column', gap: '5px'}}>
          <fieldset style={{border:'1px solid #000', width:'200px'}}><legend>Numbers</legend>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(3, 62px)' }}>
          {numbers.map((value, index) => (
              <button
                  key={index}
                  onClick={() => clickNumber(index)}
                  style={{
                    padding: '1rem',
                    backgroundColor: value ? 'lightgreen' : 'lightgray',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '60px',
                    height: '60px',
                    fontSize: '1.5rem',
                  }}
              >
                {index + 1}
              </button>
          ))}
        </div>
          </fieldset>
          <fieldset style={{border:'1px solid #000', width:'220px'}}><legend>Insurance Markers</legend>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {ins.map((value, index) => (
                  <button
                      key={index}
                      onClick={() => clickIns(index)}
                      style={{
                          padding: '1rem',
                          backgroundColor: value ? 'gold' : 'lightgray',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          width: '60px',
                          height: '60px',
                      }}
                  >
                  </button>
              ))}
          </div>
          </fieldset>
          </div>
          <div>
          <fieldset style={{border:'1px solid #000', width:'220px'}}><legend>Odds / Best Move</legend>
          <div className="panel">
              Win Chance: {chance !== null ? (chance*100).toFixed(2) + "%" : 'No result yet'}
              <p></p>
              {[2,3,4,5,6,7,8,9,10,11,12].map((value, index) => (
                  <div key={value}>{value}: {actions[index]}</div>
              ))}
          </div>
          </fieldset>
          <div style={{padding: "2px"}}>
              <button style={{height: "44px", width: "246px", fontSize: "20px"}} onClick={() => reset()}>Reset</button>
          </div>
          </div>
      </div>
  );
}

export default App;
