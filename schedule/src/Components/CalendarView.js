import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { Modal, Button } from 'react-bootstrap';

import './calendar.css'
const CalendarView = () => {
    const [data, setData] = useState([]);
    const [calDate, setCalDate] = useState('');
    const [show, setShow] = React.useState(false);

    useEffect(() => {
        // Assuming your JSON key in local storage is "recruiter1-2023-09-17"
        const jsonData = localStorage.getItem(`recruiter1-${calDate}`);
        console.log(`recruiter1-${calDate}`);
        if (jsonData) {
            setData(JSON.parse(jsonData));
            console.log(jsonData);
        }
       
    }, [calDate]);

    const handleDayClick = (info) => {
        if(data.date !== info.startStr){
            setData([])
        }
        if (!isFriday(info.start)) {
            setShow(true)
            setCalDate(info.startStr)
            console.log('Selected Date:', info.startStr);
        }
        else {
            return
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

    // Generate events for every Friday with the "holiday" text
    const generateHolidayEvents = () => {
        const startDate = new Date('2023-01-01'); // Adjust the start date as needed
        const endDate = new Date('2023-12-31'); // Adjust the end date as needed
        const holidayEvents = [];

        while (startDate <= endDate) {
            if (isFriday(startDate)) {
                holidayEvents.push({
                    title: 'holiday',
                    start: startDate.toISOString().split('T')[0], // Format as 'YYYY-MM-DD'
                    allDay: true,
                });
            }
            startDate.setDate(startDate.getDate() + 1); // Move to the next day
        }
        holidayEvents.push({
            title: 'Events',
            start: data.date
        })
        return holidayEvents;
    };

    const holidayEvents = generateHolidayEvents();
    return (
        <div className='mt-4 w-75 ms-auto me-auto justify-content-center align-items-center'>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={holidayEvents}
                selectable={true}
                select={handleDayClick}
                height={"80vh"}
            />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{ `Meeting - ${data.date  || 'No meeting'}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {data.names ?
                        (<table className='table'>
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Name</th>
                                    <th>Message</th>
                                    <th>Subject</th>
                                    <th>Recruiter</th>
                                    <th>Time Slots</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.names.map((name, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{name}</td>
                                            <td>{data.messages[index]}</td>
                                            <td>{data.subjects[index]}</td>
                                            <td>{data.recruiter}</td>
                                            <td>{data.timeSlots[index]}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>)
                        :
                        <p>No schedule today !</p>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CalendarView