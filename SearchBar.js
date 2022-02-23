import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }
    
    handleSearch(e) {
        this.props.onSearch(e.target.value);
    }
  
    render() {
        return (
            <div>
                <span className='searchBarSpan'>Search GH Users:</span>
                <br />
                <input
                    type="text"
                    className='searchBar'
                    placeholder="Search For User"
                    value={this.props.searchText}
                    onChange={this.handleSearch}
                />
            </div>
        );
    }
}

export default SearchBar;