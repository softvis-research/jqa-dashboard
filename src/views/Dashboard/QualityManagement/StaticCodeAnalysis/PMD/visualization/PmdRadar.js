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

        var radarData = [];
        {Object.keys(pmdData).map(function(key, i) {
            var violation = {};
            violation.ruleSet = key;
            violation.violations = pmdData[key] ? pmdData[key].length : 0;
            radarData.push(violation);
        }, this)}

        return (
            <ResponsiveRadar
                data={radarData}
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
