import { useState } from "react";
import doctors from "../data/doctors";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PersonalHealthAssistant from "./PersonalHealthAssistant";

function PatientDashboard() {
  const patientName =
    localStorage.getItem("patientName") ||
    "Patient";
    const [collapsed, setCollapsed] =
  useState(false);
const [searchDoctor, setSearchDoctor] =
  useState("");
  const [selectedDoctor, setSelectedDoctor] =
    useState("");

  const [appointmentDate, setAppointmentDate] =
    useState("");
    const [appointmentTime, setAppointmentTime] =
  useState("");
    const availability =
  JSON.parse(
    localStorage.getItem(
      "doctorAvailability"
    )
  ) || [];
    const navigate = useNavigate();
    const appointments =
  JSON.parse(
    localStorage.getItem(
      "appointments"
    )
  ) || [];

const myAppointments =
  appointments.filter(
    (appointment) =>
      appointment.patientName ===
      patientName
  );

const confirmedAppointments =
  myAppointments.filter(
    (appointment) =>
      appointment.status ===
      "Confirmed"
  );

const prescriptions =
  JSON.parse(
    localStorage.getItem(
      "prescriptions"
    )
  ) || [];
const nextAppointment =
  myAppointments
    .filter(
      (appointment) =>
        appointment.status !==
        "Cancelled"
    )
    .sort((a, b) => {

      const dateA = new Date(
        `${a.date} ${a.time}`
      );

      const dateB = new Date(
        `${b.date} ${b.time}`
      );

      return dateA - dateB;
    })[0];
  const handleBookAppointment = () => {
    if (
      !selectedDoctor ||
      !appointmentDate ||
  !appointmentTime

    ) {
      alert(
        "Please select doctor, date and time."
      );
      return;
    }

    const appointments =
      JSON.parse(
        localStorage.getItem("appointments")
      ) || [];

    const doctorDetails =
  doctors.find(
    (doctor) =>
      doctor.doctorId === selectedDoctor
  );

if (!doctorDetails) {
  alert(
    "Selected doctor not found."
  );
  return;
}
      

const doctorAvailable =
  availability.find(
    (item) =>
      item.doctorId ===
        selectedDoctor &&
      item.date ===
        appointmentDate &&
      item.time ===
        appointmentTime

  );

if (!doctorAvailable) {
  alert(
    "Doctor is unavailable on this date."
  );
  return;
}
const alreadyBooked =
  appointments.find(
    (appointment) =>
      appointment.patientName === patientName &&
      appointment.doctorId === doctorDetails.doctorId &&
      appointment.date === appointmentDate &&
appointment.time === appointmentTime
  );

if (alreadyBooked) {
  alert(
    "You already have an appointment with this doctor on this date."
  );
  return;
}
    appointments.push({
  appointmentId:
    "APT" + Date.now(),

  patientName,

  doctorId:
    doctorDetails.doctorId,

  doctorName:
    doctorDetails.name,

    urgencyScore:
  Number(
    localStorage.getItem(
      "urgencyScore"
    )
  ) || 0,

  specialization:
    doctorDetails.specialization,

  date:
    appointmentDate,

  time:
    appointmentTime,

  status:
    "Pending",

  bookedAt:
    new Date().toLocaleString(),
});
    localStorage.setItem(
      "appointments",
      JSON.stringify(appointments)
    );
setSelectedDoctor("");
setAppointmentDate("");
setAppointmentTime("");
    alert(
      "Appointment booked successfully."
    );
  };

  return (
  <div
    style={{
      display: "flex",
    }}
  >
    <Sidebar
  role="Patient"
  collapsed={collapsed}
  setCollapsed={setCollapsed}
/>

    <div
  style={{
    padding: "30px",
    flex: 1,
    background:
  "radial-gradient(circle at top left,#13264d,#020617 70%)",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
  }}
>
     <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "30px",
  }}
