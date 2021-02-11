import './NavbarMobile.css';

const NavbarMobile = (props) => {

	return (
		<div className="navbar-mobile-wrapper">
	        <div className="navbar">
	          { props.children }
	        </div>

	    </div>
	);
}

export default NavbarMobile;