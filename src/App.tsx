import * as React from 'react';
import styled, { css } from 'react-emotion'
import './App.css';
import Task from './components/Task'
import logo from './logo.svg';

const myclass = css`
  color: hotpink;
  font-size: 1.5em;
`

const Code = styled('code')`
  color: aquamarine;
`;

const doesit = css`
  color: green;
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
          To get started, edit <Code>src/App.tsx</Code> and save to reload.
        </p>
        <div>
          <Task className={doesit} color="red"/>
          <Task color="red"/>
          <Task />
        </div>
      </div>
    );
  }
}

export default App;
