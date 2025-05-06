import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import TaylorSeriesVisualizer from './TaylorSeriesVisualizer';

function App() {
  return (
    <div className="App">
      <div className="container py-4">
        <h1 className="text-center mb-4">Visualizador de Series de Taylor</h1>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <TaylorSeriesVisualizer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;