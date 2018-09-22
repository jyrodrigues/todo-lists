import { StyledOtherComponent } from 'create-emotion-styled';
import * as React from 'react';
import styled, { css } from 'react-emotion';
import binder from '../binder';
import { TaskData } from './TaskData';



/* TYPES */


export type TaskCallbacks = {
    onChangeStatus: (e: React.FormEvent<HTMLInputElement>) => void,
    onChangeTitle: (e: React.FormEvent<HTMLInputElement>) => void,
    onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void,
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
    onClick: (e: React.MouseEvent<HTMLSpanElement>) => void,
}

export type TaskProps
    = TaskData
    & TaskCallbacks;

export type TaskState = {};

type TaskWrapperProps = {
    done: boolean,
}

type TaskWrapperType = StyledOtherComponent<
    TaskWrapperProps,
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    any // := Theme
>



/* STYLES */


const TaskWrapper : TaskWrapperType = styled('div')`
    display: block;
    margin: 3px;
    padding: 5px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 3px;
    cursor: pointer;
    user-select: none;

    &:hover {
        background-color: ${(props : TaskWrapperProps) => props.done ? 'rgba(0,255,0,0.1);' : 'rgba(255,0,0,0.1);'}
        box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    }
`;

const titleStyle = css`
    padding: 5px;
`;



/* COMPONENT */


class Task extends React.Component<TaskProps, TaskState> {
    private titleInputRef: React.RefObject<HTMLInputElement>;

    public constructor(props: TaskProps) {
        super(props);

        this.titleInputRef = React.createRef();

        binder(this);
    }

    public componentDidUpdate() {
        const input : HTMLInputElement | null = this.titleInputRef.current;
        if (input instanceof HTMLInputElement) {
            input.focus()

            if (this.props.selectAllTextOnEdit) {
                input.select();
            }
        }
    }

    public render() {
        return (
            <TaskWrapper draggable={true} onDragStart={this.onDragStart} done={this.props.done} >
                <input type="checkbox" onChange={this.props.onChangeStatus} defaultChecked={this.props.done}/>
                {this.renderTitle()}
                <button onClick={this.props.onDelete}>Del</button>
            </TaskWrapper>
        );
    }

    private renderTitle() : JSX.Element {
        if (this.props.editable) {
            return (
                <input
                    type="text"
                    ref={this.titleInputRef}
                    className={titleStyle}
                    defaultValue={this.props.title || '---'}
                    onChange={this.props.onChangeTitle}
                    onBlur={this.props.onBlur}
                />
            );
        }

        return <span onClick={this.props.onClick}>{this.props.title || '---'}</span>
    }

    private onDragStart(e : React.DragEvent<HTMLDivElement>) {
        const data = JSON.stringify({ id: this.props.id });
        e.dataTransfer.setData('testando', data);
    }
}

export default Task;