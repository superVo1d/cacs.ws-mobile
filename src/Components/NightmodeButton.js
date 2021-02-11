
function NightmodeButton(props) {
	return(
		<button
		  className="nightmode-btn"
			onClick={props.toggleTheme}
		   tabIndex={0}
		       type="button">
				<div className="nightmode-icon" tabIndex={-1}>
					<span>{ (props.isChecked) ? '☀️' : '🌙' }</span>
				</div>
		</button>
	)
}

export default NightmodeButton;