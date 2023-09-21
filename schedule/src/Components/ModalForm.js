import React, { useEffect, useLayoutEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setFormField, clearForm } from "../features/formSlice";
import { date } from "yup";

function ModalForm() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.formData);
  const [show, setShow] = React.useState(false);
  const [storedData, setStoredData] = React.useState({});
  const [disabledRecruiters, setDisabledRecruiters] = React.useState([]);
  const [currentRecruiter, setCurrentRecruiter] = useState([]);
  const [countOfDisableRecruiters, setCountOfDisableRecruiters] = useState([]);
  const [selectedDate1, setSelectedDate] = useState(null);
  const [calViewDate, setCalViewDate] = useState("");
  const [disabledDate, setDisabledDate] = useState(null);
  const minDate = new Date().toISOString().split("T")[0];
  const [formDateValue, setFormDateValue] = useState("");

  const today = new Date();
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    date: "",
    recruiter: "",
    timeSlot: "",
  });

  const timeSlots = [
    { value: "", label: "Select a time slot" },
    { value: "9:00 AM to 10:00 AM", label: "9:00 AM to 10:00 AM" },
    { value: "10:00 AM to 11:00 AM", label: "10:00 AM to 11:00 AM" },
    { value: "11:00 AM to 12:00 PM", label: "11:00 AM to 12:00 PM" },
    { value: "12:00 PM to 01:00 PM", label: "12:00 PM to 01:00 PM" },
    { value: "01:00 PM to 02:00 PM", label: "01:00 PM to 02:00 PM" },
    { value: "02:00 PM to 03:00 PM", label: "02:00 PM to 03:00 PM" },
    { value: "03:00 PM to 04:00 PM", label: "03:00 PM to 04:00 PM" },
    { value: "04:00 PM to 05:00 PM", label: "04:00 PM to 05:00 PM" },
    { value: "05:00 PM to 06:00 PM", label: "05:00 PM to 06:00 PM" },
    { value: "06:00 PM to 07:00 PM", label: "06:00 PM to 07:00 PM" },
  ].map((slot) => {
    return {
      ...slot,
      disabled:
        storedData.timeSlots && storedData.timeSlots.includes(slot.value),
    };
  });

  const handleClose = () => {
    dispatch(clearForm());
    setShow(false);
    setFormDateValue("");
    setFormErrors({});
  };

  useLayoutEffect(() => {
    // Retrieve the stored data from local storage
    const storedDataString = localStorage.getItem(
      `${formData.recruiter}-${formData.date}`
    );
    
    if (storedDataString) {
      console.log("Storedstring1",storedDataString);
      setStoredData(JSON.parse(storedDataString));
    } else {
      setStoredData({});
    }
  }, [formData.recruiter, formData.date]);

  useEffect(() => {
    console.log("Stored date :", storedData.date);

    if (storedData.date === formData.date) {
    } else {
      setDisabledRecruiters([]);
    }
  }, [storedData.date, formData.date]);

  // Function to check if a date is a Friday
  const isFriday = (dateString) => {
    const date = new Date(dateString);
    return date.getDay() === 5; // 5 corresponds to Friday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "date") {
      const newValue = event.target.value;
      
      if (!isFriday(newValue)) {
        console.log("New value friday",newValue);
        dispatch(setFormField({ field: name, value }));
        setFormDateValue(newValue);
      }
      
     
    }

    dispatch(setFormField({ field: name, value }));
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  useEffect(() => {

    setCalViewDate(localStorage.getItem("calselectedDate"));
    // Calculate the number of disabled time slots
    const disabledTimeSlotsCount = timeSlots.filter(
      (slot) => slot.disabled
    ).length;
    const countLen = localStorage.getItem(`disabledRecruiters-${calViewDate}`);

    const parsedCount = countLen ? JSON.parse(countLen) : [];
    const totalLen = parsedCount.length;
    // console.log("Disabled Array count : ", parsedCount.length);
    setCountOfDisableRecruiters(parsedCount.length);
    //  console.log("Disabled time :",disabledTimeSlotsCount);
    //  console.log("cur recruiter",currentRecruiter);
    // Update the list of disabled recruiters based on the date and time slots count

    if (disabledTimeSlotsCount >= 5) {
      // console.log("Stored recruiter", storedData.recruiter);
      const existingData = localStorage.getItem(
        `disabledRecruiters-${selectedDate1}`
      );
      const parsedData = existingData ? JSON.parse(existingData) : [];
      const uniqueData = [...new Set([...parsedData, storedData.recruiter])];
      localStorage.setItem(
        `disabledRecruiters-${selectedDate1}`,
        JSON.stringify(uniqueData)
      );
      setDisabledRecruiters(existingData);
    }

    //Find the pattern from localstorage:
    var keyPattern = /^disabledRecruiters-(\d{4}-\d{2}-\d{2})$/;
    var dateFormats = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);

      // Check if the key matches the desired format using the regex pattern
      var match = key.match(keyPattern);

      if (match) {
        // Extract and store the matched date format
        // console.log(match);
        var dateFormat = match[1];
        dateFormats.push(dateFormat);
        // console.log("Matching Key:", key, "Date Format:", dateFormat);
      }
    }
    if (dateFormats) {
      // Convert date strings to Date objects
      var dateObjects = dateFormats.map(function (dateString) {
        return new Date(dateString);
      });

      // Find the maximum date using Math.max.apply
      var maxDate = new Date(Math.max.apply(null, dateObjects));

      // Format the maxDate as a string (if needed)
      var maxDateAsString = maxDate.toISOString().slice(0, 10); // 'yyyy-mm-dd'
      //convert this into date object :

      const disabledToday = new Date(maxDateAsString);

      // if (!isNaN(disabledToday.getTime()) && totalLen >= 5) {
      //   // Increment the date by one day
      //   disabledToday.setDate(disabledToday.getDate() + 1);
      //   // console.log("Next 1 : ", disabledToday);
      //   const changedDateformates = disabledToday.toISOString().split("T")[0];
      //   // console.log("Next 2 :".changedDateformates);
      //   setDisabledDate(changedDateformates);
      // } else {
      //   console.log("maxDateAsString is not a valid date string");
      // }
    }
  });

  const isValidEmail = (email) => {
    // A simple regular expression for email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleSubmit = () => {
    // Validation logic
    const newFormErrors = {};

    if (formData.name.trim() === "") {
      newFormErrors.name = "Name is required *";
    }

    if (!isValidEmail(formData.email)) {
      newFormErrors.email = "Invalid email address *";
    }

    if (formData.subject.trim() === "") {
      newFormErrors.subject = "Subject is required *";
    }

    if (formData.message.trim() === "") {
      newFormErrors.message = "Message is required *";
    }

    if (!formData.date) {
      newFormErrors.date = "Date is required *";
    }

    if (!formData.recruiter) {
      newFormErrors.recruiter = "Recruiter is required *";
    }

    if (!formData.timeSlot) {
      newFormErrors.timeSlot = "Time Slot is required *";
    }

    // Check if there are any validation errors
    if (Object.keys(newFormErrors).length > 0) {
      setFormErrors(newFormErrors);
      return;
    }
    // Create an object to store all the form data
    const newFormData = {
      names: [...(storedData.names || []), formData.name],
      subjects: [...(storedData.subjects || []), formData.subject],
      messages: [...(storedData.messages || []), formData.message],
      date: formData.date,
      recruiter: formData.recruiter,
      timeSlots: storedData.timeSlots || [], // Add the selected time slots
    };

    // Add the newly selected time slot to the storedData object
    if (formData.timeSlot) {
      newFormData.timeSlots.push(formData.timeSlot);
    }

    // Store the updated object in local storage
    localStorage.setItem(
      `${formData.recruiter}-${formData.date}`,
      JSON.stringify(newFormData)
    );

    // You can add your form submission logic here
    console.log(newFormData);
    handleClose();
    window.location.reload();
  };

  // const d = localStorage.getItem("disabledRecruiters");
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="primary"
          className="mt-3"
          onClick={() => setShow(true)}
        >
          Book slots
        </Button>
      </div>

      {countOfDisableRecruiters >= 5 ? (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>No schedule</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Today no meeting !</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modal Form</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-control ${
                      formErrors.name ? "is-invalid" : ""
                    }`}
                  />
                  <span className="text-danger error">{formErrors.name}</span>
                </Form.Group>

                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-control ${
                      formErrors.email ? "is-invalid" : ""
                    }`}
                  />
                  <span className="text-danger error">{formErrors.email}</span>
                </Form.Group>

                <Form.Group controlId="subject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`form-control ${
                      formErrors.subject ? "is-invalid" : ""
                    }`}
                  />
                  <span className="text-danger error">
                    {formErrors.subject}
                  </span>
                </Form.Group>

                <Form.Group controlId="message">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`form-control ${
                      formErrors.message ? "is-invalid" : ""
                    }`}
                  />
                  <span className="text-danger error">
                    {formErrors.message}
                  </span>
                </Form.Group>
                <Form.Group controlId="date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formDateValue}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      handleInputChange(e);
                    }}
                    className={`form-control ${
                      formErrors.date ? "is-invalid" : ""
                    }`}
                    min={disabledDate || minDate}
                  />
                  <span className="text-danger error">{formErrors.date}</span>
                </Form.Group>
                {/* <div>
                  <label htmlFor="date">Date:</label>
                  <DatePicker
                    name="date"
                    selected={formData.date}
                    onChange={handleDatePicker}
                    filterDate={filterDate}
                  />
                </div> */}
                <Form.Group controlId="recruiter">
                  <Form.Label>Recruiter</Form.Label>
                  <Form.Control
                    as="select"
                    name="recruiter"
                    value={formData.recruiter}
                    onChange={(e) => {
                      setCurrentRecruiter(e.target.value);
                      handleInputChange(e);
                    }}
                    className={`form-control ${
                      formErrors.recruiter ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Select the recruiter</option>
                    <option
                      value="recruiter1"
                      disabled={
                        disabledRecruiters &&
                        disabledRecruiters.includes("recruiter1")
                      }
                    >
                      Recruiter 1
                    </option>
                    <option
                      value="recruiter2"
                      disabled={
                        disabledRecruiters &&
                        disabledRecruiters.includes("recruiter2")
                      }
                    >
                      Recruiter 2
                    </option>
                    <option
                      value="recruiter3"
                      disabled={
                        disabledRecruiters &&
                        disabledRecruiters.includes("recruiter3")
                      }
                    >
                      Recruiter 3
                    </option>
                    <option
                      value="recruiter4"
                      disabled={
                        disabledRecruiters &&
                        disabledRecruiters.includes("recruiter4")
                      }
                    >
                      Recruiter 4
                    </option>
                    <option
                      value="recruiter5"
                      disabled={
                        disabledRecruiters &&
                        disabledRecruiters.includes("recruiter5")
                      }
                    >
                      Recruiter 5
                    </option>
                  </Form.Control>
                  <span className="text-danger error">
                    {formErrors.recruiter}
                  </span>
                </Form.Group>

                <Form.Group controlId="timeSlot">
                  <Form.Label>Time Slot</Form.Label>
                  <Form.Control
                    as="select"
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className={`form-control ${
                      formErrors.timeSlot ? "is-invalid" : ""
                    }`}
                  >
                    {timeSlots.map((slot) => (
                      <option
                        key={slot.value}
                        value={slot.value}
                        disabled={slot.disabled}
                      >
                        {slot.label}
                      </option>
                    ))}
                  </Form.Control>
                  <span className="text-danger error">
                    {formErrors.timeSlot}
                  </span>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

export default ModalForm;
