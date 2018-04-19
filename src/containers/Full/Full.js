import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
//import Footer from '../../components/Footer/';

import CustomQuery from '../../views/Dashboard/Header/CustomQuery';
import Settings from '../../views/Dashboard/Header/Settings';

// dashboard
import Dashboard from '../../views/Dashboard/Dashboard';

// architecture
import ArchitectureStructure from '../../views/Dashboard/Architecture/Structure/Structure';
import ArchitectureFileTypes from '../../views/Dashboard/Architecture/FileTypes/FileTypes';
import ArchitectureDependencies from '../../views/Dashboard/Architecture/Dependencies/Dependencies';

// resource management
import ResourceManagementCodeOwnership from '../../views/Dashboard/ResourceManagement/CodeOwnership/CodeOwnership';
import ResourceManagementKnowledgeDistribution from '../../views/Dashboard/ResourceManagement/KnowledgeDistribution/KnowledgeDistribution';
import ResourceManagementCodeChurn from '../../views/Dashboard/ResourceManagement/CodeChurn/CodeChurn';
import ResourceManagementActivity from '../../views/Dashboard/ResourceManagement/Activity/Activity';

// risk management
import RiskManagementHotspots from '../../views/Dashboard/RiskManagement/Hotspots/Hotspots';
import RiskManagementRefactoringTargets from '../../views/Dashboard/RiskManagement/RefactoringTargets/RefactoringTargets';
import RiskManagementTemporalCoupling from '../../views/Dashboard/RiskManagement/TemporalCoupling/TemporalCoupling';

// quality management
import QualityManagementTestCoverage from '../../views/Dashboard/QualityManagement/TestCoverage/TestCoverage';
import QualityManagementCloneDetection from '../../views/Dashboard/QualityManagement/CloneDetection/CloneDetection';

var gotoSettings = false;

class Full extends Component {

    render() {
        return (
            <div className="app">
                <Header/>
                <div className="app-body">
                    <Sidebar {...this.props}/>
                    <main className="main">
                        <Breadcrumb/>
                        <Container fluid>
                            <Switch>
                                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                                <Route path="/architecture/structure" name="Structure" component={ArchitectureStructure}/>
                                <Route path="/architecture/file-types" name="File Types" component={ArchitectureFileTypes}/>
                                <Route path="/architecture/dependencies" name="Dependencies" component={ArchitectureDependencies}/>
                                <Route path="/resource-management/code-ownership" name="Code Ownership" component={ResourceManagementCodeOwnership}/>
                                <Route path="/resource-management/knowledge-distribution" name="Knowledge Distribution" component={ResourceManagementKnowledgeDistribution}/>
                                <Route path="/resource-management/code-churn" name="Code Churn" component={ResourceManagementCodeChurn}/>
                                <Route path="/resource-management/activity" name="Activity" component={ResourceManagementActivity}/>
                                <Route path="/risk-management/hotspots" name="Hotspots" component={RiskManagementHotspots}/>
                                <Route path="/risk-management/refactoring-targets" name="Refactoring Targets" component={RiskManagementRefactoringTargets}/>
                                <Route path="/risk-management/temporal-coupling" name="Temporal Coupling" component={RiskManagementTemporalCoupling}/>
                                <Route path="/quality-management/test-coverage" name="Test Coverage" component={QualityManagementTestCoverage}/>
                                <Route path="/quality-management/clone-detection" name="Clone Detection" component={QualityManagementCloneDetection}/>
                                <Route path="/custom-query" name="Custom Cypher Query" component={CustomQuery}/>
                                <Route path="/settings" name="Settings" component={Settings}/>
                                <Redirect from="/" to="/dashboard"/>
                            </Switch>
                        </Container>
                    </main>
                    <Aside/>
                </div>
            </div>
        );
    }
}

export default Full;
