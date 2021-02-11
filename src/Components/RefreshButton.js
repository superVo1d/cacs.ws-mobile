
const RefreshButton = () => {
	
	const handleClickRefresh = () => {
		//
    }

    return (
    	<button className="btn refresh" 
                       tabIndex={0}
                        onClick={ () => handleClickRefresh() }>
            <div tabIndex={-1}><span className="refresh-icon"></span></div>
        </button>
    )

}