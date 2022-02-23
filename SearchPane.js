import React from 'react';
import './SearchPane.css';

import AuthBar from './AuthBar.js';
import SearchBar from './SearchBar.js';
import SearchPaginator from './SearchPaginator.js';
import PrevSearches from './PrevSearches.js';

class SearchPane extends React.Component {

    render() {
        return (
            <div className='searchPane'>
                <AuthBar authText={this.props.authText} onAuthUpdate={this.props.onAuthUpdate} />
                <br/><br/>
                <SearchBar searchText={this.props.searchText} onSearch={this.props.onSearch} />
                <br />
                <SearchPaginator searchPage={this.props.searchPage} onPaginate={this.props.onPaginate} />
                <br />
                <PrevSearches previousSearches={this.props.previousSearches} onPrevSearch={this.props.onPrevSearch} />
            </div>
        );
    }

}

export default SearchPane;