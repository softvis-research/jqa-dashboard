import React, { Component } from "react";
import { CardHeader, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { AppSwitch } from "@coreui/react";
import $ from "jquery";

class CustomCardHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popoverOpen: false,
            popovers: [
                {
                    placement: "bottom",
                    text: "Bottom"
                }
            ]
        };

        this.toggleInfo = this.toggleInfo.bind(this);
    }

    componentDidMount() {
        $(".expert-mode").on("change", function() {
            var editor = $(".expert-mode-editor");
            var visualizationWrapper = $(".visualization-wrapper");
            if (editor.hasClass("hide-expert-mode")) {
                editor.removeClass("hide-expert-mode");
                visualizationWrapper.addClass("margin-top-50 margin-bottom-50");
            } else {
                editor.addClass("hide-expert-mode");
                visualizationWrapper.removeClass(
                    "margin-top-50 margin-bottom-50"
                );
            }
        });
    }

    toggleInfo() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        var headerText = this.props.cardHeaderText;
        var showExpertMode = this.props.showExpertMode;
        var popoverPlacement = this.props.placement;
        //var popoverIsOpen = this.props.isOpen;
        var popoverTarget = this.props.target;
        //var popoverToggle = this.props.toggle;
        var popoverHeaderText = this.props.popoverHeaderText;
        var popoverBody = this.props.popoverBody;

        var expertToggle = "";
        if (showExpertMode) {
            expertToggle = (
                <div className={"float-left"}>
                    <div className={"float-left expert-label"}>Expert mode</div>
                    <AppSwitch
                        className={"mx-1 float-right display-block expert-mode"}
                        color={"secondary"}
                        size={"sm"}
                        label
                    />
                </div>
            );
        }

        return (
            <CardHeader>
                {headerText}
                <div className="card-actions">
                    {expertToggle}
                    <button onClick={this.toggleInfo} id="Popover1">
                        <i className="text-muted fa fa-question-circle" />
                    </button>
                    <Popover
                        placement={popoverPlacement}
                        isOpen={this.state.popoverOpen}
                        target={popoverTarget}
                        toggle={this.toggleInfo}
                    >
                        <PopoverHeader>{popoverHeaderText}</PopoverHeader>
                        <PopoverBody>{popoverBody}</PopoverBody>
                    </Popover>
                </div>
            </CardHeader>
        );
    }
}

export default CustomCardHeader;