>
  <div
    style={{
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      background:
        "linear-gradient(135deg,#2563eb,#7c3aed)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "30px",
      color: "white",
      fontWeight: "700",
      boxShadow:
        "0 10px 25px rgba(37,99,235,0.25)",
    }}
  >
    {patientName.charAt(0).toUpperCase()}
  </div>

  <div>
    <h1
      style={{
        fontSize: "48px",
        fontWeight: "800",
        color: "#ffffff",
        marginBottom: "8px",
      }}
    >
      Welcome back, {patientName} 👋
    </h1>

    <p
      style={{
        fontSize: "18px",
        color: "#cbd5e1",
        margin: 0,
      }}
    >
      Manage appointments, prescriptions, reports and healthcare services from one place.
    </p>
  </div>
</div>

      <h2
  style={{
    marginTop: "20px",
    color: "#2563eb",
    fontSize: "22px",
    color: "#cbd5e1",
    maxWidth: "800px",
    lineHeight: "1.6",
  }}
>
  Upcoming Appointment
</h2>

{nextAppointment ? (

  <div
    style={{
  background: "rgba(15,23,42,0.75)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.05)",
  padding: "24px",
  borderRadius: "18px",
  marginBottom: "25px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
}}
  >
    <h3
  style={{
    color: "white",
    marginBottom: "15px",
  }}
>
  👨‍⚕️ {nextAppointment.doctorName}
</h3>

    <p
  style={{
    color: "#cbd5e1",
    marginBottom: "8px",
  }}
></p>

    <p
  style={{
    fontSize: "18px",
    fontWeight: "600",
    color: "white",
  }}
>
  ⏰ Next Visit
</p>

<p
  style={{
    color: "#cbd5e1",
    fontSize: "16px",
  }}
>
  {nextAppointment.date}
  {" • "}
  {nextAppointment.time}
</p>

<p
  style={{
    color: "#4ade80",
    fontWeight: "600",
  }}
>
  ✅ {nextAppointment.status}
</p>

    <p>
      🚨 Urgency:
      {" "}
      {
        nextAppointment.urgencyScore
      }
    </p>
  </div>

) : (

  <div
  style={{
    background: "#081327",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "25px",
    color: "#cbd5e1",
  }}
>
  📅 No upcoming appointments scheduled.
</div>

)}

<PersonalHealthAssistant />

<div
  style={{
    display: "flex",
    gap: "25px",
    alignItems: "flex-start",
    marginTop: "15px",
  }}
>
  <div
  style={{
    flex: 1.8,
    minWidth: "700px",
  }}
>

    <div
  style={{
    background: "rgba(15,23,42,0.85)",
    backdropFilter: "blur(12px)",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.05)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
    minHeight: "520px",
  }}
>

  <h2
    style={{
      color: "white",
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "700",
    }}
  >
    📊 Patient Overview
  </h2>

<div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "35px",
    justifyContent: "flex-start",
  }}
>
  <div
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-6px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0px)";
  }}
  style={{
    background:
      "linear-gradient(145deg,#1e3a8a,#1e40af)",
    border:
      "1px solid rgba(96,165,250,0.2)",
    boxShadow:
      "0 10px 30px rgba(37,99,235,0.15)",
    padding: "25px",
    borderRadius: "20px",
    width: "250px",
    transition: "0.3s",
    height: "140px",
  }}
>
    <h3
  style={{
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    opacity: "0.95",
  }}
>
  📅 Total Appointments
</h3>

    <h2
  style={{
    marginTop: "15px",
    marginBottom: 0,
    fontSize: "48px",
    fontWeight: "700",
    color: "white",
  }}
>
  {myAppointments.length}
</h2>
  </div>

  <div
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-6px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0px)";
  }}
    style={{
  background: "linear-gradient(135deg, #16a34a, #4ade80)",
  padding: "25px",
  borderRadius: "20px",
  width: "250px",
  boxShadow: "0 12px 30px rgba(22,163,74,0.25)",
  transition: "0.3s",
  height: "140px",
}}
  >
    <h3
  style={{
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    opacity: "0.95",
  }}
