import { css } from 'react-emotion';

const mystyle = (comp: React.Component<any, any>) => {
    return css`
        cursor: pointer;
        user-select: none;
        color: ${comp.state.myColor};
        ${comp.props.className};
    `;
}

export default mystyle;