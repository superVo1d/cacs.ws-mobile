import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Searchbar = (props) => {

	const [display, setDisplay] = useState(false);
	const [search, setSearch] = useState('');
	const [options, setOptions] = useState([]);
	
	const [focus, setFocus] = useState(false);
	const [cursor, setCursor] = useState(-1);

	const searchBarRef = useRef(null);
	const inputRef = useRef(null);

	const history = useHistory();

	useEffect(() => {
		document.addEventListener('mousedown', handleMouseDownOutside);

		return () => {
			document.removeEventListener('mousedown', handleMouseDownOutside);
		}
	});

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		}
	});	

	useLayoutEffect(() => {
		if (props.autoFocus) {
			handleOnFocus();
		}

		if (props.name) {
			setSearch(props.name);
		}
	}, [props.name, props.autoFocus])

	const handleKeyDown = (e) => {

		if (e.key !== 'Enter' && e.key !== 'Escape' && e.key !== 'Shift' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab' && !e.metaKey) {
			handleOnFocus();
		}
	}

	const handleMouseDownOutside = (e) => {

		const {current: wrap} = searchBarRef;

		if (wrap && !wrap.contains(e.target)) {
			setDisplay(false);
		}
	}

	const handleOnFocus = () => {
		setDisplay(true);
		inputRef.current.focus();
        //inputRef.current.selectionStart = inputRef.current.value.length;
        //inputRef.current.selectionEnd = inputRef.current.value.length;
	}

	const handleOnMouseDown = (e) => {

		if (e.target.className === 'delete-icon') {
			e.preventDefault();
		} else {
			setFocus(true);
		}
	}

	const handleOnBlur = () => {

		if (focus) {
			setFocus(false);
		} else {
			setDisplay(false);
			setCursor(-1);
		}
	}

	const handleOnClick = () => {
		setDisplay(true);	
		inputRef.current.focus();
	}

	const handleChange = (e) => {
		const value = e.target.value;
		setSearch(value);

		if (value.length === 0) {
			setOptions([]);
			setCursor(-1);
		}
	}

	useLayoutEffect(() => {
    	if (search && search.length > 0) {
	        getOptions();
    	}
	}, [search]);

	const getOptions = () => {
		const apiPrefix = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? '' : 'api/';

	    fetch(apiPrefix + 'search', {
        	method: 'POST',
        	headers: {
          		'Content-Type': 'application/json'
        	},
        	body: JSON.stringify({
        		"search": search,
        		"lim": props.lim || 7
        	})
      	})
	    .then(res => res.json())
	    .then((res) => {
			setOptions(res);
		}, (error) => {
			console.log(error);
		});
	}

	const handleSelect = (option) => {
		setSearch(option.name);
		setDisplay(false);
		setOptions([]);

		history.push(`${process.env.PUBLIC_URL}/${ option.status + option.cacs_id }`);
	}

	const clearAll = () => {
		setCursor(-1);
		setSearch('');
		setOptions([]);
		
		inputRef.current.focus();
	}

    const keyboardNavigation = (e) => {

    	switch(e.key) {
			case 'ArrowDown':
		    	setCursor(c => {
		    		if (c > options.length) {
	    				return 0;
	    			}

		    		if (c < options.length - 1) {
		    			return c + 1;
		    		} else {
		    			return c;
		    		}
		    	});
		  
		    	break;

			case 'ArrowUp':
				e.preventDefault();

		    	setCursor(c => {
		    		if (c > options.length) {
	    				return options.length - 1;
	    			}

		    		if (c > 0) {
	    				return c - 1;
	    			} else {
	    				return 0;
	    			}
		    	});
		    
		    	break;

	    	case 'Enter': 
		      	if (cursor > -1) {
				  handleSelect(options[cursor]);
	    		  e.target.blur();
		      	}

	        	break;

            case 'Escape':
	    		setDisplay(false);
	    		setCursor(-1);
	    		e.target.blur();   

	            break; 

		    default:
		    	break;
		}
    }

	return (
        <div className={ display ? "searchbar active" : "searchbar" } 
               onClick={ () => handleOnClick() }
                onBlur={ () => handleOnBlur() }
               onFocus={ () => handleOnFocus() }
                   ref={ searchBarRef }
           onMouseDown={ (e) => handleOnMouseDown(e) }>
          <div className={ display ? "search active" : "search" }>
          	<span className="search-icon"></span>
          	<input type="text"
           autoComplete="off"
          		  value={ search }
          	   onChange={ handleChange }
          	placeholder="Введите имя"
          			ref={ inputRef }
          	  onKeyDown={(e) => keyboardNavigation(e)}
          	   tabIndex={0}/>
          		{ search.length ? <button className="delete-button" onClick={ () => clearAll() }><span className="delete-icon"></span></button> : null }
          </div>
          { (display && (options.length > 0)) ? 
          		(<div className="options-container">
					{ options
						.map((option, i) => { 
							return (
								<div className={ i === cursor ? "option selected" : "option" } 
								     onMouseUp={ () => handleSelect(option) }
									       key={i}>
									{ option.name.slice(0, search.length) }<b>{ option.name.slice(search.length) }</b>
								</div>
							)
						}
					)}
				</div>)
		  : null }
        </div>
	);
}

export default Searchbar;
