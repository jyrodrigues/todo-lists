import * as React from 'react';
import { css } from 'react-emotion';
import binder from '../binder';
import Task, { TaskCallbacks, TaskData, TaskProps } from './Task';



/* TYPES */


type TaskListProps = {
    tasks: TaskData[],
};


type TaskListState = {
    tasks: {
        todo: TaskData[],
        done: TaskData[],
    },
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
            tasks: {
                todo: this.props.tasks || [],
                done: [],
            },
            nextAvailableKey: this.props.tasks.length,
            customTaskTitle: '',
            selectedTasksToShow: TaskSelection.All,
        }

        binder(this);
    }



    /* SUBCOMPONENTS CPI Callbacks */


    public taskCallbacks(taskKey : number) : TaskCallbacks {
        const changeTaskPropAndSetState = (key : number, transformTask : (task : TaskData) => void) => {
            const todoTasks = this.state.tasks.todo.slice();
            const taskIndex = todoTasks.findIndex(task => task.key === key);
            transformTask(todoTasks[taskIndex]);
            this.setState({ tasks: { todo: todoTasks, done: this.state.tasks.done } });
        }

        return {
            onChangeStatus: _ => {
                changeTaskPropAndSetState(taskKey, task => task.done = !task.done)
            },

            // TODO make title a component's responsability ?
            onChangeTitle: e => {
                changeTaskPropAndSetState(taskKey, task => {
                    task.title = e.currentTarget.value;
                    task.selectAllTextOnEdit = false;
                })
            },

            onDelete: _ => {
                const todoTasks = this.state.tasks.todo.filter(task => task.key !== taskKey);
                this.setState({ tasks: { todo: todoTasks, done: this.state.tasks.done } });
            },

            onBlur: _ => {
                changeTaskPropAndSetState(taskKey, task => {
                    task.editable = false;
                    task.selectAllTextOnEdit = true;
                })
            },

            onClick: _ => {
                changeTaskPropAndSetState(taskKey, task => task.editable = true)
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

    public addTask(title: string/*, taskGroup: string*/) : void {
        // const taskDone = taskGroup === 'done';
        const newTask = {
            title,
            done: true,//taskDone,
            key: this.state.nextAvailableKey,
            id: this.state.nextAvailableKey,
            editable: false,
            selectAllTextOnEdit: true,
        };
        const todoTasks = [newTask].concat(this.state.tasks.done.slice());
        const tasks = {
            todo: todoTasks,
            done: this.state.tasks.done,
        }

        this.setState({
            tasks,
            nextAvailableKey: this.state.nextAvailableKey + 1,
        });
    }

    public toggleTasksSelectionTo(showSelection : TaskSelection) : React.MouseEventHandler<HTMLButtonElement> {
        return (e : React.MouseEvent<HTMLButtonElement>) => {
            this.setState({ selectedTasksToShow: showSelection })
        }
    }

    public prepareTasks(taskStatus : string) : JSX.Element[] {
        return this.state.tasks[taskStatus].filter((taskData : TaskData) => {
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

    public onDragOver(e: React.DragEvent<HTMLDivElement>) : void {
        e.preventDefault();
    }

    public onDrop(e: React.DragEvent<HTMLDivElement>, taskGroup: string) : void {
        const { key } = JSON.parse(e.dataTransfer.getData('text/plain'));
        this.addTaskOnDrop(key, taskGroup)
    }

    // TODO change every use of key to id
    public addTaskOnDrop(key: number, taskGroup: string) : void {
        const taskDone = taskGroup === 'done';
        const taskDoneIndex = this.state.tasks.done.findIndex(task => task.key === key);
        if (taskDone && taskDoneIndex >= 0) return;
        const taskTodoIndex = this.state.tasks.todo.findIndex(task => task.key === key);
        if (!taskDone && taskTodoIndex >= 0) return;

        console.log('taskDoneIndex', taskDoneIndex)
        console.log('taskTodoIndex', taskTodoIndex)

        const taskIndex = Math.max(taskTodoIndex, taskDoneIndex);

        const todo = this.state.tasks.todo;
        const done = this.state.tasks.done;

        let newTodo : TaskData[];
        let newDone : TaskData[];
        const wasTaskTodo = taskDone;
        if (wasTaskTodo) {
            newTodo = todo.slice(0, taskIndex).concat(todo.slice(taskIndex + 1, todo.length))
            const movedTask = todo.slice(taskIndex, taskIndex + 1)[0];
            const newMovedTaskSlice = [{
                title: movedTask.title,
                done: taskDone,
                key: this.state.nextAvailableKey,
                id: movedTask.id,
                editable: false,
                selectAllTextOnEdit: true,
            }]
            newDone = newMovedTaskSlice.concat(done.slice());
        } else {
            newDone = done.slice(0, taskIndex).concat(done.slice(taskIndex + 1, done.length))
            const movedTask = done.slice(taskIndex, taskIndex + 1)[0];
            const newMovedTaskSlice = [{
                title: movedTask.title,
                done: taskDone,
                key: this.state.nextAvailableKey,
                id: movedTask.id,
                editable: false,
                selectAllTextOnEdit: true,
            }]
            newTodo = newMovedTaskSlice.concat(todo.slice());
        }

        const tasks = {
            todo: newTodo,
            done: newDone,
        }

        this.setState({
            tasks,
            nextAvailableKey: this.state.nextAvailableKey + 1,
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
                <h2>Todo</h2>
                <div className={mystyle} onDragOver={this.onDragOver} onDrop={e => this.onDrop(e, 'todo')}>
                    {this.prepareTasks('todo')}
                </div>
                <h2>Done</h2>
                <div className={mystyle} onDragOver={this.onDragOver} onDrop={e => this.onDrop(e, 'done')}>
                    {this.prepareTasks('done')}
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