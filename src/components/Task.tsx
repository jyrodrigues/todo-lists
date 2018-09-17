import * as React from 'react';
import styled, { css } from 'react-emotion';

type propsType = any;
type stateType = any;

const TaskWrapper = styled('label')`
    display: block;
    margin: 3px;
    padding: 5px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 3px;
    cursor: pointer;
    user-select: none;

    &:hover {
        background-color: ${(props : any) => props.done ? 'rgba(255,0,0,0.1);' : 'rgba(0,255,0,0.1);'}
        box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    }
`;

const spanStyle = css`
    padding: 5px;
`;

// const sum4 = (a : any) => a + 4;
// const nada = () => {sum4(3)};

type Proptype = any & { onClickParentCb: (e: any) => void }

class Task extends React.Component<Proptype, stateType> {
    public constructor(props: propsType) {
        super(props);
    }

    public render() {
        return (
            <TaskWrapper done={this.props.done} >
                {/* <input type="checkbox" checked={this.props.done} onChange={this.props.onClickParentCb} /> */}
                <input type="checkbox" onChange={this.props.onClickParentCb} checked={this.props.done} />
                <span className={spanStyle}>{this.props.title}</span>
            </TaskWrapper>
        );
    }
}

export default Task;