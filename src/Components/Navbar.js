import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Navbar(props) {

  const history = useHistory();

  const [ isScrolled, setIsScrolled ] = useState(() => {
    if (window.scrollY === 0){
      return false;
    } else {
      return true;
    }
  });

  useEffect(() => {
    window.addEventListener('scroll', handleScrollEvent);
    
    return () => 
      window.removeEventListener('scroll', handleScrollEvent);
  }, [])

  const handleScrollEvent = (e) => {

    if (window.scrollY > 74) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }

  const handleOnClick = () => {
    history.push(`/`);
  }

  return (
    <div className="navbar-wrapper" style={{ borderBottom: isScrolled ? "1px solid var(--bg-light-color)" : "none" }}>
      <div className="wrapper">
        <div className="navbar">
          <div className="logo" onClick={ () => handleOnClick() } tabIndex={0}><div tabIndex={-1}><span>CACS.WS</span></div></div>
          { props.children }
        </div>
      </div>
    </div>
  );
}

export default Navbar;
