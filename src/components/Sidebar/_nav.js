export default {
    items: [
        {
            title: true,
            name: 'Architecture',
        },
        {
            name: 'Overview',
            url: '/architecture/overview',
            icon: 'icon-list',
            badge: {
                variant: 'info',
                text: 'TODO'
            },
            children: [
                {
                    name: 'Structure',
                    url: '/architecture/overview/structure',
                    icon: 'icon-puzzle',
                    badge: {
                        variant: 'info',
                        text: 'TODO'
                    }
                },
            ]
        },
        {
            name: 'Language',
            url: '/architecture/language',
            icon: 'fa fa-language',
            children: [
                {
                    name: 'Files per File Type',
                    url: '/architecture/language/files-per-file-type',
                    icon: 'icon-puzzle'
                },
            ]
        },
        {
            title: true,
            name: 'Resource Management',
        },
        {
            name: 'Code Ownership',
            url: '/resource-management/code-ownership',
            icon: 'fa fa-code',
            children: [
                {
                    name: 'Commits and Files per Author',
                    url: '/resource-management/code-ownership/commits-and-files-per-author',
                    icon: 'icon-puzzle'
                },
                {
                    name: 'Files per File Type per Author',
                    url: '/resource-management/code-ownership/files-per-file-type-per-author',
                    icon: 'icon-puzzle'
                }
            ]
        },
        {
            name: 'Code Churn',
            url: '/resource-management/code-churn',
            icon: 'fa fa-area-chart',
            badge: {
                variant: 'info',
                text: 'TODO'
            }
        },
        {
            name: 'Activity',
            url: '/resource-management/activity',
            icon: 'fa fa-heartbeat',
            children: [
                {
                    name: 'Latest Commits',
                    url: '/resource-management/activity/latest-commits',
                    icon: 'icon-puzzle'
                },
            ]
        },
        {
            title: true,
            name: 'Risk Management',
        },
        {
            name: 'Hotspots',
            url: '/risk-management/hotspots',
            icon: 'icon-fire',
            badge: {
                variant: 'info',
                text: 'TODO'
            },
            children: [
                {
                    name: 'Bubble Chart with Navigation Tree and Hotspots',
                    url: '/risk-management/hotspots/bubble-chart-with-navigation-tree-and-hotspots',
                    icon: 'icon-puzzle',
                    badge: {
                        variant: 'info',
                        text: 'TODO'
                    }
                },
            ]
        },
        {
            name: 'Refactoring Targets',
            url: '/risk-management/refactoring-targets',
            icon: 'fa fa-refresh',
            badge: {
                variant: 'info',
                text: 'TODO'
            }
        },
        {
            name: 'Temporal Coupling',
            url: '/risk-management/temporal-coupling',
            icon: 'fa fa-clock-o',
            badge: {
                variant: 'info',
                text: 'TODO'
            }
        },
        {
            title: true,
            name: 'Quality Management',
        },
        {
            name: 'Metrics',
            url: '/quality-management/metrics',
            icon: 'fa fa-table',
            badge: {
                variant: 'info',
                text: 'TODO'
            }
        },
        {
            name: 'Test Coverage',
            url: '/quality-management/test-coverage',
            icon: 'fa fa-tasks',
            badge: {
                variant: 'info',
                text: 'TODO'
            }
        },
        {
            name: 'Clone Detection',
            url: '/quality-management/clone-detection',
            icon: 'fa fa-clone',
            badge: {
                variant: 'info',
                text: 'TODO'
            }
        },
        {
            name: 'Custom Query',
            url: '/custom-query',
            icon: 'fa fa-database',
            class: 'mt-auto',
            variant: 'success'
        },
    ]
};
