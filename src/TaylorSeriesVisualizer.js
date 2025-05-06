import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './TaylorSeriesVisualizer.css'; // Asegúrate de crear este archivo

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

  // Genera términos de la fórmula con mejor formato
  const renderTaylorFormula = () => {
    let formulaElements = [];
    
    switch (selectedFunction) {
      case 'sin':
        formulaElements.push(<span key="function-name" className="function-name">sin(x) ≈ </span>);
        for (let n = 0; n <= terms; n++) {
          const sign = n > 0 ? (Math.pow(-1, n) < 0 ? ' - ' : ' + ') : '';
          const coef = Math.abs(Math.pow(-1, n)) === 1 ? '' : Math.abs(Math.pow(-1, n));
          const xTerm = centerPoint !== 0 ? `(x - ${centerPoint})` : 'x';
          
          formulaElements.push(
            <span key={`term-${n}`} className="term">
              {sign}
              {coef && <span className="coefficient">{coef}</span>}
              <span className="fraction">
                <span className="numerator">{xTerm}<sup>{2*n+1}</sup></span>
                <span className="fraction-line"></span>
                <span className="denominator">{factorial(2*n+1)}</span>
              </span>
            </span>
          );
        }
        break;
      
      case 'cos':
        formulaElements.push(<span key="function-name" className="function-name">cos(x) ≈ </span>);
        for (let n = 0; n <= terms; n++) {
          const sign = n > 0 ? (Math.pow(-1, n) < 0 ? ' - ' : ' + ') : '';
          const coef = Math.abs(Math.pow(-1, n)) === 1 ? '' : Math.abs(Math.pow(-1, n));
          const xTerm = centerPoint !== 0 ? `(x - ${centerPoint})` : 'x';
          
          formulaElements.push(
            <span key={`term-${n}`} className="term">
              {sign}
              {coef && <span className="coefficient">{coef}</span>}
              <span className="fraction">
                <span className="numerator">{xTerm}<sup>{2*n}</sup></span>
                <span className="fraction-line"></span>
                <span className="denominator">{factorial(2*n)}</span>
              </span>
            </span>
          );
        }
        break;
      
      case 'exp':
        formulaElements.push(<span key="function-name" className="function-name">e<sup>x</sup> ≈ </span>);
        for (let n = 0; n <= terms; n++) {
          const sign = n > 0 ? ' + ' : '';
          const xTerm = centerPoint !== 0 ? `(x - ${centerPoint})` : 'x';
          
          formulaElements.push(
            <span key={`term-${n}`} className="term">
              {sign}
              <span className="fraction">
                <span className="numerator">{xTerm}<sup>{n}</sup></span>
                <span className="fraction-line"></span>
                <span className="denominator">{factorial(n)}</span>
              </span>
            </span>
          );
        }
        break;
      
      case 'ln':
        formulaElements.push(<span key="function-name" className="function-name">ln(1+x) ≈ </span>);
        for (let n = 1; n <= terms; n++) {
          const sign = n > 1 ? (Math.pow(-1, n+1) < 0 ? ' - ' : ' + ') : '';
          const coef = Math.abs(Math.pow(-1, n+1)) === 1 ? '' : Math.abs(Math.pow(-1, n+1));
          const xTerm = centerPoint !== 0 ? `(x - ${centerPoint})` : 'x';
          
          formulaElements.push(
            <span key={`term-${n}`} className="term">
              {sign}
              {coef && <span className="coefficient">{coef}</span>}
              <span className="fraction">
                <span className="numerator">{xTerm}<sup>{n}</sup></span>
                <span className="fraction-line"></span>
                <span className="denominator">{n}</span>
              </span>
            </span>
          );
        }
        break;
      
      default:
        formulaElements = [];
    }
    
    return formulaElements;
  };

  return (
    <div className="card p-4 shadow">
      <h2 className="h4 mb-4">Visualizador de Series de Taylor</h2>
      
      <div className="mb-3">
        <label className="form-label">Función:</label>
        <select 
          value={selectedFunction}
          onChange={(e) => setSelectedFunction(e.target.value)}
          className="form-select"
        >
          <option value="sin">Seno (sin x)</option>
          <option value="cos">Coseno (cos x)</option>
          <option value="exp">Exponencial (e^x)</option>
          <option value="ln">Logaritmo natural (ln(1+x))</option>
        </select>
      </div>
      
      <div className="mb-3">
        <label className="form-label">
          Número de términos: {terms}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={terms}
          onChange={(e) => setTerms(parseInt(e.target.value))}
          className="form-range"
        />
      </div>
      
      <div className="mb-3">
        <label className="form-label">
          Punto central (a): {centerPoint}
        </label>
        <input
          type="range"
          min="-3"
          max="3"
          step="0.5"
          value={centerPoint}
          onChange={(e) => setCenterPoint(parseFloat(e.target.value))}
          className="form-range"
        />
      </div>
      
      <div style={{ height: '16rem' }}>
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
      
      <div className="formula-container mt-4 p-4 bg-light rounded">
        <h3 className="h5 mb-3 text-center">Fórmula de la serie de Taylor:</h3>
        <div className="math-formula text-center">
          {renderTaylorFormula()}
        </div>
      </div>
    </div>
  );
};

export default TaylorSeriesVisualizer;