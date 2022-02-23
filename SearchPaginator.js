import React from 'react';
import './SearchPaginator.css';

class SearchPaginator extends React.Component {
    constructor(props) {
        super(props);
        this.handlePagination = this.handlePagination.bind(this);
    }
    
    handlePagination(e) {
        this.props.onPaginate(e.target);
    }
  
    render() {
        return (
            <div>
                <i className='arrow left' onClick={this.handlePagination}></i>
                <input
                    type="text"
                    className='paginatorBar'
                    value={this.props.searchPage}
                    onChange={this.handlePagination}
                />
                <i className='arrow right'onClick={this.handlePagination}></i>
            </div>
        );
    }
}

export default SearchPaginator;