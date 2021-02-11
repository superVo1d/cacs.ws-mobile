import Searchbar from './Searchbar';
import Footer from './Footer';

const WelcomePage = (props) => {

	// <div className="main-container">
	// 	<h1 className="greeting">
	// 		Здесь можно узнать<br/>свое расписание.
	// 	</h1>
	// </div>

	const handleClick = () => {
		document.location.reload();
	}

	let lightModeGifNames = [
  		'bladerunner3',
  		'matrix2',
  		'melancholia',
  		'melancholia2',
  		'newfrenchwave',
  		'spaceodyssey',
  		'spaceodyssey4',
  		'scarface',
  		'inception'
	]

	let darkModeGifNames = [
  		'bladerunner',
  		'bladerunner2',
  		'lynch',
  		'eraserhead',
  		'scarface',
  		'matrix',
  		'matrix2',
  		'matrix3',
  		'newfrenchwave',
  		'spaceodyssey',
  		'spaceodyssey2',
  		'spaceodyssey3'
	]

	const setGif = () => {

		let r = Math.random();

		let pathToGif = '/gif/';

		if (props.mode === 'light') {
			let index = Math.floor(r * (lightModeGifNames.length));			
			pathToGif = pathToGif + lightModeGifNames[index] + '.gif';
		} else {
			let index = Math.floor(r * (darkModeGifNames.length));			
			pathToGif = pathToGif + darkModeGifNames[index] + '.gif';
		}

		return pathToGif
	}

	return (
		<div className="welcome-page">
			<div className="main-container">
				<div className="wrapper">
					<div className="gif" 
					         style={{ backgroundImage: 'url("' + setGif() + '")' }} 
					       onClick={() => handleClick()}></div>
		       	</div>
				<div className="wrapper searchbar-container"> 
					<Searchbar autoFocus={true} lim={5} />
				</div>				       
				<div className="footer-container"> 
					<Footer />
				</div>
			</div>
		</div>
	)
}

export default WelcomePage;