import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const FormatTeacher = ({teachers}) => {

	const [display, setDisplay] = useState(false);
	const history = useHistory();

  if (!('cacs_id' in teachers[0])) {
      return null;
  }

  if (typeof teachers === 'undefined') {
    return null;
  }

  if (teachers.length > 2) {
    return (
      <>
        <span className="teacher-name" title={ teachers[0].last_name + ' ' + teachers[0].name + ' ' + teachers[0].patronymic }
          onMouseUp={ () => history.push(`${process.env.PUBLIC_URL}/${ teachers[0].status + teachers[0].cacs_id }`) }>
          { teachers[0].last_name + ' ' + teachers[0].name[0] + '.' + teachers[0].patronymic[0] + '.' }
        </span>
        <br/>
        {display ? 
        	(<div className="collapsible-wrapper">
          	<div className="collapsible">
	            { teachers.map((teacher, i) => {
	                if (i > 0) {
	                  return (
	                    <React.Fragment key={i}>
	                      <span className="teacher-name" title={ teacher.last_name + ' ' + teacher.name + ' ' + teacher.patronymic } 
	                        onMouseUp={ () => history.push(`${process.env.PUBLIC_URL}/${ teacher.status + teacher.cacs_id }`) }>
	                        { teacher.last_name + ' ' + teacher.name[0] + '.' + teacher.patronymic[0] + '.\n' }
	                      </span>
	                      <br/>
	                    </React.Fragment>                    
	                  );
	                }
	              })
	            }
	        </div>
        </div>)
        :
          (<span className="toggle" 
                   onClick={ () => setDisplay(!display) }>
          	и {teachers.length - 1} др.
           </span>)
      }
      </>);
  } else if (teachers.length === 2) {
    return (teachers.map((teacher, i) => (
      <React.Fragment key={i}>
        <span className="teacher-name" title={ teacher.last_name + ' ' + teacher.name + ' ' + teacher.patronymic } 
          onMouseUp={ () => history.push(`/${ teacher.status + teacher.cacs_id }`) }>
          { teacher.last_name + ' ' + teacher.name[0] + '.' + teacher.patronymic[0] + '.\n' }
        </span>
        <br/>
      </React.Fragment>
    )));
  } else {
    return (
      <span className="teacher-name" title={ teachers[0].last_name + ' ' + teachers[0].name + ' ' + teachers[0].patronymic }
        onMouseUp={ () => history.push(`/${ teachers[0].status + teachers[0].cacs_id }`) }>
        { teachers[0].last_name + ' ' + teachers[0].name[0] + '.' + teachers[0].patronymic[0] + '.' }
      </span>
    )
  }
}

export default FormatTeacher;