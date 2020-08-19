import React from "react";

const CustomHeader = ({ node, style }) => {
    const newBaseStyle = { ...style.base };

    if (node.data.isValid != null) {
        if (!node.data.isValid) {
            newBaseStyle.color = "#EF654C";
        } else {
            newBaseStyle.color = "#35a47f";
        }
    }

    return <div style={newBaseStyle}>{node.name}</div>;
};

export default CustomHeader;
