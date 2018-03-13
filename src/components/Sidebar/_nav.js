export default {
    items: [
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
        },
        {
            name: 'Architecture',
            url: '/architecture',
            icon: 'icon-list',
            badge: {
                variant: 'info',
                text: 'TODO'
            },
            children: [
                {
                    name: 'Structure',
                    url: '/architecture/structure',
                    icon: 'icon-puzzle',
                    badge: {
                        variant: 'info',
                        text: 'TODO'
                    }
                },
                {
                    name: 'File Types',
                    url: '/architecture/file-types',
                    icon: 'icon-puzzle'
                }
            ]
        },
        {
            name: 'Resource Management',
            url: '/resource-management',
            icon: 'fa fa-code',
            children: [
                {
                    name: 'Activity',
                    url: '/resource-management/activity',
                    icon: 'icon-puzzle'
                },
                {
                    name: 'Knowledge Distribution',
                    url: '/resource-management/knowledge-distribution',
                    icon: 'icon-puzzle'
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
                    name: 'Code Ownership',
                    url: '/resource-management/code-ownership',
                    icon: 'fa fa-area-chart',
                    badge: {
                        variant: 'info',
                        text: 'FEATURE'
                    }
                }
            ]
        },
        {
            name: 'Risk Management',
            url: '/risk-management',
            icon: 'icon-fire',
            badge: {
                variant: 'info',
                text: 'TODO'
            },
            children: [
                {
                    name: 'Hotspots',
                    url: '/risk-management/hotspots',
                    icon: 'icon-puzzle'
                },
                {
                    name: 'Refactoring Targets',
                    url: '/risk-management/refactoring-targets',
                    icon: 'fa fa-refresh',
                    badge: {
                        variant: 'info',
                        text: 'FEATURE'
                    }
                },
                {
                    name: 'Temporal Coupling',
                    url: '/risk-management/temporal-coupling',
                    icon: 'fa fa-clock-o',
                    badge: {
                        variant: 'info',
                        text: 'FEATURE'
                    }
                }
            ]
        },
        {
            name: 'Quality Management',
            url: '/quality-management',
            icon: 'fa fa-table',
            children: [
                {
                    name: 'Test Coverage',
                    url: '/quality-management/test-coverage',
                    icon: 'fa fa-tasks',
                    badge: {
                        variant: 'info',
                        text: 'FEATURE'
                    }
                },
                {
                    name: 'Clone Detection',
                    url: '/quality-management/clone-detection',
                    icon: 'fa fa-clone',
                    badge: {
                        variant: 'info',
                        text: 'FEATURE'
                    }
                },
            ]
        }
    ]
};
