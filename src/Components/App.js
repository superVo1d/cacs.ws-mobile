import { useState, useLayoutEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import WelcomePage from './WelcomePage';
import PageNotFound from './PageNotFound';
import SchedulePage from './SchedulePage';
import NightmodeButton from './NightmodeButton';


import '../layout.css';

const lightTheme = {
	'--bg-color': '#fff',
	'--bg-color-glass': 'rgba(255, 255, 255, 0.8)',
  	'--primary-color': '#000',
  	'--secondary-acsent-color': '#ffebf0',
  	'--bg-light-color': '#efefef',
  	'--secondary-color': '#d3d3d3',
  	'--plug-color': '#ddd',
    '--plug-shine-color': '#efefef',
  	'--shadow-color': 'rgba(0, 0, 0, 0.4)',
  	'--spinner-color': 'rgba(0, 0, 0, 0.2)'
}

const darkTheme = {
	'--bg-color': '#000',
	'--bg-color-glass': 'rgba(0, 0, 0, 0.8)',
  	'--primary-color': '#fff',
  	'--secondary-acsent-color': '#0f0206',
  	'--bg-light-color': '#101010',
  	'--secondary-color': '#d3d3d3',
  	'--plug-color': '#0b0b0b',
    '--plug-shine-color': '#101010',
  	'--shadow-color': 'rgba(255, 255, 255, 1)',
  	'--spinner-color': 'rgba(255, 255, 255, 0.2)'
}

const App = (props) => {

	const [currentMode, setCurrentMode] = useState('light');
	const [isChecked, setIsChecked] = useState(false);

	useLayoutEffect(() => {
	  if (localStorage.getItem('mode') === 'dark') {
	    setCurrentMode('dark');
	    setIsChecked(true);
	  }
	}, [])

	useLayoutEffect(() => {
	  const theme = currentMode === 'light' ? lightTheme : darkTheme;

	  Object.keys(theme).forEach(key => {
	    const value = theme[key];
	    document.documentElement.style.setProperty(key, value);
	  });
	}, [currentMode])

	const toggleTheme = () => {
	  const newMode = currentMode === 'light' ? 'dark' : 'light';

	  setIsChecked(!isChecked);
	  setCurrentMode(newMode);

	  localStorage.setItem('mode', newMode);
	}

	return (
		<BrowserRouter basename={'/'}>
            <Switch>
				<Route exact path={`${process.env.PUBLIC_URL}/`}>
					<WelcomePage mode={ currentMode }/>
				</Route>
			  	<Route exact path={`${process.env.PUBLIC_URL}/error`}>
			  		<PageNotFound>
			      		<NightmodeButton 
			          		toggleTheme={ toggleTheme }
			          		  isChecked={ isChecked }
			        	/>
			  		</PageNotFound>
			  	</Route>
			  	<Route path={`${process.env.PUBLIC_URL}/:id`}>
			  		<SchedulePage toggleTheme={toggleTheme} isChecked={isChecked} />
			  	</Route>
		  	</Switch>
	  	</BrowserRouter>
	);
}

export default App;
