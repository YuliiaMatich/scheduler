export function getAppointmentsForDay(state, day) {
  const daysFiltered = state.days.filter(dayItem => dayItem.name === day);

  if (state.days.length === 0 || daysFiltered.length === 0) {
    return [];
  }

  let appointmentsFiltered = [];

  for (let appointment of daysFiltered[0].appointments) {
    appointmentsFiltered.push(state.appointments[appointment])
  }
return appointmentsFiltered;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const resultInterviewObj = {
    student: interview.student
  };
  resultInterviewObj.interviewer = state.interviewers[interview.interviewer];
  return resultInterviewObj;
}