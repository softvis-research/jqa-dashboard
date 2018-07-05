import React from 'react';

import DashboardAbstract from '../../../../AbstractDashboardComponent';

import {ResponsiveRadar} from '@nivo/radar';

class PmdRadar extends DashboardAbstract {

    render() {
        var redirect = super.render();

        if (redirect.length > 0) {
            return(redirect);
        }

        var pmdData = this.props.data;

        if (pmdData.loading) {
            return '';
        }

        return (
            <ResponsiveRadar
                data={[
                    {
                        "ruleSet": "Best Practices",
                        "violations": pmdData["Best Practices"] ? pmdData["Best Practices"].length : 0
                    },
                    {
                        "ruleSet": "Code Style",
                        "violations": pmdData["Code Style"] ? pmdData["Code Style"].length : 0
                    },
                    {
                        "ruleSet": "Design",
                        "violations": pmdData["Design"] ? pmdData["Design"].length : 0
                    },
                    {
                        "ruleSet": "Documentation",
                        "violations": pmdData["Documentation"] ? pmdData["Documentation"].length : 0
                    },
                    {
                        "ruleSet": "Error Prone",
                        "violations": pmdData["Error Prone"] ? pmdData["Error Prone"].length : 0
                    },
                    {
                        "ruleSet": "Multithreading",
                        "violations": pmdData["Multithreading"] ? pmdData["Multithreading"].length : 0
                    },
                    {
                        "ruleSet": "Performance",
                        "violations": pmdData["Performance"] ? pmdData["Performance"].length : 0
                    }
                ]}
                keys={[
                    "violations"
                ]}
                indexBy="ruleSet"
                margin={{
                    "top": 70,
                    "right": 80,
                    "bottom": 40,
                    "left": 80
                }}
                curve="catmullRomClosed"
                borderWidth={2}
                borderColor="inherit"
                gridLevels={5}
                gridShape="circular"
                gridLabelOffset={36}
                enableDots={true}
                dotSize={8}
                dotColor="inherit"
                dotBorderWidth={0}
                dotBorderColor="#ffffff"
                enableDotLabel={true}
                dotLabel="value"
                dotLabelYOffset={-12}
                colors="nivo"
                colorBy="key"
                fillOpacity={0.1}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                isInteractive={true}
            />
        )
    }
}

export default PmdRadar;
