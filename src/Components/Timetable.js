import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import FormatTeacher from './FormatTeacher';

import { useParams, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'

const Timetable = (props) => {

  const [calendarIsOpen, setCalendarIsOpen] = useState(false);

  const [schedule, setSchedule] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [refreshTime, setRefreshTime] = useState(null);

  const [week, setWeek] = useState(getWeekNumber(new Date()));
  
  const location = useLocation();
  const {id} = useParams();

  const isTabletOrMobile = useMediaQuery({
    query: '(max-width: 1224px)'
  })

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const timeStamps = ['9:00', '10:40', '12:20', '14:00', '15:40', '17:20', '19:00', '20:40'];

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
  }, []);

  useEffect(() => {
    setWeek(getWeekNumber(new Date()))
  }, [id]);

  const handleScrollEvent = (e) => {

    if (window.scrollY > 104) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
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

  function getMonth() {

    let currentWeek = getWeek();

    let date = new Date();

    //Узнать к какому месяцу относится текущая дата.
    let currentMonth = new Date().getMonth();
    //Записать название месяца первого дня недели.
    let firstDayMonth = currentWeek[0].getMonth();
    let lastDayMonth = currentWeek[6].getMonth();

    //Если совпадает с месяцем текущей даты, то поставить его.
    if (firstDayMonth === currentMonth) {
      date.setMonth(currentMonth);
    } else if (lastDayMonth === currentMonth) {
      //Проверить последний день, если он принадлежит текущему месяцу, то поставить его.
      date.setMonth(currentMonth);
    } else {
      //Проверять совпадает ли месяц следующего дня недели с месяцем первого дня.
      let counter = 0;    
      //Если совпадений больше трех, то поставить его.
      currentWeek.forEach((day, i) => {
        if (firstDayMonth === day.getMonth()) {
          counter++;
        }
      });

      if (counter > 3) {
        date.setMonth(firstDayMonth);
      } else {
        date.setMonth(lastDayMonth);
      }
    }

    if (halfYear() === 2) {
      //Второе полугодие
      if (firstDayMonth < lowerBound) {
        //Первый день месяца выходит заграницы снизу
        date.setMonth(lastDayMonth);
      }

      if (lastDayMonth > upperBound) {
        //Последний день месяца выходит заграницы сверху
        date.setMonth(firstDayMonth);
      }
    } else {
      //Первое полугодие
      if (currentMonth > 7) {
        //До нового года
        if (firstDayMonth < lowerBound) {
          //Первый день месяца выходит заграницы снизу
          date.setMonth(lastDayMonth);
        }
      } else {
        //После нового года
        if (lastDayMonth > upperBound) {
          //Последний день месяца выходит заграницы сверху
          date.setMonth(lastDayMonth);
        }
      }
    }

    return date.getMonth();
  }

  function getYear() {

    let currentWeek = getWeek();

    // Узнать к какому году относится текущая дата.
    let currentYear = new Date().getFullYear();
    // Записать год первого дня недели.
    let firstDayYear = currentWeek[0].getFullYear();
    // Если совпадает с годом текущей даты, то поставить его.
    if (firstDayYear === currentYear) {
      return currentYear;
    }
    // Проверить последний день, если он принадлежит текущему году, то поставить его.
    let lastDayYear = currentWeek[6].getFullYear();

    if (lastDayYear === currentYear) {
      return currentYear;
    }
    // Проверять совпадает ли год следующего дня недели с годом первого дня.
    let counter = 0;
    // Если совпадений больше трех, то поставить его.

    currentWeek.forEach((day, i) => {
      if (firstDayYear === day.getFullYear()) {
        counter++;
      }
    });

    if (counter > 3) {
      return firstDayYear;
    } else {
      return lastDayYear;
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

  const formatType = (type) => {

    let title;

    switch (type.toLowerCase()){
      case 'сем': 
        title = 'Семинар';
        break;

      case 'лк': 
        title = 'Лекция';
        break;

      case 'кс': 
        title = 'Консультация';
        break;

      case 'экз': 
        title = 'Экзамен';
        break;

      case 'кнч': 
        title = 'Контактные часы';
        break;

      default:
        break;
    }

    return <span title={ title }>{ type }</span>;
  }

  const formatPlace = (place) => {
    //let exp = /zoom/g;

    // if (exp.test(place.toLowerCase())) {
    //   return 'Zoom';
    // } else {
    //   return place;
    // }

    return <span title={ place }><b>{ place }</b></span>;
  }

  const formatRefreshDate = (number) => {

    const date = new Date(number * 1000);
    const options = { hour: 'numeric', minute: 'numeric', month: 'long', day: 'numeric', 'time': 'long' };

    return date.toLocaleDateString('ru-RU', options);
  }

  useEffect(() => {
    setIsLoaded(false);

    const apiPrefix = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? '' : 'api/';

    fetch(apiPrefix + 'schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "cacs_id": id.slice(1),
            "status": id[0],
            "week": week
        })
      })
    .then(res => res.json())
    .then((res) => {
        setSchedule(res.schedule);
        setRefreshTime(res.refresh_time);
        setIsLoaded(true);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [week, location, id]);

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

  const renderEvent = (d, time, i) => {

    let today = [new Date().getDate(), new Date().getMonth(), new Date().getFullYear()];
    let currentDate = [d.getDate(), d.getMonth(), d.getFullYear()];

    let isToday = true;

    today.forEach((item, i) => {
      if (item !== currentDate[i]) {
        isToday = false;
      }
    })

    let day = d.getDate();

    if (isLoaded) {

      let eventId = Object
        .keys(schedule)
        .filter(i => schedule[i].day === day)
        .filter(i => {
          let hours = schedule[i].hours;
          let minutes = schedule[i].minutes; 

          if (schedule[i].minutes === 0) {
            minutes = '00';
          }

          return hours + ':' + minutes === time;
        })[0];

      if (typeof eventId !== 'undefined') {

        let event = schedule[eventId];

        return(
          <div className={ isToday ? "date today" : "date" } key={i}>
              <div className="event">
                <div title={ event.name.replace(/\s+/g, ' ').trim() } >
                  <b>{event.short_name}</b>
                </div>
                {(event.teacher[0]) ? 
                  <div className="teacher">{ formatTeacher(event.teacher) }</div> 
                  : null
                }
                <div className="label" style={{backgroundColor: (event.color >= 0) ? 'var(--color-' + (event.color % 12) + ')' : "var(--label-default-color)"}}>
                  <div>
                  { formatType(event.type) } — { formatPlace(event.place) }
                  </div>
                </div>
            </div>
          </div>
        )
      } else {
        return <div className={ isToday ? "date today" : "date" } key={i}></div>
      }
    } else {

      return (
        <div className={ isToday ? "date today" : "date" } key={i}></div>
      )

      // Заглушка

      // if (Math.random() > 0.5) {
      //   return (
      //     <div className={ isToday ? "date today" : "date" } key={i}>
      //       <div className="event">
      //         <div className="name plug"></div> 
      //         <div className="teacher plug"></div> 
      //         <div className="label plug"></div>
      //       </div>        
      //     </div>
      //   )
      // } else {
      //   return (
      //     <div className={ isToday ? "date today" : "date" } key={i}></div>
      //   )
      // }
    }
  }
  
  const renderRows = () => {
    return(timeStamps.map((time, i) => {
      return(
        <div className="row" key={i}>
          <div className="field time">{ time }</div>
            <div className="events">
            { getWeek().map((day, i) => {
              return renderEvent(day, time, i);
            })}
            </div>
          <div className="field white-space"></div>
        </div>
      )
    }))
  }

  return (
    <div className="wrapper timetable-wrapper">
      <div className="info">
        <div className="field white-space"></div>
          <div className="date-info" 
            onMouseEnter={ () => setCalendarIsOpen(true) }
                 onClick={ () => setCalendarIsOpen(true) }
                tabIndex={-1}>
            <span className="month"><b>{ monthNames[getMonth()] }</b></span>
            <span className="year">&nbsp;{ getYear() }&nbsp;г.</span>
            <Calendar 
                 calendarIsOpen={ calendarIsOpen }
              setCalendarIsOpen={ setCalendarIsOpen } 
                          month={ getMonth() }
                           year={ getYear() }
                        setWeek={ setWeek }/>
          </div>     
          { refreshTime &&    
            <div className={ isTabletOrMobile ? "last-update last-update-sm" : "last-update"}>
              <span>Обновлено: { formatRefreshDate(refreshTime) }</span>
            </div>
          }
        <div className="field white-space"></div>  
      </div>
      <div className="schedule">
        <div className={ isScrolled ? "row schedule-nav schedule-nav-scrolled" : "row schedule-nav" }>
          <div className="field time">
            { (((halfYear() === 1) && ((week > lowerBound) || (week <= upperBound))) || ((halfYear() === 2) && (week > lowerBound))) &&
              (<button className="btn prev" 
                       tabIndex={0}
                        onClick={ () => handleClickPrevWeek() }>
                <div tabIndex={-1}><span className="prev-icon"></span></div>
              </button>)
            }
          </div>
          <div className="dates">
          { getWeek().map((day, i) => {

              let t = new Date();

              let today = [t.getDate(), t.getMonth(), t.getFullYear()];
              let currentDate = [day.getDate(), day.getMonth(), day.getFullYear()];

              let isToday = true;

              today.forEach((item, i) => {
                if (item !== currentDate[i]) {
                  isToday = false;
                }
              })

              return(
                <div className={ isToday ? "date day today" : "date day" } key={i}>
                  <div>{ daysOfWeek[i] }, <b>{day.getDate()}</b></div>
                </div>
              )
          })}
          </div>
          <div className="field white-space">
            { (((halfYear() === 1) && ((week < upperBound) || (week >= lowerBound))) || ((halfYear() === 2) && (week < upperBound))) &&
              (<button className="btn next" 
                     tabIndex={0}
                      onClick={ () => handleClickNextWeek() }>
                <div tabIndex={-1}><span className="next-icon"></span></div>
              </button>)
            }
          </div>  
        </div>
        { renderRows() }
      </div>
    </div>
  );
}

export default Timetable;
