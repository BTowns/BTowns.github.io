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
        }

        this.handleSearch = this.handleSearch.bind(this);
        this.handleAuthUpdate = this.handleAuthUpdate.bind(this);
        this.searchRequest = this.searchRequest.bind(this);

        this.octokit = new Octokit();
    };

    handleSearch( searchText ){
        
        clearTimeout( this.state.searchDebounceTimer );

        this.setState({
            searchText: searchText,
            searchDebounceTimer: setTimeout( this.searchRequest, 1000 )
        });

    }

    async searchRequest( ){
        if( this.state.searchText === '' ) return; 
        await this.octokit.request('GET /search/users', {
            q: this.state.searchText +'sort:followers-desc'
        }).then( result =>{ 
            
            this.setState({
                searchResults : result.data.items,
            });
        });
    }

    handleAuthUpdate( authText ){
        this.setState({
            authText: authText
        });

        this.octokit.auth = authText;
    }

    render() {
        return (
            <div>
                <span>Generate GH Auth Token To Increase API Rate Limit</span> <a href='https://github.com/settings/tokens/new?scopes=read:user' target="_blank" rel="noreferrer noopener"> Here </a>
                <AuthBar authText={this.state.authText} onAuthUpdate={this.handleAuthUpdate} />
                <br/><br/>
                <SearchBar searchText={this.state.searchText} onSearch={this.handleSearch} />
                <SearchResultsDisplay searchResults={this.state.searchResults} />
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
            <form>
                <input
                type="text"
                className='textBar'
                placeholder="Enter GH OAuth Token"
                value={this.props.authText}
                onChange={this.handleAuthUpdate}
                />
            </form>
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

class SearchResultsDisplay extends React.Component {
    render() {

        let searchResultsList = [];

        if( this.props.searchResults && this.props.searchResults.length > 0 ){

            this.props.searchResults.forEach( (searchResult) => {
                searchResultsList.push(
                    < SearchResultListItem key={searchResult.id} searchResult={searchResult} />
                )
            });
        }

        return (
            <table>
            <tbody>{searchResultsList}</tbody>
          </table>
        );
    }
}

class SearchResultListItem extends React.Component {
  
    render() {

    let searchResult=this.props.searchResult;

    return (
        <tr>
            <td>
                <a href={searchResult.html_url} target="_blank" rel="noreferrer noopener">
                    <img className='avatar' src={searchResult.avatar_url} />
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
