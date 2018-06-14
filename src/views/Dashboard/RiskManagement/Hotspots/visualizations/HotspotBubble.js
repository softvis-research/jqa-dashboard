import React from 'react';
import DashboardAbstract from '../../../AbstractDashboardComponent';
import tinygradient from 'tinygradient';

var AppDispatcher = require('../../../../../AppDispatcher');

import {ResponsiveBubbleHtml} from '@nivo/circle-packing';

class HotspotBubble extends DashboardAbstract {

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
            return(redirect);
        }

        var hotSpotData = this.props.data;
        var thisBackup = this.props.thisBackup;
        var maxCommits = this.props.maxCommits;

        if (!hotSpotData.name) {
            return '';
        }

        return (
            <div className={'hotspot-component'} style={{height: "600px"}}>
                <ResponsiveBubbleHtml
                    onClick={ function(event) {
                        AppDispatcher.handleAction({
                            actionType: 'SELECT_HOTSPOT_PACKAGE',
                            data: event
                        });
                    } }
                    root={hotSpotData}
                    margin={{
                        "top": 20,
                        "right": 20,
                        "bottom": 20,
                        "left": 20
                    }}
                    identity="name"
                    value="loc"
                    colors="nivo"
                    colorBy={ function (e) {
                        //TODO: clean up this code :)
                        var data = e.data;

                        var role = "undefined";
                        if (data && data.role) {
                            role = data.role;
                        }

                        if (data && data.commits && data.commits > 0 && role === "leaf" && maxCommits > 0) {

                            var level = data.level;
                            var r = 228 - (11 * level * 2);
                            var g = 242 - (6 * level * 2);
                            var b = 243 - (6 * level * 2);

                            var saturation = data.commits / maxCommits;

                            var rgbObject = tinygradient('rgb(' + r + ', ' + g + ', ' + b + ')', 'red').rgbAt(saturation);
                            //var rgbObject = tinygradient('rgb(5, 5, 5)', 'red').rgbAt(saturation);

                            r = Math.round(rgbObject._r);
                            g = Math.round(rgbObject._g);
                            b = Math.round(rgbObject._b);
                            return 'rgb(' + r + ', ' + g + ', ' + b + ')';
                        } else if (data) {
                            var level = data.level;
                            var r = 228 - (11 * level * 2);
                            var g = 242 - (6 * level * 2);
                            var b = 243 - (6 * level * 2);
                            return 'rgb(' + r + ', ' + g + ', ' + b + ')';
                        }
                    }}
                    padding={2}
                    enableLabel={false}
                    borderWidth={2}
                    defs={[
                        {
                            "id": "lines",
                            "type": "patternLines",
                            "background": "none",
                            "color": "inherit",
                            "rotation": -45,
                            "lineWidth": 5,
                            "spacing": 8
                        }
                    ]}
                    fill={[
                        {
                            "match": {
                                "depth": 1
                            },
                            "id": "lines"
                        }
                    ]}
                    animate={false}
                    motionStiffness={90}
                    motionDamping={12}
                    tooltip={({ id, value, color, node }) => (
                        <div style={{whiteSpace: 'pre', display: 'flex', alignItems: 'center'}}>
                            <span style={{display: 'block', height: '12px', width: '12px', marginRight: '7px', backgroundColor: color}}></span>
                            <span>
                                <strong>
                                    {id}, LOC: {value}{thisBackup.getCommits((node.data.data.name).replace(/[^\w]/gi, '-')) ? ', Commits: ' + thisBackup.getCommits((node.data.data.name).replace(/[^\w]/gi, '-')) : ''}
                                </strong>
                            </span>
                        </div>
                    )}
                />
            </div>
        )
    }
}

export default HotspotBubble;
