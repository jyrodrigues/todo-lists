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
    customTaskTitle: string,
    selectedTasksToShow: TaskSelection,
};

enum TaskSelection {
    All = "ALL",
    Done = "DONE",
    Todo = "TODO",
}



/* STYLES */


const mystyle = css`
    width: 300px;
    height: 200px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin: 20px;
    padding: 10px;
    overflow: scroll;
`;

const customTaskWrapperStyle = css`
    margin: 20px;
    padding: 20px;
    border: solid 1px rgba(0,0,0,0.1);
    border-radius: 4px;
`;


/* COMPONENT */


class TaskList extends React.Component<TaskListProps, TaskListState> {
    public constructor(props: any) {
        super(props);
        this.state = {
            tasks: this.props.tasks || [],
            nextAvailableKey: this.props.tasks.length,
            customTaskTitle: '',
            selectedTasksToShow: TaskSelection.All,
        }

        binder(this);
    }



    /* SUBCOMPONENTS CPI Callbacks */


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



    /* COMPONENT LOGIC */


    public handleNewTaskChange(e : React.FormEvent<HTMLInputElement>) : void {
        this.setState({ customTaskTitle: e.currentTarget.value });
    }

    public addRandomTask() : void {
        this.addTask("Random task title");
    }

    public addNewTask(_: React.MouseEvent<HTMLButtonElement>) : void {
        if (this.state.customTaskTitle.length === 0) { return; }
        
        this.addTask(this.state.customTaskTitle);
    }

    public addTask(title: string) : void {
        const newTask = {
            title,
            done: false,
            key: this.state.nextAvailableKey,
        };
        const tasks = [newTask].concat(this.state.tasks.slice());

        this.setState({
            tasks,
            nextAvailableKey: this.state.nextAvailableKey + 1,
        });

    }

    public toggleTasksSelectionTo (showSelection : TaskSelection) : React.MouseEventHandler<HTMLButtonElement> {
        return (e : React.MouseEvent<HTMLButtonElement>) => {
            this.setState({ selectedTasksToShow: showSelection })
        }
    }

    public prepareTasks () : JSX.Element[] {
        return this.state.tasks.filter(taskData => {
            switch (this.state.selectedTasksToShow) {
                case TaskSelection.Done:
                    return taskData.done;
                
                case TaskSelection.Todo:
                    return !taskData.done;

                case TaskSelection.All:
                    return true;
            }
        })
        .map((task : TaskData) => {
            const taskProps : TaskProps = {...task, ...this.taskCallbacks(task.key)};
            return <Task {...taskProps} />;
        });
    }



    /* RENDER */


    public render() {
        return (
            <div>
                <div className={customTaskWrapperStyle}>
                    <input type="text" onChange={this.handleNewTaskChange}/>
                    <button className={css`margin: 10px`} onClick={this.addNewTask}>Add</button>
                </div>
                <div className={mystyle}>
                    {this.prepareTasks()}
                </div>
                <button onClick={this.addRandomTask}>Add Random Task! :)</button>
                <div>
                    {Object.keys(TaskSelection).map( selection => {
                        return <button key={selection} onClick={this.toggleTasksSelectionTo(TaskSelection[selection])}>{selection}</button>;
                    })}
                    <div>Showing {this.state.selectedTasksToShow} tasks.</div>
                </div>
            </div>
        )
    }
}

export default TaskList;