import * as React from 'react';
import styled, { css, injectGlobal, keyframes } from 'react-emotion';
import ListFrame from './components/ListFrame';
import todoIcon from './images/Accomplish-icon.png';

const myclass = css`
  color: hotpink;
  font-size: 1.5em;
`;

// const doesit = css`
//   color: green;
// `;

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


function genTasks(n: number) {
  const tasks = [];
  for(let i = 0; i < n; i++) {
    tasks.push({ done: false, title: `Task ${i} means we have to do ${i} things.`});
  }
  return tasks;
}

class App extends React.Component {
  public render() {
    return (
      <div className={appStyle}>
        <header className={header}>
          <img src={todoIcon} className={iconStyle} alt="logo" />
          <h1 className={myclass}>A list</h1>
        </header>
        <AppBody>
          <ListFrame tasks={genTasks(4)}/>
        </AppBody>
      </div>
    );
  }
}

export default App;
