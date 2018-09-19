import * as React from 'react';
import { css } from 'react-emotion';
import binder from '../binder';
import Task, { TaskCallbacks, TaskData, TaskProps } from './Task';



/* TYPES */


type TaskListProps = {
    tasks: TaskData[],
};


type TaskListState = {
    tasks: TaskData[],
    nextAvailableKey: number,
};



/* STYLES */


const mystyle = css`
    width: 300px;
    height: 200px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin: 20px;
    padding: 10px;
    overflow: scroll;
`;



/* COMPONENT */


class TaskList extends React.Component<TaskListProps, TaskListState> {
    public constructor(props: any) {
        super(props);
        this.state = {
            tasks: this.props.tasks || [],
            nextAvailableKey: this.props.tasks.length,
        }

        binder(this);
    }

    public taskCallbacks(taskKey : number) : TaskCallbacks {
        return {
            onChangeStatus: _ => {
                const tasks = this.state.tasks.slice();
                const taskIndex = tasks.findIndex(task => task.key === taskKey);
                tasks[taskIndex].done = !tasks[taskIndex].done;
                this.setState({ tasks });
            },

            // TODO make title a component's responsability ?
            onChangeTitle: e => {
                const tasks = this.state.tasks.slice();
                const taskIndex = tasks.findIndex(task => task.key === taskKey);
                tasks[taskIndex].title = e.currentTarget.value;
                this.setState({ tasks });
            },

            onDelete: _ => {
                const tasks = this.state.tasks.filter(task => task.key !== taskKey);
                this.setState({ tasks });
            }
        };
    }

    public addRandomTask() : void {
        const newTask = {
            title: "Random data",
            done: false,
            key: this.state.nextAvailableKey,
        };

        const tasks = this.state.tasks.slice();
        tasks.push(newTask);
        this.setState({
            tasks,
            nextAvailableKey: this.state.nextAvailableKey + 1,
        });
    }

    public render() {
        return (
            <div>
                <div className={mystyle}>
                    {this.state.tasks.map((task : TaskData) => {
                        const taskProps : TaskProps = {...task, ...this.taskCallbacks(task.key)};
                        return <Task {...taskProps} />;
                    })}
                </div>
                <button onClick={this.addRandomTask}>Add Random Task! :)</button>
            </div>
        )
    }
}

export default TaskList;