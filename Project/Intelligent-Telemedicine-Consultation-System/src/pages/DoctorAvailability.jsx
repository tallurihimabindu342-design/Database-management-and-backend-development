import { useState } from "react";
import Sidebar from "../components/Sidebar";

function DoctorAvailability() {

  const doctorId =
    localStorage.getItem("doctorId");

  const [date, setDate] =
    useState("");
    const [time, setTime] =
  useState("");
const availability =
  JSON.parse(
    localStorage.getItem(
      "doctorAvailability"
    )
  ) || [];

const myAvailability =
  availability.filter(
    (item) =>
      item.doctorId === doctorId
  );
  const saveAvailability = () => {

    if (!date || !time) {
  alert(
    "Select date and time."
  );
  return;
}
    const availability =
      JSON.parse(
        localStorage.getItem(
          "doctorAvailability"
        )
      ) || [];
const alreadyExists =
  availability.find(
    (item) =>
      item.doctorId ===
        doctorId &&
      item.date === date &&
      item.time === time
  );

if (alreadyExists) {
  alert(
    "Date already added."
  );
  return;
}
    availability.push({
      doctorId,
      date,
      time,
    });

    localStorage.setItem(
      "doctorAvailability",
      JSON.stringify(
        availability
      )
    );

    alert(
      "Availability Added Successfully"
    );

    setDate("");
    setTime("");
  };
const removeDate = (
  selectedDate,
  selectedTime

) => {

  const updated =
    availability.filter(
      (item) =>
        !(
          item.doctorId ===
            doctorId &&
          item.date ===
            selectedDate &&
item.time ===
  selectedTime
        )
    );

  localStorage.setItem(
    "doctorAvailability",
    JSON.stringify(updated)
  );

  window.location.reload();
};
  return (
  <div
    style={{
      display: "flex",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg,#020617,#071938,#10214f)",
    }}
  >
    <Sidebar role="Doctor" />

    <div
      style={{
        flex: 1,
        padding: "30px",
      }}
    >

      <div
  style={{
    marginBottom: "40px",
  }}
>
  <h1
    style={{
      color: "white",
      fontSize: "46px",
      fontWeight: "800",
      marginBottom: "10px",
    }}
  >
    🩺 Manage Availability
  </h1>

  <p
    style={{
      color: "#94a3b8",
      fontSize: "17px",
    }}
  >
    Set consultation schedules and available time slots.
  </p>
</div>

      <input
  type="date"
  value={date}
  onChange={(e) =>
    setDate(e.target.value)
  }
  style={{
    width: "250px",
    padding: "14px",
    borderRadius: "12px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background: "#111827",
    color: "white",
    marginRight: "15px",
  }}
/>

      <br />
      <br />
<input
  type="time"
  value={time}
  onChange={(e) =>
    setTime(e.target.value)
  }
  style={{
    width: "180px",
    padding: "14px",
    borderRadius: "12px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background: "#111827",
    color: "white",
    marginRight: "15px",
  }}
/>
      <button
  onClick={saveAvailability}
  style={{
    padding: "14px 24px",
    background:
      "linear-gradient(90deg,#2563eb,#7c3aed)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  }}
>
  ➕ Add Slot
</button>

<h2
  style={{
    color: "white",
    marginBottom: "25px",
  }}
>
  📅 Available Slots
</h2>

{
  myAvailability.length === 0 ? (
    <p>
      No available dates added.
    </p>
  ) : (
    myAvailability.map(
  (item, index) => (
    <div
      key={index}
      style={{
        background: "#0f172a",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "15px",
        border:
          "1px solid rgba(255,255,255,0.05)",

        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <p
          style={{
            color: "white",
            marginBottom: "5px",
          }}
        >
          📅 {item.date}
        </p>

        <p
          style={{
            color: "#60a5fa",
          }}
        >
          🕒 {item.time}
        </p>
      </div>

      <button
        onClick={() =>
          removeDate(
            item.date,
            item.time
          )
        }
        style={{
          padding: "10px 16px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Remove
      </button>
    </div>
  )
)
  )
}
    </div>
    </div>
  );
}

export default DoctorAvailability;