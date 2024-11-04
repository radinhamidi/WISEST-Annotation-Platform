// src/components/SqlQueryExecutor.js

import React, { useState } from 'react';
import { fetchWithAuth } from '../utils/authentication';

const EXECUTE_SQL_URL = `${process.env.REACT_APP_API_BASE_URL}/execute-sql`


const SqlQueryExecutor = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleExecute = async () => {
    try {
      const response = await fetchWithAuth(EXECUTE_SQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setResult(null);
    }
  };

  return (
    <div style={{ marginLeft: '20px', marginRight: '20px' }}>
      <h1 style={{color: 'black'}}>SQL Query Executor (ADMIN ONLY. USE WITH CAUTION)</h1>
      <textarea value={query} onChange={handleQueryChange} rows="5" cols="50" className="form-control" />
      <br />
      <button onClick={handleExecute} className="btn btn-dark">Execute</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result && (
        <table className="table table-bordered">
          <thead>
            <tr>
              {Object.keys(result[0] || {}).map((key) => (
                <th key={key} style={{ color: 'red' }}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i} style={{ color: 'green' }}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SqlQueryExecutor;
