import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

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
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    })
  }, []);

  function getRemainingSpots(day, appointments) {
    let remainingSpots = 0;
    let curDaySpots = day.appointments;
    for (const spot of curDaySpots) {
      if (appointments[spot].interview === null) {
        remainingSpots = remainingSpots + 1;
      }
    }
    return remainingSpots;
  }

  function updateSpots(days, appointments) {
    const newDays = days.map(day => ({
      ...day, spots: getRemainingSpots(day, appointments)
    }));
    return newDays;
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id], interview: { ...interview }
    };
    const appointments = {
      ...state.appointments, [id]: appointment
    };
    const days = updateSpots(state.days, appointments);
    return axios.put(`/api/appointments/${id}`, {
      interview
    })
    .then(() => {
      setState({
      ...state,
      appointments,
      days
    });
    })
  };

  function cancelInterview(id) {
    const canceledAppointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: canceledAppointment
    };
    const days = updateSpots(state.days, appointments);
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState({...state, appointments, days});
      })
  }


  return { state, setDay, bookInterview, cancelInterview }
}