import React, { Component } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import PropTypes from "prop-types";

import { AppSidebarToggler, AppNavbarBrand } from "@coreui/react";
import logo from "../../assets/img/brand/logo.svg";

const propTypes = {
    children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
    render() {
        // eslint-disable-next-line
        const { children, ...attributes } = this.props;

        return (
            <React.Fragment>
                <AppSidebarToggler className="d-lg-none" display="md" mobile />
                <AppNavbarBrand
                    full={{ src: logo, alt: "jQA-Dashboard Logo" }}
                />
                <AppSidebarToggler className="d-md-down-none" display="lg" />
                <Nav className="ml-auto" navbar>
                    <NavItem className="d-md-down-none daterangepicker-placeholder"></NavItem>
                    <NavItem className="d-md-down-none">
                        <NavLink href="#/settings" className="float-right">
                            <i className="icon-settings"></i>
                            <div className="label float-right">Settings</div>
                        </NavLink>
                        <NavLink href="#/custom-query" className="float-right">
                            <i className="fa fa-database"></i>
                            <div className="label float-right">
                                Custom Query
                            </div>
                        </NavLink>
                    </NavItem>
                </Nav>
            </React.Fragment>
        );
    }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
