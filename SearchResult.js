import React from 'react';
import './SearchResult.css';

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

export default SearchResult;