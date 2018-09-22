import * as React from 'react';
import styled, { css, injectGlobal, keyframes } from 'react-emotion';
import { TaskData } from './components/TaskData';
import TaskList from './components/TaskList';
import todoIcon from './images/Accomplish-icon.png';



/* STYLES */


const myclass = css`
  color: hotpink;
  font-size: 1.5em;
`;

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



/* AUX FUNCTIONS */


function genTasks(n: number): TaskData[] {
    const tasks = [];
    for (let i = 0; i < n; i++) {
        const id = i;
        const newTask : TaskData = {
          done: false,
          editable: false,
          id,
          selectAllTextOnEdit: true,
          title: `Task ${i} means we have to do ${i} things.`,
        }
        tasks.push(newTask);
    }
    return tasks;
}



/* COMPONENT */


class App extends React.Component {
    public render() {
        return (
            <div className={appStyle}>
                <header className={header}>
                    <img src={todoIcon} className={iconStyle} alt="logo" />
                    <h1 className={myclass}>A list</h1>
                </header>
                <AppBody>
                    <TaskList tasks={{ DONE: genTasks(5), TODO: [] }} />
                    <TaskList tasks={{ DONE: [], TODO: genTasks(2) }} />
                    <TaskList tasks={{ DONE: [], TODO: [] }} />
                </AppBody>
            </div>
        );
    }
}

export default App;
