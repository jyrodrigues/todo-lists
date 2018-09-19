import * as React from 'react';
import styled, { css } from 'react-emotion';



/* TYPES */


export type taskData = {
    done: boolean,
    title: string
}

export type taskProps
    = taskData
    & taskCallbacks
    & {
        onChange: () => void
    };

type stateType = any;

export type taskCallbacks = {
    cb1: () => number,
    cb2: (e: any) => number
}


/* STYLES */


const TaskWrapper = styled('label')`
    display: block;
    margin: 3px;
    padding: 5px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 3px;
    cursor: pointer;
    user-select: none;

    &:hover {
        background-color: ${(props : { done: boolean }) => props.done ? 'rgba(255,0,0,0.1);' : 'rgba(0,255,0,0.1);'}
        box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    }
`;

const spanStyle = css`
    padding: 5px;
`;



/* COMPONENT */


class Task extends React.Component<taskProps, stateType> {
    public constructor(props: taskProps) {
        super(props);
    }

    public render() {
        return (
            <TaskWrapper done={this.props.done} >
                <input type="checkbox" onChange={this.props.onChange} defaultChecked={this.props.done}/>
                <span className={spanStyle}>{this.props.title}</span>
                <span>{this.props.cb1()}</span>
                <span>{this.props.cb2(3)}</span>
            </TaskWrapper>
        );
    }
}

export default Task;