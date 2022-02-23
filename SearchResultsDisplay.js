import React from 'react';
import './SearchResultsDisplay.css';

import SearchResult from './SearchResult.js'

class SearchResultsDisplay extends React.Component {
    render() {

        let searchResultsList = [];

        if( this.props.searchResults && this.props.searchResults.length > 0 ){

            this.props.searchResults.forEach( (searchResult) => {
                searchResultsList.push(
                    < SearchResult key={searchResult.id} searchResult={searchResult} />
                )
            });
        }

        return (
            <table className='searchResults' >
            <tbody>{searchResultsList}</tbody>
          </table>
        );
    }
}

export default SearchResultsDisplay;