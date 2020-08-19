import React from "react";

const HeaderDecorator = ({ node, style }) => {
    return (
        <div style={style.base}>
            <div style={style.title}>{node.name}</div>
        </div>
    );
};

export default HeaderDecorator;
