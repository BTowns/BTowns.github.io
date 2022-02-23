import React from 'react';
import './SearchBody.css';

import SearchPane from './SearchPane.js';
import SearchResultsDisplay from './SearchResultsDisplay.js';
import { Octokit } from "@octokit/core";

class SearchBody extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchOrder: '+sort:followers-desc',
            searchPage: 1,
            authText: '',
            searchResults : [],
            searchDebounceTimer: null,
            previousSearches : [],
        }

        this.handleSearch = this.handleSearch.bind(this);
        this.handleAuthUpdate = this.handleAuthUpdate.bind(this);
        this.searchRequest = this.searchRequest.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.handlePrevSearch = this.handlePrevSearch.bind(this);

        this.octokit = new Octokit();
    };

    handleSearch( searchText, timeout = 1000 ){
        
        clearTimeout( this.state.searchDebounceTimer );

        //If it's a new search term and not just pagination, lets set the page back to 1
        if( this.state.searchText != searchText ){
            this.setState({
                searchText: searchText,
                searchPage: 1,
                searchDebounceTimer: setTimeout( this.searchRequest, timeout )
            });
        }
        else{
            this.setState({
                searchDebounceTimer: setTimeout( this.searchRequest, timeout )
            });
        }

    }

    async searchRequest( ){

        if( this.state.searchText === '' ) return; 

        await this.octokit.request('GET /search/users', {

            q: this.state.searchText + this.state.searchOrder,
            page: this.state.searchPage

        }).then( result =>{ 
            
            if( !this.state.previousSearches.includes( this.state.searchText ) ){
                this.setState({
                    searchResults : result.data.items,
                    previousSearches : [...this.state.previousSearches, this.state.searchText],
                });
            }
            else{
                this.setState({
                    searchResults : result.data.items,
                });
            }

        });
    }

    handleAuthUpdate( authText ){
        this.setState({
            authText: authText
        });

        this.octokit.auth = authText;
    }

    handlePagination( paginatorTarget ){

        let pageVal = this.state.searchPage;

        if( paginatorTarget.className.includes('right') ){
            pageVal++;
        }
        else if( paginatorTarget.className.includes('left') ){
            pageVal--;
            if( pageVal <= 0 ) pageVal = 1;
        }
        else{
            pageVal = paginatorTarget.value;
        }

        this.setState({
            searchPage: pageVal
        });

        if( pageVal > 0 && this.state.searchText != '' ) this.handleSearch( this.state.searchText, 100 );
    }

    handlePrevSearch( prevText ){
        this.handleSearch( prevText, 100 );
    }

    render() {
        return (
            <div >
                <SearchPane 
                    authText={this.state.authText} 
                    onAuthUpdate={this.handleAuthUpdate} 
                    searchText={this.state.searchText} 
                    onSearch={this.handleSearch} 
                    searchPage={this.state.searchPage}
                    onPaginate={this.handlePagination}
                    previousSearches={this.state.previousSearches}
                    onPrevSearch={this.handlePrevSearch}
                />
                <SearchResultsDisplay searchResults={this.state.searchResults} />
            </div>
        );
    }
}

export default SearchBody;