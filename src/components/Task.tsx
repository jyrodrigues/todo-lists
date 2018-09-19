import { StyledOtherComponent } from 'create-emotion-styled';
import * as React from 'react';
import styled, { css } from 'react-emotion';



/* TYPES */


export type TaskData = {
    done: boolean,
    title: string,
    key: number,
}

export type TaskCallbacks = {
    onChangeStatus: (e: React.FormEvent<HTMLInputElement>) => void,
    onChangeTitle: (e: React.FormEvent<HTMLInputElement>) => void,
    onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void,
}

export type TaskProps
    = TaskData
    & TaskCallbacks;

export type TaskState = {};



/* STYLES */


const TaskWrapper : StyledOtherComponent<
    TaskProps,
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    any // := Theme
> = styled('div')`
    display: block;
    margin: 3px;
    padding: 5px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 3px;
    cursor: pointer;
    user-select: none;

    &:hover {
        background-color: ${(props : TaskProps) => props.done ? 'rgba(0,255,0,0.1);' : 'rgba(255,0,0,0.1);'}
        box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    }
`;

const titleStyle = css`
    padding: 5px;
`;



/* COMPONENT */


class Task extends React.Component<TaskProps, TaskState> {
    public constructor(props: TaskProps) {
        super(props);
    }

    public render() {
        return (
            <TaskWrapper {...this.props} >
                <input type="checkbox" onChange={this.props.onChangeStatus} defaultChecked={this.props.done}/>
                <input className={titleStyle} type="text" onChange={this.props.onChangeTitle} defaultValue={this.props.title}/>
                <button onClick={this.props.onDelete}>Del</button>
            </TaskWrapper>
        );
    }
}

export default Task;