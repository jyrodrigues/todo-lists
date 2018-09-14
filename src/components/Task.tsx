import * as React from 'react';
import binder from '../binder';
import mystyle from './Styles';

const mycolor: string = 'hotpink';
const secondary: string = 'aqua';

type propsType = any;
type stateType = any;
class Task extends React.Component<propsType, stateType> {
    public constructor(props: propsType) {
        super(props);
        this.state = {
            myColor: this.props.color || mycolor,
            secondary
        };
        binder(this);
    }

    public changeColor() {
        this.setState({
            myColor: this.state.secondary,
            secondary: this.state.myColor
        })
    }

    public render() {
        return (
            <p onClick={this.changeColor} className={[this.props.className, mystyle(this)].join(' ')} >
                Thus a component
            </p>
        );
    }
}

export default Task;