>
  🕒 Confirmed
</h3>

    <h2
  style={{
    marginTop: "15px",
    marginBottom: 0,
    fontSize: "48px",
    fontWeight: "700",
    color: "white",
  }}
>
  {confirmedAppointments.length}
</h2>
  </div>

  <div
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-6px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0px)";
  }}
    style={{
  background:
    "linear-gradient(145deg,#4c1d95,#6d28d9)",
  border:
    "1px solid rgba(168,85,247,0.2)",
  boxShadow:
    "0 10px 30px rgba(168,85,247,0.15)",
  padding: "25px",
  borderRadius: "20px",
  width: "250px",
  transition: "0.3s",
  height: "140px",
}}
  >
    <h3
  style={{
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    opacity: "0.95",
  }}
>
  💊 Prescriptions
</h3>

    <h2
  style={{
    marginTop: "15px",
    marginBottom: 0,
    fontSize: "48px",
    fontWeight: "700",
    color: "white",
  }}
>
  {prescriptions.length}
</h2>
  </div>
</div>

<div style={{ marginTop: "10px" }}>

  <h3
    style={{
      color: "white",
      fontSize: "22px",
      marginBottom: "20px",
      fontWeight: "700",
    }}
  >
    Quick Actions
  </h3>

  <div
    style={{
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    }}
  >
  <button
  onClick={() => navigate("/doctors")}
  style={{
    width: "190px",
    height: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    background: "#16213e",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "18px",
    color: "white",
    cursor: "pointer",
  }}
>
  <div style={{ fontSize: "26px" }}>
    🔍
  </div>

  <div
    style={{
      color: "white",
      fontWeight: "600",
      fontSize: "15px",
    }}
  >
    Find Doctors
  </div>
</button>

 <button
  onClick={() => navigate("/symptom-checker")}
  style={{
    width: "190px",
    height: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    background: "#16213e",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "18px",
    color: "white",
    cursor: "pointer",
  }}
>
  <div style={{ fontSize: "26px" }}>
    🩺
  </div>

  <div
    style={{
      color: "white",
      fontWeight: "600",
      fontSize: "15px",
    }}
  >
    Symptom Checker
  </div>
</button>

 <button
  onClick={() => navigate("/upload-report")}
  style={{
    width: "190px",
    height: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    background: "#16213e",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "18px",
    color: "white",
    cursor: "pointer",
  }}
>
  <div style={{ fontSize: "26px" }}>
    📄
  </div>

  <div
    style={{
      color: "white",
      fontWeight: "600",
      fontSize: "15px",
    }}
  >
    Upload Report
  </div>
</button>

  <button
    onClick={() => {

      const alerts =
        JSON.parse(
          localStorage.getItem(
            "emergencyAlerts"
          )
        ) || [];

      alerts.push({

        patientName:
          localStorage.getItem(
            "patientName"
          ),

        createdAt:
          new Date().toLocaleString(),

        status:
          "Active",

      });

      localStorage.setItem(
        "emergencyAlerts",
        JSON.stringify(
          alerts
        )
      );

      alert(
        "Emergency Alert Sent"
      );

    }}
    
  style={{
  width: "190px",
  height: "120px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  gap: "10px",

 background: "#ef4444",
  border: "1px solid rgba(255,255,255,0.05)",

  borderRadius: "18px",

  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",

  color: "white",
  cursor: "pointer",

  fontSize: "15px",
  fontWeight: "600",

  transition: "0.3s",
}}

  >
   <>
  <div style={{fontSize:"24px"}}>🚨</div>
  <div>Emergency Alert</div>
</>
  </button>

</div>
</div>
</div>
</div>

<div
  style={{
    flex: 1,
    minWidth: "500px",
    display: "flex",
  }}
>

<div
  style={{
  background: "rgba(15,23,42,0.85)",
  backdropFilter: "blur(12px)",
  padding: "35px",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
  width: "100%",
  border: "1px solid rgba(255,255,255,0.05)",
  minHeight: "520px",
}}
>

