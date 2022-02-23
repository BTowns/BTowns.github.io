import React from 'react';
import './PrevSearches.css';

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
            prevSearchList.push( <li onClick={this.handlePrevSearch} key={prevSearch} >{prevSearch}</li> )
        });

        return (
            <div>
                <span className='prevSearchesSpan'>Previous Searches</span>
                <ul>
                    {prevSearchList}
                </ul>
            </div>
        );
    }
}

export default PrevSearches;