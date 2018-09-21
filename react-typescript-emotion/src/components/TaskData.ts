

export type TaskData = {
    done: boolean,
    title: string,
    key: number,
    id: number,
    editable: boolean,
    selectAllTextOnEdit: boolean,
}

export type TaskDataList = {
    [group in TaskGroup] : TaskData[]
};

export type TaskLocation = {
    group : string,
    index : number,
};

export enum TaskGroup {
    TODO = 'TODO',
    DONE = 'DONE',
}



/* TASKS SPECIFICS */
// Enhance: make it a class?
// Enhance: make group part of the task data?


export function createTask(title: string, done: boolean, id: number) {
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

export function tasksLength(tasks : TaskDataList) : number {
    let length = 0;
    for (let group in TaskGroup) {
        length += tasks[group].length;
    }
    return length;
}

// Enhance: change string to TaskGroup
// export function findTaskById(tasks : TaskDataList, id: number) : ({ group : TaskGroup, index : number } | null) {
export function findTaskById(tasks : TaskDataList, id: number) : TaskLocation | null {
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

export function copyTasks(givenTasks : TaskDataList) : TaskDataList {
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
// export function insertTask(currentTasks : TaskDataList, newTask : TaskData, newTaskGroup : TaskGroup) : TaskDataList {
export function insertTask(currentTasks : TaskDataList, newTask : TaskData, newTaskGroup : string) : TaskDataList {
    let tasks = copyTasks(currentTasks);
    tasks[newTaskGroup] = [newTask].concat(tasks[newTaskGroup]);

    return tasks;
}

export function deleteTaskByLocation(currentTasks : TaskDataList, location : TaskLocation) : TaskDataList {
    let tasks = copyTasks(currentTasks);
    let group = tasks[location.group];
    tasks[location.group] = group.splice(0, location.index).concat(group.splice(location.index + 1, group.length));

    return tasks;
}