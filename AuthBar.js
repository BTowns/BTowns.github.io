import React from 'react';
import './AuthBar.css';

class AuthBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleAuthUpdate = this.handleAuthUpdate.bind(this);
    }
    
    handleAuthUpdate(e) {
        this.props.onAuthUpdate(e.target.value);
    }
  
    render() {
        return (
            <div>
                <span className='authBarSpan'>Generate GH Auth Token To <br /> Increase API Rate Limit </span> 
                <a 
                    href='https://github.com/settings/tokens/new?scopes=read:user' 
                    target="_blank" 
                    rel="noreferrer noopener"
                > 
                    Here
                </a>
                <br />
                <input
                    type="text"
                    className='authBar'
                    placeholder="Enter GH OAuth Token"
                    value={this.props.authText}
                    onChange={this.handleAuthUpdate}
                />
            </div>
        );
    }
}
export default AuthBar;