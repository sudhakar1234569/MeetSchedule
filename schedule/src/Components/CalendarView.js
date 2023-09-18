import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button } from "react-bootstrap";
import "./calendar.css";

const CalendarView = () => {
  const [data, setData] = useState([]);
  const [recruit2, setRecruit2] = useState([]);
  const [recruit3, setRecruit3] = useState([]);
  const [recruit4, setRecruit4] = useState([]);
  const [recruit5, setRecruit5] = useState([]);
  const [calDate, setCalDate] = useState("");
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    // Assuming your JSON key in local storage is "recruiter1-2023-09-17"
    const jsonData = localStorage.getItem(`recruiter1-${calDate}`);
    const recruiter2 = localStorage.getItem(`recruiter2-${calDate}`);
    const recruiter3 = localStorage.getItem(`recruiter3-${calDate}`);
    const recruiter4 = localStorage.getItem(`recruiter4-${calDate}`);
    const recruiter5 = localStorage.getItem(`recruiter5-${calDate}`);
    // console.log(`recruiter1-${calDate}`);
    if (jsonData) {
      setData(JSON.parse(jsonData));
      console.log(jsonData);
    }
    if (recruiter2) {
      setRecruit2(JSON.parse(recruiter2));
    }
    if(recruiter3){
        setRecruit3(JSON.parse(recruiter3));
    }
    if(recruiter4){
        setRecruit4(JSON.parse(recruiter4));
    }
    if(recruiter5){
        setRecruit5(JSON.parse(recruiter5));
    }
  }, [calDate]);

  const handleDayClick = (info) => {
    if (data.date !== info.startStr) {
      setData([]);
    }
    if (!isFriday(info.start)) {
      setShow(true);
      setCalDate(info.startStr);
      console.log("Selected Date:", info.startStr);
    } else {
      return;
    }
  };
  const handleClose = () => {
    setShow(false);
  };
  const isFriday = (date) => {
    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();
    return dayOfWeek === 5; // 5 corresponds to Friday
  };
  useEffect(()=>{
    
  })
  // Generate events for every Friday with the "holiday" text
  const generateHolidayEvents = () => {
    const startDate = new Date("2023-01-01"); // Adjust the start date as needed
    const endDate = new Date("2023-12-31"); // Adjust the end date as needed
    const holidayEvents = [];

    while (startDate <= endDate) {
      if (isFriday(startDate)) {
        holidayEvents.push({
          title: "holiday",
          start: startDate.toISOString().split("T")[0], // Format as 'YYYY-MM-DD'
          allDay: true,
        });
      }
      startDate.setDate(startDate.getDate() + 1); // Move to the next day
    }
    holidayEvents.push({
      title: "Events",
      start: data.date,
    });
    return holidayEvents;
  };

  const holidayEvents = generateHolidayEvents();
  return (
    <div className="mt-4 w-75 ms-auto me-auto justify-content-center align-items-center">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        events={holidayEvents}
        selectable={true}
        select={handleDayClick}
        height={"80vh"}
        // dayCellDidMount={handlePastDays}
      />
      <Modal show={show} onHide={handleClose} className="sizeIncrease">
        <Modal.Header closeButton>
          <Modal.Title>{`Meeting - ${data.date || "No meeting"}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`${(calDate!==data.date) ? '' :'modal-body resize'}`}>
            {data.date ? (
              <table className="table table-hover">
                <thead className="position-sticky top-0">
                  <tr >
                    <th >S.No.</th>
                    <th>Name</th>
                    <th>Message</th>
                    <th>Subject</th>
                    <th>Recruiter</th>
                    <th>Time Slot</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="table-primary">
                      Recruiter 1 - Schedule
                    </td>
                  </tr>
                  {data.names.map((name, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{name}</td>
                      <td>{data.messages[index]}</td>
                      <td>{data.subjects[index]}</td>
                      <td>{data.recruiter}</td>
                      <td>{data.timeSlots[index]}</td>
                    </tr>
                  ))}
                  <tr><td></td></tr>
                  <tr>
                    <td colSpan="2" className="table-warning">
                      Recruiter 2 - Schedule
                    </td>
                  </tr>
                  {
                   recruit2.date ? (
                  recruit2.names.map((name2, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{name2}</td>
                      <td>{recruit2.messages[index]}</td>
                      <td>{recruit2.subjects[index]}</td>
                      <td>{recruit2.recruiter}</td>
                      <td>{recruit2.timeSlots[index]}</td>
                    </tr>
                  ))) :
                    <tr><td colSpan="6" className="table-danger">No meeting today !</td></tr>
                  }
                  <tr><td></td></tr>
                   <tr>
                    <td colSpan="2" className="table-info">
                      Recruiter 3 - Schedule
                    </td>
                  </tr>
                  {
                   recruit3.date ? (
                  recruit3.names.map((name3, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{name3}</td>
                      <td>{recruit3.messages[index]}</td>
                      <td>{recruit3.subjects[index]}</td>
                      <td>{recruit3.recruiter}</td>
                      <td>{recruit3.timeSlots[index]}</td>
                    </tr>
                  ))) :
                    <tr><td colSpan="6" className="table-danger">No meeting today !</td></tr>
                  }
                  <tr><td></td></tr>
                   <tr>
                    <td colSpan="2" className="table-info">
                      Recruiter 4 - Schedule
                    </td>
                  </tr>
                  {
                   recruit4.date ? (
                    recruit4.names.map((name4, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{name4}</td>
                      <td>{recruit4.messages[index]}</td>
                      <td>{recruit4.subjects[index]}</td>
                      <td>{recruit4.recruiter}</td>
                      <td>{recruit4.timeSlots[index]}</td>
                    </tr>
                  ))) :
                    <tr><td colSpan="6" className="table-danger">No meeting today !</td></tr>
                  }
                   <tr><td></td></tr>
                   <tr>
                    <td colSpan="2" className="table-info">
                      Recruiter 5 - Schedule
                    </td>
                  </tr>
                  {
                   recruit5.date ? (
                    recruit5.names.map((name5, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{name5}</td>
                      <td>{recruit5.messages[index]}</td>
                      <td>{recruit5.subjects[index]}</td>
                      <td>{recruit5.recruiter}</td>
                      <td>{recruit5.timeSlots[index]}</td>
                    </tr>
                  ))) :
                    <tr><td colSpan="6" className="table-danger">No meeting today !</td></tr>
                  }
                </tbody>
              </table>
            ) : (
              <p>No schedule today !</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarView;
