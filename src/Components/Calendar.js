import { useState, useEffect } from 'react'

const Calendar = (props) => {

	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

	const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

	const [display, setDisplay] = useState(false);
	const [delta, setDelta] = useState(0);

    useEffect(() => {
		setCurrentMonth(props.month);
	}, [props.month]);

    useEffect(() => {
		setCurrentYear(props.year);
	}, [props.year]);

	const getWeeksInMonth = () => {
		let month = currentMonth;
		let year = currentYear;

		var weeks = [],

		firstDate = new Date(year, month, 1),
		lastDate = new Date(year, month + 1, 0), 
		numberOfDays = lastDate.getDate();

		var start = 1;
		var end = 7 - firstDate.getDay();

		while (start <= numberOfDays) {
			weeks.push({
				start: start,
				end: end
			});

			start = end + 1;
			end = end + 7;

			if (end > numberOfDays)
			   end = numberOfDays;    
		}       

		return weeks;
	}   

	const getDates = () => {
		
		let month = currentMonth;
		let year = currentYear;
		
		var dates = [],

		firstDate = new Date(year, month, 1),
		lastDate = new Date(year, month + 1, 0), 

		numberOfDays = lastDate.getDate();

		//Первая неделя

		if (firstDate.getDay() === 0) {
			for (let i = 6; i > 0; i--) {
				dates.push(new Date(year, month, - i + 1))
			}
		} else {
			for (let i = firstDate.getDay() - 1; i > 0; i--) {
				dates.push(new Date(year, month, - i + 1))
			}
		}

		//Дни месяца

		for (let i = 0; i < numberOfDays; i++) {
			dates.push(new Date(year, month, i + 1));
		}

		//Последняя неделя

		if (lastDate.getDay() !== 0) {
			for (let i = 1; i <= 7 - lastDate.getDay(); i++) {
				dates.push(new Date(year, month + 1, i));
			}
		}

		return dates;
	}  

    useEffect(() => {
		if (props.calendarIsOpen) {
			setDisplay(true);
			setCurrentMonth(props.month)
			setCurrentYear(props.year);
		}
	}, [props.calendarIsOpen]);

    const onAnimationEnd = () => {
		if (!props.calendarIsOpen){
			setDisplay(false);
		}
	}

	const handleClickPrev = () => {
		if (((currentMonth % 12 + 12) % 12) === 0) {
			setCurrentYear(prev => prev - 1);
		}

		setDelta(delta - 1);

		setCurrentMonth(((currentMonth - 1) % 12 + 12) % 12);
	}

	const handleClickNext = () => {
		if (((currentMonth % 12 + 12) % 12) === 11) {
			setCurrentYear(prev => prev + 1);
		}

		setDelta(delta + 1);

		setCurrentMonth(((currentMonth + 1) % 12 + 12) % 12);
	}	

	const formatClassName = (day, i) => {

		if (delta === 0) {
			const name = 
			    ((day.getMonth() !== currentMonth) ? "not-this-month" : "")
				+ " " 
				+ ((((i + 1) % 7 === 0) || ((i + 2) % 7 === 0)) ? "weekend" : "")
				+ " "
				+ ((day.valueOf() === new Date().setHours(0,0,0,0)) ? "today" : "");

			return name.trim();
		} else {
			const name = 
			    ((day.getMonth() !== ((currentMonth % 12 + 12) % 12)) ? "not-this-month" : "")
				+ " " 
				+ ((((i + 1) % 7 === 0) || ((i + 2) % 7 === 0)) ? "weekend" : "")
				+ " "
				+ ((day.valueOf() === new Date().setHours(0,0,0,0)) ? "today" : "");

			return name.trim();
		}
	}

	const handleClickDate = (day) => {
		props.setWeek(getWeekNumber(day));
	}

	const halfYear = () => {
		let date = new Date();

		let month = date.getMonth();

		if (0 < month && month < 8) {
			return 2;
		} else {
			return 1;
		}
	}

	function getWeekNumber(d) {
	    // Copy date so don't modify original
	    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	    // Set to nearest Thursday: current date + 4 - current day number
	    // Make Sunday's day number 7
	    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
	    // Get first day of year
	    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
	    // Calculate full weeks to nearest Thursday
	    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
	    // Return array of year and week number
	    return weekNo;
	  }
	
	return (
		display && (
		  <div className="calendar-container" 
		           style={{ animation: `${props.calendarIsOpen ? "fadeIn" : "fadeOut"} .4s` }}
          onAnimationEnd={ onAnimationEnd} 
		  	 onMouseOver={ () => props.setCalendarIsOpen(true) }
		  	onMouseLeave={ () => props.setCalendarIsOpen(false) }>
		  	<div className="calendar-navigate">
		  		{ (((halfYear() === 1) && ((currentMonth === 0) || (currentMonth > 7))) || ((halfYear() === 2) && (currentMonth > 1))) &&
		  			<button className="btn prev" onClick={ () => handleClickPrev() }><div tabIndex="-1"><span className="prev-icon"></span></div></button>
		  		}
			    <div className="date-info">
			      <span className="month"><b>{ monthNames[(currentMonth % 12 + 12) % 12] }</b></span>
			      <span className="year">&nbsp;{ currentYear }&nbsp;г.</span>
			    </div>
			    { (((halfYear() === 1) && (currentMonth >= 7)) || ((halfYear() === 2) && (currentMonth < 6))) &&
			    	<button className="btn next" onClick={ () => handleClickNext() }><div tabIndex="-1"><span className="next-icon"></span></div></button>
			    }
		    </div>
		    <div className="calendar">
		    	{
		    		getDates().map((day, i) => {
						return (
							<div className={ formatClassName(day, i) } 
						           onClick={ () => handleClickDate(day) }
							           key={i}>
								<div>{day.getDate()}</div>
							</div>
						)
					})
		    	}
		    </div>
		  </div>
		)
	)
}

export default Calendar;