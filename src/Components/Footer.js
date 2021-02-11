
function Footer() {
  return (
    <footer className="wrapper">
      <div className="mail">
        <span>Почта: </span>
        <a href="mailto:cacs.ws@internet.ru" tabIndex={0}>
          <span tabIndex={-1}>cacs.ws@internet.ru</span>
        </a>
      </div>
      <div className="copyright">
      	<div>© 2021 г.</div>
        <div>
  		  	<a className="copyright-company"
                target="_blank" 
  		  	         rel="noopener noreferrer" 
  		  	        href="http://vk.com/newcyberrussia" 
  		  	    tabIndex={0}>
            <span tabIndex={-1}>«русский киберслон»</span>
          </a>
        </div>
  	 	</div>
    </footer>
  );
}

export default Footer;