import React from 'react';
import './App.css';
import TaylorSeriesVisualizer from './TaylorSeriesVisualizer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Visualizador de Series de Taylor</h1>
      </header>
      <main>
        <TaylorSeriesVisualizer />
      </main>
    </div>
  );
}

export default App;