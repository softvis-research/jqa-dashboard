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
            icon: 'fa fa-sitemap',
            children: [
                {
                    name: 'Structure',
                    url: '/architecture/structure'
                },
                {
                    name: 'File Types',
                    url: '/architecture/file-types'
                },
                {
                    name: 'Dependencies',
                    url: '/architecture/dependencies'
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
                    url: '/resource-management/activity'
                },
                {
                    name: 'Knowledge Distribution',
                    url: '/resource-management/knowledge-distribution'
                },
                /*
                {
                    name: 'Code Churn',
                    url: '/resource-management/code-churn',
                    badge: {
                        variant: 'info',
                        text: 'TODO'
                    }
                },
                {
                    name: 'Code Ownership',
                    url: '/resource-management/code-ownership',
                    badge: {
                        variant: 'info',
                        text: 'FEATURE'
                    }
                }
                */
            ]
        },
        {
            name: 'Risk Management',
            url: '/risk-management',
            icon: 'fa fa-exclamation-triangle',
            children: [
                {
                    name: 'Hotspots',
                    url: '/risk-management/hotspots'
                },
                /*
                {
                    name: 'Refactoring Targets',
                    url: '/risk-management/refactoring-targets',
                    badge: {
                        variant: 'info',
                        text: 'FEATURE'
                    }
                },
                {
                    name: 'Temporal Coupling',
                    url: '/risk-management/temporal-coupling',
                    badge: {
                        variant: 'info',
                        text: 'FEATURE'
                    }
                }
                */
            ]
        },
        {
            name: 'Quality Management',
            url: '/quality-management',
            icon: 'icon-badge',
            children: [
                {
                    name: 'Static Code Analysis',
                    url: '/quality-management/static-code-analysis',
                    children: [
                        {
                            name: 'PMD',
                            url: '/quality-management/static-code-analysis/pmd'
                        }
                    ]
                },
                {
                    name: 'Test Coverage',
                    url: '/quality-management/test-coverage'
                },
                /*
                {
                    name: 'Clone Detection',
                    url: '/quality-management/clone-detection',
                    badge: {
                        variant: 'info',
                        text: 'FEATURE'
                    }
                },
                */
            ]
        }
    ]
};
