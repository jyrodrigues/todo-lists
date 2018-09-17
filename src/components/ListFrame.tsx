import * as React from 'react';
import { css } from 'react-emotion';

const mystyle = css`
    width: 200px;
    height: 500px;
    border: 1px solid rgba(0, 0, 0, 0.2);
`;

function ListFrame(props: any) {
    return (
        <div className={mystyle}>Here is a div list frame for you</div>
    )
}

export default ListFrame;