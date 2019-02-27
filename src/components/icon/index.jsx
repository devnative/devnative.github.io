import React from 'react';
import './index.scss';

const renderIcon = (type, size, style) => {
  switch (type) {
    case 'arrow':
      return (
        (<i className="dn-arrow next" style={{ width: size, height: size, marginLeft: '4px', ...style }} />)
      );
    default:
      return null;
  }
};

export default class Icon extends React.PureComponent {

  render() {
    const { type, size, style } = this.props;
    return renderIcon(type, size, style);
  }
}
