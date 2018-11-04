import React from "react";
import DashboardAbstract, {
    databaseCredentialsProvided
} from "../../../AbstractDashboardComponent";
import FileTypesModel from "../../../../../api/models/FileTypes";
import { ResponsivePie } from "@nivo/pie";

var stringToColour = require("string-to-color");
var AppDispatcher = require("../../../../../AppDispatcher");

class FileType extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            filetypeData: []
        };
    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount() {
        super.componentDidMount();

        if (databaseCredentialsProvided) {
            var fileTypesModel = new FileTypesModel();
            fileTypesModel.readFiletypes(this);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    handleAction(event) {
        var action = event.action;
        switch (action.actionType) {
            case "EXPERT_QUERY":
                if (databaseCredentialsProvided) {
                    var fileTypesModel = new FileTypesModel();
                    fileTypesModel.readFiletypes(this);
                }
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

        if (this.state.filetypeData.length === 0) {
            return "";
        }

        return (
            <div className={"visualization-wrapper"}>
                <div style={{ height: "600px" }}>
                    <ResponsivePie
                        data={this.state.filetypeData}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20
                        }}
                        onClick={function(event) {
                            console.log(event);
                            AppDispatcher.handleAction({
                                actionType: "SELECT_FILETYPE",
                                data: event
                            });
                        }}
                        innerRadius={0}
                        padAngle={0}
                        cornerRadius={0}
                        colors="nivo"
                        //colorBy="id"
                        colorBy={function(e) {
                            return stringToColour(e.id);
                        }}
                        borderColor="inherit:darker(0.6)"
                        radialLabelsSkipAngle={5}
                        radialLabelsTextXOffset={6}
                        radialLabelsTextColor="#333333"
                        radialLabelsLinkOffset={0}
                        radialLabelsLinkDiagonalLength={16}
                        radialLabelsLinkHorizontalLength={24}
                        radialLabelsLinkStrokeWidth={1}
                        radialLabelsLinkColor="inherit"
                        slicesLabelsSkipAngle={5}
                        slicesLabelsTextColor="#333333"
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        legends={[
                            {
                                anchor: "top-right",
                                direction: "column",
                                translateX: -140,
                                translateY: 56,
                                itemWidth: 20,
                                itemHeight: 20,
                                symbolSize: 20,
                                itemsSpacing: 5,
                                symbolShape: "square"
                            }
                        ]}
                    />
                </div>
            </div>
        );
    }
}

export default FileType;
