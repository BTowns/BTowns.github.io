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
        }

        this.handleSearch = this.handleSearch.bind(this);
        this.handleAuthUpdate = this.handleAuthUpdate.bind(this);

        this.octokit = new Octokit();
    };

    handleSearch( searchText ){
        this.setState({
            searchText: searchText
        });

        this.searchRequest( searchText );
    }

    async searchRequest( searchText ){
        await this.octokit.request('GET /search/users', {
            q: searchText +'sort:followers-desc'
        }).then( result =>{ 
            
            this.setState({
                searchResults : result.data.items,
            });

            console.log(result.data.items);
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
                <span>If GraphQL Searches Desired, Generate GH Auth Token </span> <a href='https://github.com/settings/tokens/new?scopes=read:user' target="_blank" rel="noreferrer noopener"> Here </a>
                <AuthBar authText={this.state.authText} onAuthUpdate={this.handleAuthUpdate} />
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
        <ul>
            {searchResultsList}
        </ul>
        );
    }
}

class SearchResultListItem extends React.Component {
  render() {

      let searchResult=this.props.searchResult;

      return (
          <li>
              <a href={searchResult.html_url} target="_blank" rel="noreferrer noopener">

                  <img src={searchResult.avatar_url} />
                  <span className="searchResultName" >{searchResult.name}</span>
                  <span className="searchResultLogin" >{searchResult.login}</span>
              </a>
          </li>
      );
  }
}

export default App;
