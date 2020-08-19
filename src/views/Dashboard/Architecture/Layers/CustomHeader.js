import React, { useState } from "react";

const CustomHeader = ({ node, style }) => {
    const newBaseStyle = { ...style.base };

    if (node.data.isValid != null) {
        if (!node.data.isValid) {
            newBaseStyle.color = "#EF654C";
        } else {
            newBaseStyle.color = "#35a47f";
        }
    }

    /*
  const onMouseOver = node => {
    nodes.push(document.getElementById(node.id));
    if (node.dependency) {
      nodes.push(document.getElementById(node.dependency));
    }
    document.getElementById(node.id).style.borderColor = "#82d3e7"
    //document.getElementById(node.dependency).style.borderColor = "#82d3e7"
  };

  const onMouseLeave = node => {
    document.getElementById(node.id).style.borderColor = nodes.find(node => node.id).borderColor
    nodes.splice(nodes.indexOf(node.id))
  };


   */
    return <div style={newBaseStyle}>{node.name}</div>;
};

export default CustomHeader;
