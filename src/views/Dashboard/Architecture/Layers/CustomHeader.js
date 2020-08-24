import React from "react";

const CustomHeader = ({ node, style }) => {
    const newBaseStyle = { ...style.base };

    const onMouseOver = node => {
        if (node.data.isValid) {
            document
                .getElementById(node.id)
                .classList.add("circle-hovered-valid");
            if (node.data.hasOwnProperty("dependency")) {
                document
                    .getElementById(node.data.dependency)
                    .classList.add("circle-hovered-valid");
            }
        } else if (node.data.hasOwnProperty("isValid") && !node.data.isValid) {
            document
                .getElementById(node.id)
                .classList.add("circle-hovered-invalid");
        } else {
            document
                .getElementById(node.id)
                .classList.add("circle-hovered-default");
        }
    };

    function removeHighlight(nodeId) {
        document
            .getElementById(nodeId)
            .classList.remove("circle-hovered-valid");
        document
            .getElementById(nodeId)
            .classList.remove("circle-hovered-invalid");
        document
            .getElementById(nodeId)
            .classList.remove("circle-hovered-default");
    }

    const onMouseLeave = node => {
        removeHighlight(node.id);
        if (node.data.hasOwnProperty("dependency")) {
            removeHighlight(node.data.dependency);
        }
    };

    if (node.data.isValid != null) {
        if (!node.data.isValid) {
            newBaseStyle.color = "#EF654C";
        } else {
            newBaseStyle.color = "#35a47f";
        }
    }

    return (
        <div
            style={newBaseStyle}
            onMouseOver={() => onMouseOver(node)}
            onMouseLeave={() => onMouseLeave(node)}
        >
            {node.name}
        </div>
    );
};

export default CustomHeader;
