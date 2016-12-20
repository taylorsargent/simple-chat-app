import React, {PropTypes} from 'react';

class Notification extends React.PureComponent {
    render() {
        const { template, type, message } = this.props;

        return (
            <li
                dangerouslySetInnerHTML={{
                    __html: template({
                        type,
                        message,
                    })
                }}
            />
        );
    }
}

Notification.propTypes = {
    template: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};

export default Notification;
