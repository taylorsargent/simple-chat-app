import React, {PropTypes} from 'react';

class Notification extends React.Component {
  render() {
    const { type, message } = this.props;

    return (
      <h1> {type} {message} </h1>
    );
  }
}

Notification.propTypes = {
  template: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Notification;
