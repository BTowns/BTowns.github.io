import React from 'react';
import { Octokit } from "@octokit/core";
import './App.css';

function App() {
  return (
    <SearchBody />
  );
}

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

        this.setState({
            searchText: searchText,
            searchDebounceTimer: setTimeout( this.searchRequest, timeout )
        });

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

        console.log(paginatorTarget);

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
            <div>
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
                <span>Generate GH Auth Token To </span> <br /> <span> Increase API Rate Limit</span> <a href='https://github.com/settings/tokens/new?scopes=read:user' target="_blank" rel="noreferrer noopener"> Here </a>
                <br />
                <input
                    type="text"
                    className='textBar'
                    placeholder="Enter GH OAuth Token"
                    value={this.props.authText}
                    onChange={this.handleAuthUpdate}
                />
            </div>
        );
    }
}

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
                <span>Search GH Users:</span>
                <br />
                <input
                    type="text"
                    className='textBar'
                    placeholder="Search For User"
                    value={this.props.searchText}
                    onChange={this.handleSearch}
                />
            </div>
        );
    }
}

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
                    className='textBar paginator'
                    value={this.props.searchPage}
                    onChange={this.handlePagination}
                />
                <i className='arrow right'onClick={this.handlePagination}></i>
            </div>
        );
    }
}

class PrevSearches extends React.Component {
    constructor(props) {
        super(props);
        this.handlePrevSearch = this.handlePrevSearch.bind(this);
    }
    
    handlePrevSearch(e) {
        this.props.onPrevSearch(e.target.innerText);
    }
  
    render() {

        let prevSearchList = [];

        this.props.previousSearches.forEach( (prevSearch) =>{
            prevSearchList.push( <li onClick={this.handlePrevSearch}>{prevSearch}</li> )
        });

        return (
            <div>
                <span>Previous Searches</span>
                <ul>
                    {prevSearchList}
                </ul>
            </div>
        );
    }
}

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

class SearchResult extends React.Component {
  
    render() {

    let searchResult=this.props.searchResult;

    return (
        <tr>
            <td>
                <a href={searchResult.html_url} target="_blank" rel="noreferrer noopener">
                    <img className='avatar' src={searchResult.avatar_url} alt={searchResult.login} />
                </a>
            </td>
            <td>
                <a href={searchResult.html_url} target="_blank" rel="noreferrer noopener">
                    <span className="searchResultLogin" >{searchResult.login}</span>
                </a>
            </td>
        </tr>


          
      );
  }
}

export default App;
