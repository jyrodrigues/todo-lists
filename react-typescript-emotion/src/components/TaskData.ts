export type TaskData = {
    done: boolean,
    editable: boolean,
    id: number,
    selectAllTextOnEdit: boolean,
    title: string,
}

export enum TaskGroup {
    DONE = 'DONE',
    TODO = 'TODO',
    WIP = 'WIP',
}

export type TaskDataList = {
    [group in TaskGroup]: TaskData[]
};

export type TaskLocation = {
    group: TaskGroup,
    index: number,
};



/* TASKS SPECIFICS */
// Enhance: make it a class?
// Enhance: make group part of the task data?


export function createTask(title: string, done: boolean, id: number) {
    const task: TaskData = {
        done,
        editable: false,
        id,
        selectAllTextOnEdit: true,
        title,
    }

    return task;
};

export function createEmptyTaskList(): TaskDataList {
    const emptyTaskList: any = {};
    for (const groupKey of Object.keys(TaskGroup)) {
        const group: TaskGroup = TaskGroup[groupKey];
        emptyTaskList[group] = [];
    }

    return emptyTaskList;
}

export function tasksLength(tasks: TaskDataList): number {
    let length = 0;
    for (const group of Object.keys(TaskGroup)) {
        length += tasks[group].length;
    }
    return length;
}

export function findTaskById(tasks: TaskDataList, id: number): TaskLocation | null {
    for (const groupKey of Object.keys(TaskGroup)) {
        const group: TaskGroup = TaskGroup[groupKey];
        const index: number = tasks[group].findIndex((task: TaskData) => task.id === id);
        if (index >= 0) {
            return {
                group,
                index,
            }
        }
    }
    return null;
}

export function copyTasks(givenTasks: TaskDataList): TaskDataList {
    const tasks: TaskDataList = createEmptyTaskList();
    for (const group of Object.keys(TaskGroup)) {
        tasks[group] = givenTasks[group].slice();
    }

    return tasks;
}

export function insertTask(currentTasks: TaskDataList, newTask: TaskData, newTaskGroup: TaskGroup): TaskDataList {
    const tasks = copyTasks(currentTasks);
    tasks[newTaskGroup] = [newTask].concat(tasks[newTaskGroup]);

    return tasks;
}

export function deleteTaskByLocation(currentTasks: TaskDataList, location: TaskLocation): TaskDataList {
    const tasks = copyTasks(currentTasks);
    const group = tasks[location.group];
    tasks[location.group] = group.slice(0, location.index).concat(group.slice(location.index + 1, group.length));

    return tasks;
}