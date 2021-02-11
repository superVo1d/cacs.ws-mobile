import { useMediaQuery } from 'react-responsive'

function DownloadButton() {

	const isTabletOrMobile = useMediaQuery({
	    query: '(max-width: 1224px)'
    })

	return (
		<button className={isTabletOrMobile ? "download-btn download-btn-sm" : "download-btn"} tabIndex={0}>
		    <div tabIndex={-1}>
				{ isTabletOrMobile ? '' : <span>Скачать расписание</span> }
				<span className="download-btn-icon"></span>
			</div>
		</button>
	)
}

export default DownloadButton;