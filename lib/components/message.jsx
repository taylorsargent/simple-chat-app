import React, {PropTypes} from 'react';
import moment from 'moment';

class Message extends React.PureComponent {
    render() {
        const { template, username, message, timestamp } = this.props;

        return (
            <li
                dangerouslySetInnerHTML={{
                    __html: template({
                        username,
                        message,
                        timestamp: moment(timestamp).format('HH:MM:SS'),
                    }),
                }}
            />
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
