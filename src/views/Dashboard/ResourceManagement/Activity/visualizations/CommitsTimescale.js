import React, { Component } from 'react';
var AppDispatcher = require('../../../../../AppDispatcher');

import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';
var moment = require('moment');
var dateFormat = require('dateformat');
import $ from "jquery";

import {ResponsiveCalendar} from '@nivo/calendar';
import {LegendSvgItem} from '@nivo/legends';

import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../../../AbstractDashboardComponent';

class CommitsTimescale extends DashboardAbstract {

    constructor(props) {
        super(props);

        var now = new Date();

        this.state = {
            commitsFrom: '2017-01-01',
            commitsTo: '2019-01-01',
            displayFrom: '2017-01-01',
            displayTo: '2019-01-01',
            calendarPaginationYear: '2018',
            commitsTimescale: []
        };
    }

    componentWillMount() {
      super.componentWillMount();
    }

    componentDidMount() {
      super.componentDidMount();
      if (databaseCredentialsProvided) {
        this.readCommitsTimescale();
      }
    }

    componentWillUnmount() {
      super.componentWillUnmount();
    }

    readCommitsTimescale() {
        var aggregatedData = [];
        var thisBackup = this; //we need this because this is undefined in then() but we want to access the current state

        var minDate = new Date();
        var maxDate = new Date('1970-01-01');

        neo4jSession.run(
            'MATCH (a:Author)-[:COMMITTED]->(c:Commit)-[:CONTAINS_CHANGE]->()-[:MODIFIES]->(f:File), ' +
            '  (c)-[:OF_DAY]->(d)-[:OF_MONTH]->(m)-[:OF_YEAR]->(y) ' +
            'WHERE NOT c:Merge ' +
            'RETURN y.year as year, m.month as month, d.day as day, count(distinct c) as commits, count(f) as files ' +
            'ORDER BY year, month, day  '
        ).then(function (result) {
        result.records.forEach(function (record) {
            var dayString = record.get(0) + "-" + record.get(1) + "-" + record.get(2);

            var current = new Date(dayString);
            if (current.getTime() < minDate.getTime()) {
                minDate = current;
            }
            if (current.getTime() > maxDate.getTime()) {
                maxDate = current;
            }

            var recordConverted = {
                "day": dayString,
                "value": record.get(3).low
            };

            aggregatedData.push(recordConverted);
        });
        }).then( function(context) {

            var strFrom = minDate.getFullYear() + "-" + ("0" + (minDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (minDate.getDate().toString())).slice(-2);
            var strTo = maxDate.getFullYear() + "-" + ("0" + (maxDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (maxDate.getDate().toString())).slice(-2);

            thisBackup.setState({
                commitsTimescale: aggregatedData,
                commitsFrom: strFrom,
                commitsTo: strTo,
                displayFrom: strFrom,
                displayTo: strTo
            });
        }).then( function (context) {
            // clean daterangepicker in header
            $('.daterangepicker-placeholder').html('');
            // put daterangepicker into header
            $('.react-bootstrap-daterangepicker-container').detach().appendTo('.daterangepicker-placeholder');
        }).catch(function (error) {
            console.log(error);
        });
    }

    setYear(year) {
        this.setState({calendarPaginationYear: year});
    }

    render() {
        var redirect = super.render();
        if (redirect.length > 0) {
          return(redirect);
        }

        if (this.state.commitsTimescale.length === 0) {
            return '';
        }

        var fromDateAr = this.state.commitsFrom.split("-");
        var toDateAr = this.state.commitsTo.split("-");

        var colors = [
            "#c6e48b",
            "#7bc96f",
            "#239a3b",
            '#192127'
        ];

        var legendItems = [];
        var xPosition = 0;
        for (var i = 0; i < colors.length; i++) {
            xPosition += 20;
            var legendSvgItem = <LegendSvgItem key={i} x={xPosition} y={0} width={20} height={35} label={''} fill={colors[i]} textColor={'#151b1e'} />;
            legendItems.push(legendSvgItem);
        }

        var dFromAr = this.state.displayFrom.split('-');
        var dToAr = this.state.displayTo.split('-');

        var currentYear = this.state.calendarPaginationYear;
        if (currentYear > dToAr[0]) {
            currentYear = dToAr[0];
        }

        if (currentYear < dFromAr[0]) {
            currentYear = dFromAr[0];
        }

        var calendarFrom = currentYear + "-1-1";
        var calendarTo = currentYear + "-12-31";
        if (currentYear == dFromAr[0]) {
            calendarFrom = this.state.displayFrom;
        }
        if (currentYear == dToAr[0]) {
            calendarTo = this.state.displayTo;
        }

        var years = [];
        for (var j = dFromAr[0]; j <= dToAr[0]; j++) {
            years.push(j);
        }

        var dataToShow = [];
        var fullCommitsArray = [];
        var dateFrom = new Date(calendarFrom);
        var dateTo = new Date(calendarTo);

        this.state.commitsTimescale.forEach(function (data) {
            var date = new Date(data.day);
            if (date >= dateFrom && date <= dateTo) {
                dataToShow.push(data);
            }
            fullCommitsArray.push(data.day);
        });

        var thisBackup = this;

        return (
            <div className="calendar-wrapper">
                <DateRangePicker
                    isInvalidDate={function(date) {
                        if (fullCommitsArray.indexOf(date.format("YYYY-MM-DD")) === -1) {
                            return true;
                        }
                    }}
                    startDate={this.state.displayFrom}
                    endDate={this.state.displayTo}
                    alwaysShowCalendars
                    minDate={ /*"04/30/2018"*/ this.state.commitsFrom }
                    maxDate={ /*"05/06/2018"*/ this.state.commitsTo }
                    opens="left"
                    ranges={{
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    }}
                    locale={{
                        "format": "YYYY-MM-DD",
                        "separator": " - ",
                        "applyLabel": "Apply",
                        "cancelLabel": "Cancel",
                        "fromLabel": "From",
                        "toLabel": "To",
                        "customRangeLabel": "Custom",
                        "weekLabel": "W",
                        "daysOfWeek": [
                            "Su",
                            "Mo",
                            "Tu",
                            "We",
                            "Th",
                            "Fr",
                            "Sa"
                        ],
                        "monthNames": [
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December"
                        ],
                        "firstDay": 1
                    }}
                    onApply={function(event, picker) {
                        var startDate = picker.startDate["_d"];
                        var endDate   = picker.endDate["_d"];

                        var startDateString = startDate.getFullYear() + "-" + ("0" + (startDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (startDate.getDate().toString())).slice(-2);
                        var endDateString = endDate.getFullYear() + "-" + ("0" + (endDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (endDate.getDate().toString())).slice(-2);
                        AppDispatcher.handleAction({
                            actionType: 'SET_STATE',
                            data: {
                                displayFrom: startDateString,
                                displayTo: endDateString
                            }
                        });

                        var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                        AppDispatcher.handleAction({
                            actionType: 'DATERANGEPICKER_MODIFIED',
                            data: {
                                displayFrom: startDate.toLocaleDateString('sv-SE', options), //sweden uses iso-format =)
                                displayTo: endDate.toLocaleDateString('sv-SE', options)
                            }
                        });
                    }}
                >
                    <div id="daterange" className="selectbox pull-right float-right">
                        <i className="fa fa-calendar"></i>
                        <span>{dateFormat(this.state.displayFrom, "dS mmmm yyyy")} - {dateFormat(this.state.displayTo, "dS mmmm yyyy")}</span> <b className="caret"></b>
                    </div>
                </DateRangePicker>
                <div style={{height: "360px", paddingTop: "60px"}}>
                    <ResponsiveCalendar
                        from={calendarFrom}
                        to={calendarTo}
                        data={dataToShow}
                        emptyColor="#eeeeee"
                        colors={colors}
                        margin={{
                          "top": 10,
                          "right": 10,
                          "bottom": 10,
                          "left": 30
                        }}
                        yearSpacing={30}
                        monthBorderColor="#ffffff"
                        monthLegendOffset={10}
                        dayBorderWidth={1}
                        dayBorderColor="#ffffff"
                        direction="horizontal"
                    />
                </div>
                <div className="calendar-legend">
                    <div className="less float-left">less</div>
                    <svg id={"dummyLegend"} style={{float: "left", overflow:"visible", width: ((colors.length + 1) * 20) + 16}}>{legendItems}</svg>
                    <div className="more float-left">more</div>
                </div>
                <div className={'year-switcher'} style={{position: 'relative', bottom: '200px'}}>
                    {years.map(year => (
                        <span
                            key={year}
                            style={{
                                display: "inline-block",
                                padding: "3px 9px",
                                cursor: "pointer",
                                fontWeight: year == currentYear ? "800" : "400"
                            }}
                            onClick={() => this.setYear(year)}
                        >
                        {year}
                      </span>
                    ))}
                </div>
            </div>
        )
    }
}

export default CommitsTimescale;
