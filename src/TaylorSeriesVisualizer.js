import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const TaylorSeriesVisualizer = () => {
  const [selectedFunction, setSelectedFunction] = useState('sin');
  const [terms, setTerms] = useState(3);
  const [data, setData] = useState([]);
  const [centerPoint, setCenterPoint] = useState(0);

  // Factorial function
  const factorial = (n) => {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  // Generate data points
  useEffect(() => {
    const generateData = () => {
      const points = [];
      const step = 0.1;
      const range = 4;
      
      for (let x = -range; x <= range; x += step) {
        const point = { x: x.toFixed(1) };
        
        // Actual function value
        switch (selectedFunction) {
          case 'sin':
            point.actual = Math.sin(x);
            break;
          case 'cos':
            point.actual = Math.cos(x);
            break;
          case 'exp':
            point.actual = Math.exp(x);
            break;
          case 'ln':
            point.actual = x !== 0 ? Math.log(1 + x) : null;
            break;
          default:
            point.actual = Math.sin(x);
        }
        
        // Taylor approximation
        const xShifted = x - centerPoint;
        let approximation = 0;
        
        switch (selectedFunction) {
          case 'sin':
            for (let n = 0; n <= terms; n++) {
              const term = Math.pow(-1, n) * Math.pow(xShifted, 2*n+1) / factorial(2*n+1);
              approximation += term;
            }
            break;
          case 'cos':
            for (let n = 0; n <= terms; n++) {
              const term = Math.pow(-1, n) * Math.pow(xShifted, 2*n) / factorial(2*n);
              approximation += term;
            }
            break;
          case 'exp':
            for (let n = 0; n <= terms; n++) {
              const term = Math.pow(xShifted, n) / factorial(n);
              approximation += term;
            }
            break;
          case 'ln':
            if (1 + xShifted > 0) {
              approximation = 0;
              for (let n = 1; n <= terms; n++) {
                const term = Math.pow(-1, n+1) * Math.pow(xShifted, n) / n;
                approximation += term;
              }
            } else {
              approximation = null;
            }
            break;
          default:
            approximation = 0;
        }
        
        point.approximation = approximation;
        points.push(point);
      }
      
      return points;
    };
    
    setData(generateData());
  }, [selectedFunction, terms, centerPoint]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Visualizador de Series de Taylor</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">Función:</label>
        <select 
          value={selectedFunction}
          onChange={(e) => setSelectedFunction(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="sin">Seno (sin x)</option>
          <option value="cos">Coseno (cos x)</option>
          <option value="exp">Exponencial (e^x)</option>
          <option value="ln">Logaritmo natural (ln(1+x))</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Número de términos: {terms}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={terms}
          onChange={(e) => setTerms(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Punto central (a): {centerPoint}
        </label>
        <input
          type="range"
          min="-3"
          max="3"
          step="0.5"
          value={centerPoint}
          onChange={(e) => setCenterPoint(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#8884d8" 
              name="Función real" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="approximation" 
              stroke="#82ca9d" 
              name={`Aprox. Taylor (${terms} términos)`} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Fórmula de la serie de Taylor:</h3>
        <p className="text-sm">
          {selectedFunction === 'sin' && (
            <>sin(x) ≈ {
              Array.from({length: terms + 1}, (_, n) => (
                `${n > 0 ? (Math.pow(-1, n) < 0 ? ' - ' : ' + ') : ''}${Math.abs(Math.pow(-1, n))===1 ? '' : Math.abs(Math.pow(-1, n))}(x${centerPoint !== 0 ? ` - ${centerPoint}` : ''})^${2*n+1}/${factorial(2*n+1)}`
              )).join('')
            }</>
          )}
          {selectedFunction === 'cos' && (
            <>cos(x) ≈ {
              Array.from({length: terms + 1}, (_, n) => (
                `${n > 0 ? (Math.pow(-1, n) < 0 ? ' - ' : ' + ') : ''}${Math.abs(Math.pow(-1, n))===1 ? '' : Math.abs(Math.pow(-1, n))}(x${centerPoint !== 0 ? ` - ${centerPoint}` : ''})^${2*n}/${factorial(2*n)}`
              )).join('')
            }</>
          )}
          {selectedFunction === 'exp' && (
            <>e^x ≈ {
              Array.from({length: terms + 1}, (_, n) => (
                `${n > 0 ? ' + ' : ''}(x${centerPoint !== 0 ? ` - ${centerPoint}` : ''})^${n}/${factorial(n)}`
              )).join('')
            }</>
          )}
          {selectedFunction === 'ln' && (
            <>ln(1+x) ≈ {
              Array.from({length: terms + 1}, (_, n) => {
                if (n === 0) return '';
                return `${n > 1 ? (Math.pow(-1, n+1) < 0 ? ' - ' : ' + ') : ''}${Math.abs(Math.pow(-1, n+1))===1 ? '' : Math.abs(Math.pow(-1, n+1))}(x${centerPoint !== 0 ? ` - ${centerPoint}` : ''})^${n}/${n}`
              }).join('')
            }</>
          )}
        </p>
      </div>
    </div>
  );
};

export default TaylorSeriesVisualizer;