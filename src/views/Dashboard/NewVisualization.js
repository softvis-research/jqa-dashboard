import React, { Component } from 'react';
import DashboardAbstract, { neo4jSession } from './Abstract';

import { CypherEditor } from "graph-app-kit/components/Editor";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/lint/lint.css";
import "cypher-codemirror/dist/cypher-codemirror-syntax.css";

class NewVisualization extends DashboardAbstract {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        super.componentDidMount();
    }

    render() {
        return (
            <div>
                <h2>Type Cypher query here:</h2>
                <CypherEditor
                    value="RETURN 1"
                    options={{
                        mode: "cypher",
                        theme: "cypher",
                        lineNumberFormatter: line => line
                    }}
                />
            </div>
        )
    }
}

export default NewVisualization;
