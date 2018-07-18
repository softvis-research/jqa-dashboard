import React from "react";
import DashboardAbstract, {
    databaseCredentialsProvided
} from "../../../AbstractDashboardComponent";
import { ResponsiveBar } from "@nivo/bar";
import { LegendSvgItem } from "@nivo/legends";
import FilesPerFiletypePerAuthorModel from "../../../../../api/models/FilesPerFiletypePerAuthor";

var stringToColour = require("string-to-color");
var authorToFilterBy;

class FilesPerFiletypePerAuthor extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            dataKeys: []
        };
    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount() {
        super.componentDidMount();
        if (databaseCredentialsProvided) {
            var filesPerFiletypePerAuthorModel = new FilesPerFiletypePerAuthorModel();
            filesPerFiletypePerAuthorModel.readData(this, authorToFilterBy);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        authorToFilterBy = null;
    }

    handleAction(event) {
        var action = event.action;
        switch (action.actionType) {
            case "SELECT_COMMITSPERAUTHOR":
                authorToFilterBy = action.data.indexValue;
                var filesPerFiletypePerAuthorModel = new FilesPerFiletypePerAuthorModel();
                filesPerFiletypePerAuthorModel.readData(this, authorToFilterBy);
                break;
            default:
                return true;
        }
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
            return redirect;
        }

        if (this.state.data.length === 0) {
            return "";
        }

        var legendItems = [];
        var yPosition = 0;
        for (var i = 0; i < this.state.dataKeys.length; i++) {
            var label = this.state.dataKeys[i];
            if (label.indexOf("/") !== -1) {
                continue; //filter out obviously broken elements
            }
            yPosition += 20;
            var legendSvgItem = (
                <LegendSvgItem
                    key={i}
                    x={0}
                    y={yPosition}
                    width={20}
                    height={35}
                    label={label}
                    fill={stringToColour(label)}
                    textColor={"#151b1e"}
                />
            );
            legendItems.push(legendSvgItem);
        }

        //TODO: calculate height from this.state.dataKeys.length
        return (
            <div>
                <div style={{ height: "4000px", width: "85%", float: "left" }}>
                    <ResponsiveBar
                        onClick={function(event) {
                            console.log(event);
                        }}
                        data={this.state.data}
                        keys={this.state.dataKeys}
                        indexBy="author"
                        margin={{
                            top: 0,
                            right: 20,
                            bottom: 50,
                            left: 150
                        }}
                        padding={0.05}
                        groupMode="stacked"
                        layout="horizontal"
                        colors="nivo"
                        //colorBy="id"
                        colorBy={function(e) {
                            return stringToColour(e.id);
                        }}
                        defs={[
                            {
                                id: "dots",
                                type: "patternDots",
                                background: "inherit",
                                color: "#38bcb2",
                                size: 4,
                                padding: 1,
                                stagger: true
                            },
                            {
                                id: "lines",
                                type: "patternLines",
                                background: "inherit",
                                color: "#eed312",
                                rotation: -45,
                                lineWidth: 6,
                                spacing: 10
                            }
                        ]}
                        borderColor="inherit:darker(1.6)"
                        axisBottom={{
                            orient: "bottom",
                            tickSize: 5,
                            tickPadding: 15,
                            tickRotation: 0,
                            legend: "# Files",
                            legendPosition: "center",
                            legendOffset: 46
                        }}
                        axisLeft={{
                            orient: "left",
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: "Authors",
                            legendPosition: "center",
                            legendOffset: -140
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor="inherit:darker(1.6)"
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                    />
                </div>
                <div style={{ width: "14%", float: "left", marginTop: "45px" }}>
                    <svg id={"dummyLegend"} style={{ overflow: "visible" }}>
                        {legendItems}
                    </svg>
                </div>
            </div>
        );
    }
}

export default FilesPerFiletypePerAuthor;
