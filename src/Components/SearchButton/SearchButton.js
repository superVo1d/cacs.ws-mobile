import './SearchButton.css';
import Searchbar from './../Searchbar';
import { useState, useEffect } from 'react';

const SearchButton = (props) => {

	const [searchbarIsOpen, setSearchbarIsOpen] = useState(false);

	useEffect(() => {
	  // add when mounted
	  document.addEventListener("mousedown", handleClickOutside);
	  // return function to be called when unmounted
	  return () => {
	    document.removeEventListener("mousedown", handleClickOutside);
	  };
	}, []);

	const handleClickOutside = (e) => {

		if (e.target.className === 'searchbar-mobile-wrapper') {
		    setSearchbarIsOpen(false);
	    }
	    // outside click 
	    //setSearchbarIsOpen(false);
	}

	const handleClick = () => {
		setSearchbarIsOpen(true);
	}

	return (
		<>
			{searchbarIsOpen && 
				<div className="searchbar-mobile-wrapper">
					<Searchbar autoFocus={ true } setSearchbarIsOpen={ setSearchbarIsOpen } name={props.name} />
				</div>
			}
			<button
			  className="search-btn"
			    onClick={ () => handleClick() }
			   tabIndex={-1}
			       type="button">
					<span className="search-icon"></span>
			</button>
		</>
	);
}

export default SearchButton;