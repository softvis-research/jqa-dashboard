import React from 'react';
import DashboardAbstract from '../../../AbstractDashboardComponent';

import {ResponsiveBubbleHtml} from '@nivo/circle-packing';

var AppDispatcher = require('../../../../../AppDispatcher');

class StructureBubble extends DashboardAbstract {

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
            return(redirect);
        }

        var hotSpotData = this.props.data;

        if (!hotSpotData.name) {
            return '';
        }

        return (
            <div className={'structure-component'} style={{height: "600px"}}>
                <ResponsiveBubbleHtml
                    onClick={ function(event) {
                        AppDispatcher.handleAction({
                            actionType: 'SELECT_HOTSPOT_PACKAGE',
                            data: event
                        });
                    }
                    }
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

                        var data = e.data;

                        if (data && typeof(data.level) !== "undefined") {
                            var level = data.level;
                            var r = 228 - (11 * level * 2);
                            var g = 242 - (6 * level * 2);
                            var b = 243 - (6 * level * 2);
                            return 'rgb(' + r + ', ' + g + ', ' + b + ')';
                        }

                    } }
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
                    tooltip={({ id, value, color }) => (
                        <div style={{whiteSpace: 'pre', display: 'flex', alignItems: 'center'}}>
                            <span style={{display: 'block', height: '12px', width: '12px', marginRight: '7px', backgroundColor: color}}></span>
                            <span>
                                <strong>
                                    {id}, LOC: {value}
                                </strong>
                            </span>
                        </div>
                    )}
                />
            </div>
        )
    }
}

export default StructureBubble;
