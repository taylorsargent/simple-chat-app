import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

class Message extends React.PureComponent {
    componentDidMount() {
        ReactDOM.findDOMNode(this).scrollIntoView();
    }

    componentDidUpdate() {
        ReactDOM.findDOMNode(this).scrollIntoView();
    }

    render() {
        const { template, username, message, timestamp } = this.props;

        return (
            <li
                dangerouslySetInnerHTML={{
                    __html: template({
                        username,
                        message,
                        timestamp: moment(timestamp).format('h:mm:ss a'),
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
