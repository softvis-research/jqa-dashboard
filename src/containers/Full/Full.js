import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
//import Footer from '../../components/Footer/';

import History from '../../views/Dashboard/History';
import Behaviour from '../../views/Dashboard/Behaviour';
import Structure from '../../views/Dashboard/Structure';
import CustomQuery from '../../views/Dashboard/CustomQuery';
import Settings from '../../views/Dashboard/Settings';

// architecture
import ArchitectureOverviewStructure from '../../views/Dashboard/Architecture/Overview/Structure';
import ArchitectureLanguageFilesPerFileType from '../../views/Dashboard/Architecture/Language/FilesPerFileType';

// resource management
import ResourceManagementCodeOwnershipCommitsAndFilesPerAuthor from '../../views/Dashboard/ResourceManagement/CodeOwnership/CommitsAndFilesPerAuthor';
import ResourceManagementCodeOwnershipFilesPerFileTypePerAuthor from '../../views/Dashboard/ResourceManagement/CodeOwnership/FilesPerFileTypePerAuthor';
import ResourceManagementCodeChurn from '../../views/Dashboard/ResourceManagement/CodeChurn';
import ResourceManagementActivityLatestCommits from '../../views/Dashboard/ResourceManagement/Activity/LatestCommits';

// risk management
import RiskManagementHotspotsBubbleChartWithNavigationTreeAndHotspots from '../../views/Dashboard/RiskManagement/Hotspots/BubbleChartWithNavigationTreeAndHotspots';
import RiskManagementRefactoringTargets from '../../views/Dashboard/RiskManagement/RefactoringTargets';
import RiskManagementTemporalCoupling from '../../views/Dashboard/RiskManagement/TemporalCoupling';

// quality management
import QualityManagementMetrics from '../../views/Dashboard/QualityManagement/Metrics';
import QualityManagementTestCoverage from '../../views/Dashboard/QualityManagement/TestCoverage';
import QualityManagementCloneDetection from '../../views/Dashboard/QualityManagement/CloneDetection';

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
                                <Route path="/history" name="History" component={History}/>
                                <Route path="/behaviour" name="Behaviour" component={Behaviour}/>
                                <Route path="/structure" name="Structure" component={Structure}/>
                                <Route path="/architecture/overview/structure" name="Structure" component={ArchitectureOverviewStructure}/>
                                <Route path="/architecture/language/files-per-file-type" name="Files per File Type" component={ArchitectureLanguageFilesPerFileType}/>
                                <Route path="/resource-management/code-ownership/commits-and-files-per-author" name="Commits and Files per Author" component={ResourceManagementCodeOwnershipCommitsAndFilesPerAuthor}/>
                                <Route path="/resource-management/code-ownership/files-per-file-type-per-author" name="Files per File Type per Author" component={ResourceManagementCodeOwnershipFilesPerFileTypePerAuthor}/>
                                <Route path="/resource-management/code-churn" name="Code Churn" component={ResourceManagementCodeChurn}/>
                                <Route path="/resource-management/activity/latest-commits" name="Latest Commits" component={ResourceManagementActivityLatestCommits}/>
                                <Route path="/risk-management/hotspots/bubble-chart-with-navigation-tree-and-hotspots" name="Bubble Chart with Navigation Tree and Hotspots" component={RiskManagementHotspotsBubbleChartWithNavigationTreeAndHotspots}/>
                                <Route path="/risk-management/refactoring-targets" name="Refactoring Targets" component={RiskManagementRefactoringTargets}/>
                                <Route path="/risk-management/temporal-coupling" name="Temporal Coupling" component={RiskManagementTemporalCoupling}/>
                                <Route path="/quality-management/metrics" name="Metrics" component={QualityManagementMetrics}/>
                                <Route path="/quality-management/test-coverage" name="Test Coverage" component={QualityManagementTestCoverage}/>
                                <Route path="/quality-management/clone-detection" name="Clone Detection" component={QualityManagementCloneDetection}/>
                                <Route path="/custom-query" name="Custom Cypher Query" component={CustomQuery}/>
                                <Route path="/settings" name="Settings" component={Settings}/>
                                <Redirect from="/" to="/history"/>
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
