import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Nav,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Badge
} from 'reactstrap';
import HeaderDropdown from './HeaderDropdown';
import {databaseCredentialsProvided} from "../../views/Dashboard/AbstractDashboardComponent";

class Header extends Component {

  constructor(props) {
    super(props);
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  render() {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>

        <Nav className="ml-auto" navbar>
            <NavItem className="d-md-down-none daterangepicker-placeholder"></NavItem>
            <NavItem className="d-md-down-none">
                <NavLink href="/#/settings" className="float-right">
                    <i className="icon-settings"></i>
                    <div className="label float-right">Settings</div>
                </NavLink>
                <NavLink href="/#/custom-query" className="float-right">
                    <i className="fa fa-database"></i>
                    <div className="label float-right">Custom Query</div>
                </NavLink>
            </NavItem>
        </Nav>
      </header>
    );
  }
}

export default Header;
