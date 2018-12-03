import React from "react";
import DashboardAbstract, {
    databaseCredentialsProvided
} from "../../../../AbstractDashboardComponent";
import { ResponsiveRadar } from "@nivo/radar";
import PMDModel from "../../../../../../api/models/PMD";

var arraySort = require("array-sort");

class PmdRadar extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            pmdData: []
        };
    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount() {
        super.componentDidMount();

        if (databaseCredentialsProvided) {
            var pmdModel = new PMDModel();
            pmdModel.readPmdData(this);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    render() {
        var redirect = super.render();

        if (redirect.length > 0) {
            return redirect;
        }

        var pmdData = this.props.data;

        if (pmdData.loading) {
            return "";
        }

        var radarData = [];

        Object.keys(pmdData).map(function(key, i) {
            var violation = {};
            violation.ruleSet = key;
            violation.violations = pmdData[key] ? pmdData[key].length : 0;
            return radarData.push(violation);
        }, this);

        radarData = arraySort(radarData, "violations", { reverse: true });

        return (
            <div className={"visualization-wrapper"}>
                <div style={{ height: "400px" }}>
                    <ResponsiveRadar
                        data={radarData}
                        keys={["violations"]}
                        indexBy="ruleSet"
                        margin={{
                            top: 70,
                            right: 80,
                            bottom: 40,
                            left: 80
                        }}
                        curve="catmullRomClosed"
                        borderWidth={2}
                        borderColor="inherit"
                        gridLevels={5}
                        gridShape="circular"
                        gridLabelOffset={30}
                        enableDots={true}
                        dotSize={8}
                        dotColor="inherit"
                        dotBorderWidth={0}
                        dotBorderColor="#ffffff"
                        enableDotLabel={true}
                        dotLabel="value"
                        dotLabelYOffset={-12}
                        colors="nivo"
                        colorBy="key"
                        fillOpacity={0.1}
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        isInteractive={true}
                    />
                </div>
            </div>
        );
    }
}

export default PmdRadar;
