import React, { useState, useEffect } from "react";
import DayList from "components/DayList.js"
import "components/Application.scss";
import Appointment from "components/Appointment/index"
import axios from "axios";
import getAppointmentsForDay from "helpers/selectors";

// const appointments = {
//   "1": {
//     id: 1,
//     time: "12pm",
//   },
//   "2": {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer:{
//         id: 3,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   "3": {
//     id: 3,
//     time: "2pm",
//   },
//   "4": {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Archie Andrews",
//       interviewer:{
//         id: 4,
//         name: "Cohana Roy",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       }
//     }
//   },
//   "5": {
//     id: 5,
//     time: "4pm",
//   }
// };

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {}
  });
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  //helper function to set the state for day and days
  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => setState({...prev, days}));;
// Promise.all example
  // Promise.all([
  //   axios.get('/first_endpoint'),
  //   axios.get('/second_endpoint'),
  //   axios.get('/third_endpoint')
  // ]).then((all) => {
  //   console.log(all[0]); // first
  //   console.log(all[1]); // second
  //   console.log(all[2]); // third
  // });

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data}));
    })
  }, []);
  return (
    <main className="layout">
      <section className="sidebar">
      <img
  className="sidebar--centered"
  src="images/logo.png"
  alt="Interview Scheduler"
/>
<hr className="sidebar__separator sidebar--centered" />
<nav className="sidebar__menu">
<DayList 
  days={state.days} 
  value={state.day} 
  onChange={setDay}  />
</nav>
<img
  className="sidebar__lhl sidebar--centered"
  src="images/lhl.png"
  alt="Lighthouse Labs"
/>
      </section>
      <section className="schedule">
        {dailyAppointments.map((appointment) => 
        <Appointment 
        key={appointment.id} 
       {...appointment}
      />
        )}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