<h2
  style={{
    color: "white",
    fontSize: "42px",
    fontWeight: "800",
    marginBottom: "30px",
    letterSpacing: "-1px",
  }}
>

  📅 Book Appointment
</h2>
<input
  type="text"
  placeholder="Search Doctor or Specialization"
  value={searchDoctor}
  onChange={(e) =>
    setSearchDoctor(e.target.value)
  }
  style={{
  width: "100%",
  padding: "16px 18px",

  background: "#0f172a",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius: "14px",

  color: "white",

  fontSize: "15px",

  outline: "none",

  marginBottom: "18px",

  boxSizing: "border-box",

  transition: "0.3s",
}}
/>

<br />
<br />
      <select
  value={selectedDoctor}
  style={{
  width: "100%",
  padding: "16px 18px",

  background: "#0f172a",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius: "14px",

  color: "white",

  fontSize: "15px",

  cursor: "pointer",
}}

        onChange={(e) =>
          setSelectedDoctor(
            e.target.value
          )
        }
      >
        <option value="">
          Select Doctor
        </option>

        {doctors
  .filter(
    (doctor) =>
      doctor.name
        .toLowerCase()
        .includes(
          searchDoctor.toLowerCase()
        ) ||
      doctor.specialization
        .toLowerCase()
        .includes(
          searchDoctor.toLowerCase()
        )
  )
  .map((doctor) => (
          <option
            key={doctor.doctorId}
            value={doctor.doctorId}
          >
            {doctor.name} (
            {doctor.specialization})
          </option>
        ))}
      </select>

      <br />
      <br />
<select
  value={appointmentDate}
  style={{
  width: "100%",
  padding: "16px 18px",

  background: "#0f172a",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius: "14px",

  color: "white",

  fontSize: "15px",

  cursor: "pointer",
}}
  onChange={(e) =>
    setAppointmentDate(
      e.target.value
    )
  }
>
  <option value="">
    Select Available Date
  </option>

  {availability
    .filter(
      (item) =>
        item.doctorId ===
        selectedDoctor
    )
    .map((item, index) => (
      <option
        key={index}
        value={item.date}
      >
        {item.date}
      </option>
    ))}
</select>
<br />
<br />

<select
  value={appointmentTime}
  style={{
  width: "100%",
  padding: "16px 18px",

  background: "#0f172a",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius: "14px",

  color: "white",

  fontSize: "15px",

  cursor: "pointer",
}}
  onChange={(e) =>
    setAppointmentTime(
      e.target.value
    )
  }
>
  <option value="">
    Select Time Slot
  </option>

  {availability
  .filter((item) => {

    const slotBooked =
      JSON.parse(
        localStorage.getItem(
          "appointments"
        )
      ) || [];

    const alreadyTaken =
      slotBooked.find(
        (appointment) =>
          appointment.doctorId ===
            selectedDoctor &&
          appointment.date ===
            appointmentDate &&
          appointment.time ===
            item.time &&
          appointment.status !==
            "Cancelled"
      );

    return (
      item.doctorId ===
        selectedDoctor &&
      item.date ===
        appointmentDate &&
      !alreadyTaken
    );
  })
    .map((item, index) => (
      <option
        key={index}
        value={item.time}
      >
        {item.time}
      </option>
    ))}
</select>
      <br />
      <br />

      <button
  onClick={handleBookAppointment}
  style={{
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "white",
  border: "none",
  width:"220px",
  height:"55px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
  boxShadow:
    "0 10px 20px rgba(37,99,235,0.25)",
    fontSize:"16px",
fontWeight:"700",
letterSpacing:"0.3px",
}}
>
  Book Appointment
</button>
<br />
<br />

<button
  onClick={() =>
    navigate("/my-appointments")
  }
  style={{
    background: "#1e293b",
    color: "white",
    border: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  View My Appointments
</button>

</div> {/* End Left Column */}

</div> {/* End Main Flex Row */}
</div>
</div>
</div>
);
}

export default PatientDashboard;