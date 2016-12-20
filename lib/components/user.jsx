import React, {PropTypes} from 'react';

class User extends React.PureComponent {
    render() {
        const { template, username } = this.props;

        return (
            <li dangerouslySetInnerHTML={{ __html: template({ username }) }} />
        );
    }
}

User.propTypes = {
    template: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
};

export default User;
