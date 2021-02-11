
import { useState, useEffect } from 'react';

const Modal = (props) => {

	const [display, setDisplay] = useState(true);

	useEffect(() => {
		if (props.calendarIsOpen) {
			setDisplay(true);
		}
	}, [props.calendarIsOpen]);

	function closeModal() {
		setDisplay(false);
	}

	return (
		display && (
			<div className="modal">
				<div className="modal-content">
					<h1>Добро пожаловать!</h1>
					<p>Это новая версия старого какса.</p>
					<div className="modal-btn-container">
						<button className="modal-btn" 
						          onClick={ () => closeModal() }
						         tabIndex={0}>
						    <div tabIndex={-1}>
								<span>Начать знакомство</span>
							</div>
						</button>
					</div>
					<button className="close-button"
							  onClick={ () => closeModal() }>
					    <span className="close-icon"></span>
				    </button>
				</div>
			</div>
		)
	)
}

export default Modal;