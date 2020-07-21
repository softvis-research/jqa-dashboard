import React from "react";
import * as d3 from "d3";
import DashboardAbstract, {
    databaseCredentialsProvided
} from "../../../AbstractDashboardComponent";
import LayersModel from "../../../../../api/models/LayersModel";
import CollapsibleIndentedTree from "./CollapsibleIndentedTree";

const url =
    "https://raw.githubusercontent.com/d3/d3-hierarchy/master/test/data/flare.json";

class LayersVisualization extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            layersData: []
        };
    }

    componentDidMount() {
        if (databaseCredentialsProvided) {
            let layersModel = new LayersModel();
            layersModel.readLayers(this);
        }
    }

    render() {
        return <CollapsibleIndentedTree />;
    }
}

export default LayersVisualization;
