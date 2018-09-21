import * as React from 'react';
import { css } from 'react-emotion';
import binder from '../binder';
import Task, { TaskCallbacks, TaskData, TaskProps } from './Task';



/* TYPES */


type TaskDataList = {
    [group in TaskGroup] : TaskData[]
};

type TaskLocation = {
    group : string,
    index : number,
};

type TaskListProps = {
    tasks: TaskDataList,
}

enum TaskGroup {
    TODO = 'TODO',
    DONE = 'DONE',
}

type TaskListState = {
    tasks: {
        [group in TaskGroup] : TaskData[]
    },
    nextAvailableId: number,
    newTaskTitle: string,
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

const newTaskWrapperStyle = css`
    margin: 20px;
    padding: 20px;
    border: solid 1px rgba(0,0,0,0.1);
    border-radius: 4px;
`;



/* TASKS SPECIFICS */
// Enhance: put Task type and functions in a separate file
// Enhance: make it a class?
// Enhance: make group part of the task data?


function createTask(title: string, done: boolean, id: number) {
    const task : TaskData = {
        title,
        done,
        id,
        key: id,
        editable: false,
        selectAllTextOnEdit: true,
    }

    return task;
};

function tasksLength(tasks : TaskDataList) : number {
    let length = 0;
    for (let group in TaskGroup) {
        length += tasks[group].length;
    }
    return length;
}

function copyTasks(givenTasks : TaskDataList) : TaskDataList {
    // Enhance: is there a better way to initialize it?
    let tasks : TaskDataList = {
        DONE: [],
        TODO: [],
    };

    for (let group in TaskGroup) {
        tasks[group] = givenTasks[group].slice();
    }

    return tasks;
}

// Enhance: change string to TaskGroup
// function insertTask(currentTasks : TaskDataList, newTask : TaskData, newTaskGroup : TaskGroup) : TaskDataList {
function insertTask(currentTasks : TaskDataList, newTask : TaskData, newTaskGroup : string) : TaskDataList {
    let tasks = copyTasks(currentTasks);
    tasks[newTaskGroup] = [newTask].concat(tasks[newTaskGroup]);

    return tasks;
}

function deleteTaskByLocation(currentTasks : TaskDataList, location : TaskLocation) : TaskDataList {
    let tasks = copyTasks(currentTasks);
    let group = tasks[location.group];
    tasks[location.group] = group.splice(0, location.index).concat(group.splice(location.index + 1, group.length));

    return tasks;
}

// Enhance: change string to TaskGroup
// function findTaskById(tasks : TaskDataList, id: number) : ({ group : TaskGroup, index : number } | null) {
function findTaskById(tasks : TaskDataList, id: number) : TaskLocation | null {
    for (let group in TaskGroup) {
        const index : number = tasks[group].findIndex((task : TaskData) => task.id === id);
        if (index >= 0) {
            return {
                group,
                index,
            }
        }
    }
    return null;
}



/* COMPONENT */


class TaskList extends React.Component<TaskListProps, TaskListState> {
    public constructor(props: any) {
        super(props);

        this.state = {
            tasks: this.props.tasks,
            nextAvailableId: tasksLength(this.props.tasks),  // this.props.tasks.TODO.length + this.props.tasks.DONE.length + ...
            newTaskTitle: '',
        }

        binder(this);
    }



    /* SUBCOMPONENTS CPI Callbacks */


    public taskCallbacks(taskId : number) : TaskCallbacks {
        const changeTaskPropAndSetState = (id : number, transformTask : ((task : TaskData) => TaskData)) => {
            const taskLocation : TaskLocation | null = findTaskById(this.state.tasks, id);

            if (taskLocation === null) {
                console.warn(`Callback called for a Task with id=${id}. But this id was not found on TaskList state!`);
                return;
            }

            const tasks : TaskDataList = copyTasks(this.state.tasks);
            tasks[taskLocation.group][taskLocation.index] = transformTask(tasks[taskLocation.group][taskLocation.index]);

            this.setState({ tasks });
        }

        return {
            onChangeStatus: _ => {
                changeTaskPropAndSetState(taskId, task => {
                    task.done = !task.done
                    return task;
                })
            },

            // Enhance: make title a component's responsability ?
            onChangeTitle: e => {
                changeTaskPropAndSetState(taskId, task => {
                    task.title = e.currentTarget.value;
                    task.selectAllTextOnEdit = false;
                    return task;
                })
            },

            onDelete: _ => {
                const taskLocation = findTaskById(this.state.tasks, taskId);
                if (taskLocation === null) {
                    console.warn(`Trying to delete a Task with id=${taskId}. But this id was not found on TaskList state!`);
                    return;
                }
                const tasks = deleteTaskByLocation(this.state.tasks, taskLocation);
                this.setState({ tasks });
            },

            onBlur: _ => {
                changeTaskPropAndSetState(taskId, task => {
                    task.editable = false;
                    task.selectAllTextOnEdit = true;
                    return task;
                })
            },

            onClick: _ => {
                changeTaskPropAndSetState(taskId, task => {
                    task.editable = true;
                    return task;
                })
            }
        };
    }



    /* COMPONENT LOGIC */


    public handleNewTaskInputChange(e : React.FormEvent<HTMLInputElement>) : void {
        this.setState({ newTaskTitle: e.currentTarget.value });
    }

    public addNewTask(_: React.MouseEvent<HTMLButtonElement>) : void {
        if (this.state.newTaskTitle.length === 0) { return; }
        
        this.addTask(this.state.newTaskTitle, TaskGroup.TODO);
    }

    public addTask(title: string, taskGroup: TaskGroup) : void {
        if (title.length === 0) { return; }

        const taskId : number = this.state.nextAvailableId;
        const isTaskDone : boolean = taskGroup === TaskGroup.DONE;

        const newTask : TaskData = createTask(title, isTaskDone, taskId);
        const tasks : TaskDataList = insertTask(this.state.tasks, newTask, taskGroup);

        this.setState({
            tasks,
            nextAvailableId: taskId + 1,
        });
    }

    public onDragOver(e: React.DragEvent<HTMLDivElement>) : void {
        e.preventDefault();
    }

    // Enhance: change string to TaskGroup
    // public onDrop(e: React.DragEvent<HTMLDivElement>, dropGroup: TaskGroup) : void {
    public onDrop(e: React.DragEvent<HTMLDivElement>, dropGroup: string) : void {
        const { id } = JSON.parse(e.dataTransfer.getData('text/plain'));
        const taskLocation : TaskLocation | null = findTaskById(this.state.tasks, id);

        if (taskLocation === null) {
            console.warn(`Dropped a Task on ${dropGroup} with id=${id}. But this id was not found on TaskList state!`);
            return;
        } else if (taskLocation.group === dropGroup) {
            return;
        }
        const taskId = this.state.nextAvailableId;

        const oldTask : TaskData = this.state.tasks[taskLocation.group][taskLocation.index];
        const task : TaskData = createTask(oldTask.title, oldTask.done, taskId);

        const erasedTasks = deleteTaskByLocation(this.state.tasks, taskLocation);
        const tasks = insertTask(erasedTasks, task, dropGroup);

        this.setState({
            tasks,
            nextAvailableId: taskId + 1,
        })
    }



    /* RENDER */


    public mountTasks() : JSX.Element[] {
        let elements : JSX.Element[] = [];
        for (let group in TaskGroup) {
            const groupElement = (
                <div key={group} >
                    <h2>{group}</h2>
                    <div className={mystyle} onDragOver={this.onDragOver} onDrop={(e : React.DragEvent<HTMLDivElement>) => this.onDrop(e, group)}>
                        {this.state.tasks[group].map((task : TaskData) => {
                            const taskProps : TaskProps = {...task, ...this.taskCallbacks(task.id)};
                            return <Task {...taskProps} />;
                        })}
                    </div>
                </div>
            );
            elements.push(groupElement);
        }

        return elements;
    }

    public render() {
        return (
            <div>
                <div className={newTaskWrapperStyle}>
                    <input type="text" onChange={this.handleNewTaskInputChange}/>
                    <button className={css`margin: 10px`} onClick={this.addNewTask}>Add</button>
                </div>
                {this.mountTasks()}
            </div>
        )
    }
}

export default TaskList;