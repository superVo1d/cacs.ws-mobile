import Footer from './Footer';
import Navbar from './Navbar';
import Searchbar from './Searchbar';
import NightmodeButton from './NightmodeButton';
import { useHistory } from 'react-router-dom';

const PageNotFound = (props) => {

	const history = useHistory();

	const handleOnClick = () => {
    	history.push(`${process.env.PUBLIC_URL}/`);
  	}

	return (
		<>
		    <Navbar>
		      	<Searchbar autoFocus={ true } />
		    	<div className="btn-container">
					{ props.children }
		        </div>
	        </Navbar>
			<div className="wrapper error-page">
				<div className="main-container">
					<div className="wrapper">
						<h1 className="error">
							404
						</h1>
					</div>
					<div className="error-description wrapper">
						<p>Такой страницы не существует</p>
						<div className="modal-btn-container">
							<button 
								className="modal-btn" 
								  onClick={ () => handleOnClick() }
								 tabIndex={0}>
							    <div tabIndex={-1}>
									<span>На главную</span>
									<span className="modal-btn-icon"></span>
								</div>
							</button>
						</div>
					</div>
					<div className="footer-container"> 
						<Footer />
					</div>
				</div>
			</div>
		</>
	)
}

export default PageNotFound;