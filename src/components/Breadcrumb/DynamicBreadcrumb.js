import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';

class DynamicBreadcrumb extends Component {

    render() {
        const items = [];

        var key = '';
        for (var i = 0; i < this.props.items.length; i++) {
            var propname = this.props.items[i];
            var renderSeparator = (i < this.props.items.length - 1);

            key = key + (i !== 0 ? this.props.separator : '') + propname;
            var currentItem = items[i];
            items.push(
                <span id={key} key={key} onClick={this.props.onClickHandler}>
                    {propname}
                </span>
            );

            if (renderSeparator) {
                items.push(
                    <span key={'separator-' + key}>{this.props.separator}</span>
                );
            }
        }
        
        return (
            <div>{items}</div>
        );
    }

}

export default DynamicBreadcrumb;