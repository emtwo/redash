import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'antd/lib/checkbox';


export class TableVisibilityCheckbox extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    return (
      <Checkbox
        checked={this.props.visible}
        onChange={this.props.onChange}
        disabled={this.props.disabled}
      >
        {this.props.visible ? 'Visible' : 'Hidden'}
      </Checkbox>
    );
  }
}
