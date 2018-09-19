import * as React from 'react';
import { css } from 'react-emotion';
import binder from '../binder';
import Task, { taskCallbacks } from './Task';


const mystyle = css`
    width: 300px;
    height: 200px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin: 20px;
    padding: 10px;
    overflow: scroll;
`;

class TaskList extends React.Component<any, any> {
    public constructor(props: any) {
        super(props);
        this.state = {
        tasks: this.props.tasks || []
        }

        binder(this);
    }

    public cbs : taskCallbacks = {
        cb1: () => 3,
        cb2: (e: any) => 4
    }

    public handleTaskChange(i : number) {
        return () => {
            const tasks = this.state.tasks.slice();
            tasks[i].done = !tasks[i].done;
            this.setState({
                tasks
            });
        }
    }

    public render() {
        return (
            <div className={mystyle}>
                {this.state.tasks.map((task : any, i : number) => 
                    <Task key={task.title} done={task.done} title={task.title} onChange={this.handleTaskChange(i)} {...this.cbs} />
                )}
            </div>
        )
    }
}

export default TaskList;