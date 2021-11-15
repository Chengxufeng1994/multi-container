import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [fibValues, setFibValues] = useState({});
  const [index, setIndex] = useState('');

  const fetchValues = async () => {
    const res = await axios.get('/api/fib_values/current');
    setFibValues(res.data);
  };
  const fetchIndexes = async () => {
    const res = await axios.get('/api/fib_values/all');

    setSeenIndexes(res.data);
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const renderSeenIndexes = () => {
    return seenIndexes
      .map(({ number }) => {
        return number;
      })
      .join(', ');
  };

  const renderFibValues = () => {
    const keys = Object.keys(fibValues);
    // eslint-disable-next-line array-callback-return
    return keys.map((key) => {
      return (
        <div key={key}>
          For index {key} I calculated {fibValues[key]}
        </div>
      );
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('/api/fib_values', { index });
    setIndex('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index: </label>
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Indexes I have seen: </h3>
      {renderSeenIndexes()}

      <h3>Calculated Values: </h3>
      {renderFibValues()}
    </div>
  );
};

export default Fib;
