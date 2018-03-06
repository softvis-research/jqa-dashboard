import QualityManagementHotspotsBubbleChartWithNavigationTreeAndHotspots from "./views/Dashboard/RiskManagement/Hotspots/BubbleChartWithNavigationTreeAndHotspots";

const routes = {
    '/': 'Home',
    '/history': 'History',
    '/behaviour': 'Behaviour',
    '/structure': 'Structure',
    '/architecture': 'Architecture',
    '/architecture/overview': 'Overview',
    '/architecture/overview/structure': 'Structure',
    '/architecture/languages/files-per-file-type': 'Files per File Type',
    '/resource-management': 'Resource Management',
    '/resource-management/code-ownership': 'Code Ownership',
    '/resource-management/code-ownership/commits-and-files-per-author': 'Commits and Files per Author',
    '/resource-management/code-ownership/files-per-file-type-per-author': 'Files per File Type per Author',
    '/resource-management/code-churn': 'Code Churn',
    '/resource-management/activity': 'Activity',
    '/resource-management/activity/latest-commits': 'Latest Commits',
    '/risk-management': 'Risk Management',
    '/risk-management/hotspots': 'Hotspots',
    '/risk-management/hotspots/bubble-chart-with-navigation-tree-and-hotspots': 'Bubble Chart with Navigation Tree and Hotspots',
    '/risk-management/refactoring-targets': 'Refactoring Targets',
    '/risk-management/temporal-coupling': 'Temporal Coupling',
    '/quality-management': 'Quality Management',
    '/quality-management/metrics': 'Metrics',
    '/quality-management/test-coverage': 'Test Coverage',
    '/quality-management/clone-detection': 'Clone Detection',
    '/custom-query': 'Custom Cypher Query',
    '/settings': 'Settings'
};

export default routes;
