import React from "react";

//testing stuff
import { shallow, mount, render } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });

//component to test
import StaticCodeAnalysisPMD from "../../../../../../views/Dashboard/QualityManagement/StaticCodeAnalysis/PMD/PMD";
import { expect } from "chai";

describe("<StaticCodeAnalysisPMD />", () => {
    it("should render without throwing an error", () => {
        var wrapper = shallow(<StaticCodeAnalysisPMD />);
        wrapper.setState({
            pmdData: {
                "Error Prone": [
                    {
                        fqn: "org.junit.internal.runners.ClassRoadie",
                        package: "org.junit.internal.runners",
                        className: "ClassRoadie",
                        method: "runProtected",
                        beginLine: 45,
                        endLine: 46,
                        beginColumn: 11,
                        endColumn: 9,
                        message: "\nAvoid empty catch blocks\n",
                        ruleSet: "Error Prone",
                        priority: 3,
                        externalInfoUrl:
                            "https://pmd.github.io/pmd-6.0.1/pmd_rules_java_errorprone.html#emptycatchblock"
                    }
                ],
                "Code Style": [
                    {
                        fqn: "org.junit.Assume",
                        package: "org.junit",
                        className: "Assume",
                        method: null,
                        beginLine: 1,
                        endLine: 173,
                        beginColumn: 1,
                        endColumn: 2,
                        message:
                            "\nToo many static imports may lead to messy code\n",
                        ruleSet: "Code Style",
                        priority: 3,
                        externalInfoUrl:
                            "https://pmd.github.io/pmd-6.0.1/pmd_rules_java_codestyle.html#toomanystaticimports"
                    }
                ],
                "Best Practices": [
                    {
                        fqn: "org.junit.internal.runners.ErrorReportingRunner",
                        package: "org.junit.internal.runners",
                        className: "ErrorReportingRunner",
                        method: "getDescription",
                        beginLine: 40,
                        endLine: 40,
                        beginColumn: 24,
                        endColumn: 27,
                        message:
                            "\nAvoid unused local variables such as 'each'.\n",
                        ruleSet: "Best Practices",
                        priority: 3,
                        externalInfoUrl:
                            "https://pmd.github.io/pmd-6.0.1/pmd_rules_java_bestpractices.html#unusedlocalvariable"
                    }
                ],
                Multithreading: [
                    {
                        fqn:
                            "org.junit.internal.runners.statements.FailOnTimeout",
                        package: "org.junit.internal.runners.statements",
                        className: "FailOnTimeout",
                        method: "evaluate",
                        beginLine: 123,
                        endLine: 123,
                        beginColumn: 39,
                        endColumn: 49,
                        message:
                            "\nAvoid using java.lang.ThreadGroup; it is not thread safe\n",
                        ruleSet: "Multithreading",
                        priority: 3,
                        externalInfoUrl:
                            "https://pmd.github.io/pmd-6.0.1/pmd_rules_java_multithreading.html#avoidthreadgroup"
                    }
                ],
                Design: [
                    {
                        fqn: "org.junit.rules.TemporaryFolder",
                        package: "org.junit.rules",
                        className: "TemporaryFolder",
                        method: "delete",
                        beginLine: 268,
                        endLine: 270,
                        beginColumn: 13,
                        endColumn: 13,
                        message:
                            "\nThese nested if statements could be combined\n",
                        ruleSet: "Design",
                        priority: 3,
                        externalInfoUrl:
                            "https://pmd.github.io/pmd-6.0.1/pmd_rules_java_design.html#collapsibleifstatements"
                    }
                ]
            },
            alertColors: ["worstcase", "danger", "warning", "info", "secondary"]
        });
        var html = wrapper.html();

        expect(html).to.contain(
            '<div class="card-header">Error Prone (1)<div class="card-actions"><span><button class="mr-1" color="secondary" id="Popover-0"><i class="text-muted fa fa-question-circle"></i></button></span></div></div>'
        );
        expect(html).to.contain(
            '<div class="card-header">Code Style (1)<div class="card-actions"><span><button class="mr-1" color="secondary" id="Popover-1"><i class="text-muted fa fa-question-circle"></i></button></span></div></div>'
        );
        expect(html).to.contain(
            '<div class="card-header">Best Practices (1)<div class="card-actions"><span><button class="mr-1" color="secondary" id="Popover-2"><i class="text-muted fa fa-question-circle"></i></button></span></div></div>'
        );
        expect(html).to.contain(
            '<div class="card-header">Multithreading (1)<div class="card-actions"><span><button class="mr-1" color="secondary" id="Popover-3"><i class="text-muted fa fa-question-circle"></i></button></span></div></div>'
        );
        expect(html).to.contain(
            '<div class="card-header">Design (1)<div class="card-actions"><span><button class="mr-1" color="secondary" id="Popover-4"><i class="text-muted fa fa-question-circle"></i></button></span></div></div>'
        );
    });
});
