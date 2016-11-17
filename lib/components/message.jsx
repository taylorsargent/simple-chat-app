import React, {PropTypes} from 'react';

class Message extends React.Component {
  render() {
    const { template, user, text, timestamp } = this.props;

    return (
      <div dangerouslySetInnerHTML={{
        __html: template({
          user,
          text,
          timestamp,
        }),
      }} />
    );
  }
}

Message.propTypes = {
  template: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  timestamp: PropTypes.number,
};

export default Message;
