import React, { Component } from "react";
import {
    CardHeader,
    Popover,
    PopoverHeader,
    PopoverBody,
    Tooltip
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import $ from "jquery";

class CustomCardHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltipOpen: [false, false],
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
        $(".expert-mode").each(function() {
            if ($(this).hasClass("expert-mode-set") === false) {
                $(this).on("change", function() {
                    var group = $(this)
                        .find("input")
                        .attr("id");
                    var editor = $(".expert-mode-editor");
                    var visualizationWrapper = $(".visualization-wrapper");
                    if (
                        typeof group !== "undefined" &&
                        editor.hasClass(group)
                    ) {
                        editor = $(".expert-mode-editor." + group);
                        visualizationWrapper = editor.next(
                            ".visualization-wrapper"
                        );
                    }

                    if (editor.hasClass("hide-expert-mode")) {
                        editor.removeClass("hide-expert-mode");
                        visualizationWrapper.addClass(
                            "margin-top-50 margin-bottom-50"
                        );
                        editor.parent(".card-body").addClass("height-auto");
                    } else {
                        editor.addClass("hide-expert-mode");
                        visualizationWrapper.removeClass(
                            "margin-top-50 margin-bottom-50"
                        );
                        editor.parent(".card-body").removeClass("height-auto");
                    }
                });
                $(this).addClass("expert-mode-set");
            }
        });
    }

    toggle(i) {
        const newArray = this.state.tooltipOpen.map((element, index) => {
            return index === i ? !element : false;
        });
        this.setState({
            tooltipOpen: newArray
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
        var cssClass = headerText.toLowerCase().replace(/\s/g, "-");

        var expertToggle = "";
        if (showExpertMode) {
            expertToggle = (
                <div className={"float-left"}>
                    <div id={"tooltip-" + cssClass}>
                        <AppSwitch
                            id={cssClass}
                            className={
                                "mx-1 float-right display-block expert-mode " +
                                cssClass
                            }
                            color={"secondary"}
                            size={"sm"}
                            label
                        />
                    </div>
                    <Tooltip
                        placement="top"
                        isOpen={this.state.tooltipOpen[0]}
                        target={"tooltip-" + cssClass}
                        toggle={() => {
                            this.toggle(0);
                        }}
                    >
                        Toggle expert mode
                    </Tooltip>
                </div>
            );
        }

        return (
            <CardHeader>
                {headerText}
                <div className="card-actions">
                    {expertToggle}
                    <button onClick={this.toggleInfo} id={popoverTarget}>
                        <i className="text-muted fa fa-question-circle" />
                    </button>
                    <Tooltip
                        placement="top"
                        isOpen={this.state.tooltipOpen[1]}
                        target={popoverTarget}
                        toggle={() => {
                            this.toggle(1);
                        }}
                    >
                        Show details
                    </Tooltip>
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
