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
            icon: 'fa fa-cubes',
            children: [
                {
                    name: 'Structure',
                    url: '/architecture/structure',
                    icon: 'fa fa-sitemap',
                    badge: {
                        variant: 'info',
                        text: 'TODO'
                    }
                },
                {
                    name: 'File Types',
                    url: '/architecture/file-types',
                    icon: 'icon-docs'
                }
            ]
        },
        {
            name: 'Resource Management',
            url: '/resource-management',
            icon: 'icon-people',
            children: [
                {
                    name: 'Activity',
                    url: '/resource-management/activity',
                    icon: 'fa fa-heartbeat'
                },
                {
                    name: 'Knowledge Distribution',
                    url: '/resource-management/knowledge-distribution',
                    icon: 'icon-bulb'
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
                    icon: 'fa fa-code',
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
            icon: 'fa fa-exclamation-triangle',
            children: [
                {
                    name: 'Hotspots',
                    url: '/risk-management/hotspots',
                    icon: 'icon-fire'
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
            icon: 'icon-badge',
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
