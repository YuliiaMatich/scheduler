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

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id], interview: { ...interview }
    };
    const appointments = {
      ...state.appointments, [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, {
      interview
    })
    .then(() => {
      setState({
      ...state,
      appointments
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
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState({...state, appointments});
      })
  }


  return { state, setDay, bookInterview, cancelInterview }
}