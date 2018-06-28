import React, { Component } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import CommitsTimescaleModel from '../../../../../api/models/CommitsTimescale';
import $ from "jquery";

import {ResponsiveCalendar} from '@nivo/calendar';
import {LegendSvgItem} from '@nivo/legends';

import DashboardAbstract, { neo4jSession, databaseCredentialsProvided } from '../../../AbstractDashboardComponent';

var AppDispatcher = require('../../../../../AppDispatcher');
var dateFormat = require('dateformat');

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
          var commitsTimescaleModel = new CommitsTimescaleModel();
          commitsTimescaleModel.readCommitsTimescale(this);
      }
    }

    componentWillUnmount() {
      $('.daterangepicker-placeholder').html('');
      super.componentWillUnmount();
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

        var colors = [
            "#c6e48b",
            "#7bc96f",
            "#239a3b",
            '#192127'
        ];

        //add Legend-Items (the green rectangles)
        var legendItems = [];
        var xPosition = 0;
        for (var i = 0; i < colors.length; i++) {
            xPosition += 20;
            var legendSvgItem = <LegendSvgItem key={i} x={xPosition} y={0} width={20} height={35} label={''} fill={colors[i]} textColor={'#151b1e'} />;
            legendItems.push(legendSvgItem);
        }

        //split date to make it easy processable
        var dFromAr = this.state.displayFrom.split('-');
        var dToAr = this.state.displayTo.split('-');

        //get current pagination year and limit it
        var currentYear = this.state.calendarPaginationYear;
        if (currentYear > dToAr[0]) {
            currentYear = dToAr[0];
        }

        if (currentYear < dFromAr[0]) {
            currentYear = dFromAr[0];
        }

        //prepare limit for calendar
        var calendarFrom = currentYear + "-1-1";
        var calendarTo = currentYear + "-12-31";
        if (currentYear == dFromAr[0]) {
            calendarFrom = this.state.displayFrom;
        }
        if (currentYear == dToAr[0]) {
            calendarTo = this.state.displayTo;
        }

        //fill dates to allow in daterangepicker (subset of all commits that is defined by range)
        var datesToShow = [];
        var fullCommitsArray = [];

        var dateFrom = new Date(calendarFrom);
        var dateTo = new Date(calendarTo);

        //years contains the actual years that are pickable as pagination ('from' to 'to' minus gaps)
        var years = [];

        this.state.commitsTimescale.forEach(function (data) {
            var date = new Date(data.day);
            if (date >= dateFrom && date <= dateTo) {
                datesToShow.push(data);
            }
            fullCommitsArray.push(data.day);

            var commitYear = data.day.split('-')[0];
            if (years.indexOf(commitYear) === -1) {
                years.push(commitYear);
            }
        });

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
                    minDate={ this.state.commitsFrom }
                    maxDate={ this.state.commitsTo }
                    showDropdowns={true}
                    opens="left"
                    /*
                    ranges={{
                        'Today': [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
                        'Yesterday': [moment().subtract(1, 'days').format("YYYY-MM-DD"), moment().subtract(1, 'days').format("YYYY-MM-DD")],
                        'Last 7 Days': [moment().subtract(6, 'days').format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
                        'Last 30 Days': [moment().subtract(29, 'days').format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
                        'This Month': [moment().startOf('month').format("YYYY-MM-DD"), moment().endOf('month').format("YYYY-MM-DD")],
                        'Last Month': [moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD"), moment().subtract(1, 'month').endOf('month').format("YYYY-MM-DD")]
                    }} */
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
                        data={datesToShow}
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
