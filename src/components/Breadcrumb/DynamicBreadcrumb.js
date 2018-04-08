import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

class DynamicBreadcrumb extends Component {

    render() {
        const items = [];

        var key = '';
        for (var i = 0; i < this.props.items.length; i++) {
            var propname = this.props.items[i];
            //var renderSeparator = (i < this.props.items.length - 1);

            key = key + (i !== 0 ? this.props.separator : '') + propname;
            var active = (i === this.props.items.length - 1);
            items.push(
                <BreadcrumbItem
                    id={key}
                    key={key}
                    className={active ? "active breadcrumb-item" : "breadcrumb-item"}
                    tag={active ? "span" : "a"}
                    onClick={this.props.onClickHandler}>
                        {propname}
                </BreadcrumbItem>
            );
        }

        return (
            <Breadcrumb className="dynamic-breadcrumb">
                {items}
            </Breadcrumb>
        );
    }

}

export default DynamicBreadcrumb;