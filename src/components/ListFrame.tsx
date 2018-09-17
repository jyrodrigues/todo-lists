import * as React from 'react';
import { css } from 'react-emotion';
import binder from '../binder';
import Task from './Task';

const mystyle = css`
    width: 300px;
    height: 200px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin: 20px;
    padding: 10px;
    overflow: scroll;
`;

class ListFrame extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
    this.state = {
      tasks: this.props.tasks || []
    }

    binder(this);
  }

  public setToggleDoneCallbackInChild(i : number) {
    return (e : any) => {
        e.stopPropagation();
        const tasks = this.state.tasks.slice();
        tasks[i].done = !tasks[i].done;
        this.setState({
            tasks
        });
    }
  }

  public aler = () => alert("Clicked!");

  public render() {
    return (
        <div className={mystyle}>
            <Task done={true} title="Title hardcoded." onClick={this.aler} />
            {this.state.tasks.map((task : any, i : number) => 
                <Task key={task.title} done={task.done} title={task.title} onClickParentCb={this.setToggleDoneCallbackInChild(i)}/>
            )}
        </div>
    )
  }
}

export default ListFrame;