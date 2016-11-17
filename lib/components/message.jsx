import React, {PropTypes} from 'react';

class Message extends React.Component {
  render() {
    const { template, username, message, timestamp } = this.props;

    return (
      <li dangerouslySetInnerHTML={{
        __html: template({
          username,
          message,
          timestamp,
        }),
      }} />
    );
  }
}

Message.propTypes = {
  template: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  timestamp: PropTypes.number,
};

export default Message;
