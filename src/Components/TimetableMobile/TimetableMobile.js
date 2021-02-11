import React, { useState, useEffect } from 'react';

import './TimetableMobile.css';
import FormatTeacher from './../FormatTeacher';

const TimetableMobile = (props) => {

	const [week, setWeek] = useState(getWeekNumber(new Date()));

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

	function getWeek() {
	    let date = new Date();

	    let shiftedWeekDate;

	    if (halfYear() === 2) {
	      //Второй семестр
	      shiftedWeekDate = date.getDate() + 7 * (week - getWeekNumber(new Date()));
	    } else {
	      //Первый семестр
	      if (((getWeekNumber(new Date()) > 26) && (week > 26)) || ((getWeekNumber(new Date()) < 26) && (week < 26))) {
	        //Если week в этом же году
	        shiftedWeekDate = date.getDate() + 7 * (week - getWeekNumber(new Date()));
	      } else { 
	        //Если недели в разных годах
	        //getWeekNumber(new Date()) > 26
	        if (getWeekNumber(new Date()) > 26) {
	          //week в следующем году.
	          shiftedWeekDate = date.getDate() + 7 * ( 53 - week + getWeekNumber(new Date()));
	        } else {
	          //week в прошлом году.
	          shiftedWeekDate = date.getDate() + 7 * ( week - 53 - getWeekNumber(new Date()));
	        }
	      }
	    }

	    date.setDate(shiftedWeekDate);

	    let days = [];

	    for (let i = 1; i <= 7; i++) {

	      let dayOfWeek;

	      if (date.getDay() === 0) {
	        dayOfWeek = 7;
	      } else {
	        dayOfWeek = date.getDay();
	      }
	      
	      let first = date.getDate() - dayOfWeek + i;
	      let day = new Date(date.setDate(first));
	      days.push(day);
	    }

	    return days;
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

	function getFirstMonday (date) {
		let d = date;

		while (d.getDay() !== 1) {
		    d.setDate(d.getDate() + 1);
		}

		return d;
	}

	function getBoundsForWeeks() {
	    let date = new Date();

	    let month = date.getMonth();
	    let lowerBound;
	    let upperBound;

	    if (halfYear() === 2) {
			//Второе полугодие
			lowerBound = getFirstMonday(new Date(date.getFullYear(), 1, 1, 0, 0, 0, 0));
			upperBound = new Date(date.getFullYear(), 7, 0, 0, 0, 0, 0);
		} else {
			//Первое полугодие
			if (date.getMonth !== 0) {
			//Сейчас не январь
			lowerBound = new Date(date.getFullYear() - 1, 7, 1, 0, 0, 0, 0);
			upperBound = new Date(date.getFullYear(), 1, 0, 0, 0, 0, 0);
			} else {
			//Сейчас январь
			lowerBound = new Date(date.getFullYear() - 1, 7, 1, 0, 0, 0, 0);
			upperBound = new Date(date.getFullYear(), 1, 0, 0, 0, 0, 0);
			}
		}

		lowerBound = getWeekNumber(lowerBound);
		upperBound = getWeekNumber(upperBound);

		return [lowerBound, upperBound];
	}

	const lowerBound = getBoundsForWeeks()[0];
    const upperBound = getBoundsForWeeks()[1];

	const formatTeacher = (teachers) => {
		return <FormatTeacher teachers={ teachers }/>
	}

	const handleClickPrevWeek = (prev) => {
		setWeek(prev => {
		  if (prev === 1) {
		    return 53;
		  } else {
		    return ((prev - 1) % 53 + 53) % 53;
		  }
		});
	}

	const handleClickNextWeek = (next) => {
		setWeek(prev => {
		  if (prev === 53) {
		    return 1;
		  } else {
		    return ((prev + 1) % 53 + 53) % 53;
		  }
		});
	}

	const daysOfWeek = getWeek();

	return (
		<>
			<div className="week-navigation">
				<div className="btn-container">
				{ (((halfYear() === 1) && ((week > lowerBound) || (week <= upperBound))) || ((halfYear() === 2) && (week > lowerBound))) &&
                	(<button className="btn prev" 
	                         tabIndex={0}
	                          onClick={ () => handleClickPrevWeek() }>
	                	<div tabIndex={-1}><span className="prev-icon"></span></div>
	              	</button>)
	            }
              	</div>
              	<div className="dates">
              		{ daysOfWeek.map((day, i) => {
          				const t = new Date();

          				const isToday = ((day.getDate() === t.getDate()) && (day.getMonth() === t.getMonth()) && (day.getFullYear() === t.getFullYear()))

          				return (<div className={isToday ? "date day today" : "date day" } key={i}>
          						<div>
          							<div>{ day.getDate() }</div>
      							</div>
  							</div>)
          			})}
				</div>
				{ (((halfYear() === 1) && ((week < upperBound) || (week >= lowerBound))) || ((halfYear() === 2) && (week < upperBound))) &&
	              (<div className="btn-container">
						<button className="btn next" 
		                         tabIndex={0}
		                          onClick={ () => handleClickNextWeek() }>
		                	<div tabIndex={-1}><span className="next-icon"></span></div>
		              	</button>
	              	</div>)
                }
			</div>
			<div className="timetable-mobile-wrapper">
				<div className="timetable-scrollable">
					<section>
						<div className="row day">
							<div className="field time"></div>
							<div className="date-info">
								<span>Понедельник,</span>
								<br/>
								<span><b>31 декабря</b></span>
							</div>
						</div>
						<div className="row">
							<div className="field time">9:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date">
				              <div className="event">
				                <div>
				                  <b>Эконометрика-2</b>
				                </div>
				                <div className="teacher">Картаев Ф.С.</div> 
				                <div className="label">
				                  <div>
				                  	Лекция — <b>ZOOM</b>
				                  </div>
				                </div>						
			                  </div>						
							</div>
						</div>
						<div className="row">
							<div className="field time">12:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">14:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">15:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">17:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">19:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">20:40</div>
							<div className="date"></div>
						</div>
					</section>
					<section>					
						<div className="row day">
							<div className="field time"></div>
							<div className="date-info">
								<span>Вторник,</span>
								<br/>
								<span><b>1 января</b></span>
							</div>
						</div>
						<div className="row">
							<div className="field time">9:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">12:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">14:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">15:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">17:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">19:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">20:40</div>
							<div className="date"></div>
						</div>		
					</section>
					<section>			
						<div className="row day">
							<div className="field time"></div>
							<div className="date-info">
								<span>Среда,</span>
								<br/>
								<span><b>2 января</b></span>
							</div>
						</div>
						<div className="row">
							<div className="field time">9:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">12:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">14:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">15:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">17:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">19:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">20:40</div>
							<div className="date"></div>
						</div>
					</section>
					<section>							
						<div className="row day">
							<div className="field time"></div>
							<div className="date-info">
								<span>Четверг,</span>
								<br/>
								<span><b>3 января</b></span>
							</div>
						</div>
						<div className="row">
							<div className="field time">9:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">12:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">14:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">15:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">17:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">19:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">20:40</div>
							<div className="date"></div>
						</div>	
					</section>					
					<section>
						<div className="row day">
							<div className="field time"></div>
							<div className="date-info">
								<span>Пятница,</span>
								<br/>
								<span><b>4 января</b></span>
							</div>
						</div>
						<div className="row">
							<div className="field time">9:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">12:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">14:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">15:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">17:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">19:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">20:40</div>
							<div className="date"></div>
						</div>	
					</section>
					<section>						
						<div className="row day">
							<div className="field time"></div>
							<div className="date-info">
								<span>Суббота,</span>
								<br/>
								<span><b>5 января</b></span>
							</div>
						</div>
						<div className="row">
							<div className="field time">9:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">12:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">14:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">15:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">17:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">19:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">20:40</div>
							<div className="date"></div>
						</div>	
					</section>
					<section>							
						<div className="row day">
							<div className="field time"></div>
							<div className="date-info">
								<span>Воскресенье,</span>
								<br/>
								<span><b>6 января</b></span>
							</div>
						</div>
						<div className="row">
							<div className="field time">9:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">10:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">12:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">14:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">15:40</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">17:20</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">19:00</div>
							<div className="date"></div>
						</div>
						<div className="row">
							<div className="field time">20:40</div>
							<div className="date"></div>
						</div>			
					</section>					
				</div>
			</div>
		</>
	);
}

export default TimetableMobile;