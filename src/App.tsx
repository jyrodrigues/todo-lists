import { css } from 'emotion'
import * as React from 'react';
import './App.css';
import logo from './logo.svg';

const myclass = css`
  color: hotpink;
  font-size: 1.5em;
`

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className={myclass}>Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
