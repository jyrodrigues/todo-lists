import * as React from 'react';
import styled, { css, injectGlobal, keyframes } from 'react-emotion';
import ListFrame from './components/ListFrame';
import Task from './components/Task';
import todoIcon from './images/Accomplish-icon.png';

const myclass = css`
  color: hotpink;
  font-size: 1.5em;
`;

const doesit = css`
  color: green;
`;

// NEW

/* tslint:disable */
injectGlobal`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
`;
/* tslint:enable*/

const appStyle = css`
  text-align: center;
`;

const spinIcon = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const iconStyle = css`
  height: 60px;
  animation: ${spinIcon} infinite 4s linear;
`;

const header = css`
  background-color: #222;
  height: 150px;
  padding: 20px;
`;

const AppBody = styled('div')`
  display: flex;
  flex-wrap: wrap; /* Optional. only if you want the items to wrap */
  justify-content: center; /* For horizontal alignment */
  align-items: center; /* For vertical alignment */
`;

// END NEW



class App extends React.Component {
  public render() {
    return (
      <div className={appStyle}>
        <header className={header}>
          <img src={todoIcon} className={iconStyle} alt="logo" />
          <h1 className={myclass}>A list</h1>
        </header>
        <AppBody>
          <ListFrame>
            <Task className={doesit} color="red"/>
            <Task color="red"/>
            <Task />
          </ListFrame>
        </AppBody>
      </div>
    );
  }
}

export default App;
