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
            authText: '',
            searchResults : [],
            searchDebounceTimer: null,
            previousSearches : [],
        }

        this.handleSearch = this.handleSearch.bind(this);
        this.handleAuthUpdate = this.handleAuthUpdate.bind(this);
        this.searchRequest = this.searchRequest.bind(this);
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
            q: this.state.searchText +'sort:followers-desc'
        }).then( result =>{ 
            
            if( !this.state.previousSearches.includes( this.state.searchText ) ){
                this.setState({
                    searchResults : result.data.items,
                    previousSearches : [...this.state.previousSearches, this.state.searchText]
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
                <form>
                    <input
                    type="text"
                    className='textBar'
                    placeholder="Enter GH OAuth Token"
                    value={this.props.authText}
                    onChange={this.handleAuthUpdate}
                    />
                </form>
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
            <form>
                <input
                type="text"
                className='textBar'
                placeholder="Search For User"
                value={this.props.searchText}
                onChange={this.handleSearch}
                />
            </form>
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
