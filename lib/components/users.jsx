import React from 'react';

import User from './user.jsx';

export default class Users extends React.PureComponent {
    render() {
        const { template, users } = this.props;

        return (
            <ul>
                {
                    users.map((username, index) =>
                        <User
                            key={index}
                            template={template}
                            username={username}
                        />
                    )
                }
            </ul>
        );
    }
}
