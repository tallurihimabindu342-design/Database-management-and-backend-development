import { useState } from "react";
import doctors from "../data/doctors";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
function DoctorsDirectory() {

  const [searchDoctor, setSearchDoctor] =
    useState("");
const navigate = useNavigate();
  const filteredDoctors =
    doctors.filter(
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
    );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
  "linear-gradient(135deg,#020617,#071938,#10214f)",
      }}
    >
      <Sidebar role="Patient" />

      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        <div
  style={{
    marginBottom: "30px",
  }}
>
  <h1
    style={{
      color: "white",
      fontSize: "40px",
      fontWeight: "800",
      marginBottom: "8px",
    }}
  >
    👨‍⚕ Find Doctors
  </h1>

  <p
    style={{
      color: "#94a3b8",
      fontSize: "15px",
    }}
  >
    Search specialists and connect with healthcare professionals.
  </p>
</div>

        <input
          type="text"
          placeholder="Search Doctor or Specialization"
          value={searchDoctor}
          onChange={(e) =>
            setSearchDoctor(
              e.target.value
            )
          }
          style={{
  width: "100%",
  maxWidth: "600px",
  padding: "16px",
  borderRadius: "14px",

  border:
    "1px solid rgba(255,255,255,0.08)",

  background: "#111827",

  color: "white",

  fontSize: "15px",

  marginBottom: "30px",
}}
        />
        <p
  style={{
    color: "#60a5fa",
    marginBottom: "20px",
    fontWeight: "600",
  }}
>
  👨‍⚕ {filteredDoctors.length} doctors available
</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(320px,1fr))",
            gap: "20px",
          }}
        >
          {filteredDoctors.map(
            (doctor) => (
      <div
  key={doctor.doctorId}
  style={{
    background: "#0f172a",
    borderRadius: "20px",
    padding: "30px",
    border:
      "1px solid rgba(255,255,255,0.05)",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.25)",
    cursor: "pointer",
    transition: "0.3s",

    display: "flex",
    flexDirection: "column",
    height: "100%",
  }}
>
  <img
  src={doctor.image}
  alt={doctor.name}
  style={{
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",

    border:
      "3px solid rgba(59,130,246,0.4)",

    marginBottom: "15px",
  }}
/>
                <h2
                  style={{
                  color: "white",
                  marginBottom: "10px",
                 }}
                >
                  {doctor.name}
                </h2>
                <div
  style={{
    display: "inline-block",

    background:
      "rgba(34,197,94,0.15)",

    color: "#22c55e",

    padding: "5px 12px",

    borderRadius: "999px",

    fontSize: "12px",

    fontWeight: "600",

    marginBottom: "15px",
  }}
>
  ● Available Today
</div>
<div
  style={{
    display: "inline-block",
    background:
      "rgba(59,130,246,0.15)",
    color: "#60a5fa",
    padding: "5px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    marginBottom: "12px",
  }}
>
  📹 {doctor.consultationMode}
</div>

  <p
  style={{
    color: "#60a5fa",
    fontWeight: "600",
    marginBottom: "12px",
  }}
>
  {doctor.specialization}
</p>

<p
  style={{
    color: "#cbd5e1",
    marginBottom: "8px",
  }}
>
  🎓 {doctor.qualification}
</p>

<p
  style={{
    color: "#cbd5e1",
    marginBottom: "8px",
  }}
>
  🏆 {doctor.experience} Years Experience
</p>

<p
  style={{
    color: "#22c55e",
    marginBottom: "8px",
  }}
>
  ⭐ {doctor.rating}
</p>

<p
  style={{
    color: "#cbd5e1",
  }}
>
  🏥 {doctor.hospital}
</p>

<p
  style={{
    color: "#94a3b8",
    lineHeight: "1.6",
    flexGrow: 1,
  }}
>
  {doctor.bio}
</p>

<div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  }}
>
  <button
    onClick={() =>
      navigate(
        `/doctor-profile/${doctor.doctorId}`
      )
    }
    style={{
      padding: "12px 18px",
      background:
        "linear-gradient(90deg,#2563eb,#7c3aed)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    View Profile
  </button>

  <button
    onClick={() =>
      navigate(
        "/book-appointment",
        {
          state: {
            doctor,
          },
        }
      )
    }
    style={{
      padding: "12px 18px",
      background:
        "linear-gradient(90deg,#10b981,#22c55e)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    Book Now
  </button>
</div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorsDirectory;