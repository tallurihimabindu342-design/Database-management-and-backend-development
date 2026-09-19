import Sidebar from "../components/Sidebar";

function PopulationInsights() {

  const consultations =
    JSON.parse(
      localStorage.getItem(
        "consultationHistory"
      )
    ) || [];

  const concerns =
    JSON.parse(
      localStorage.getItem(
        "patientConcerns"
      )
    ) || [];

  const appointments =
    JSON.parse(
      localStorage.getItem(
        "appointments"
      )
    ) || [];

  const vitals =
    JSON.parse(
      localStorage.getItem(
        "healthVitals"
      )
    ) || [];

  const totalPatients =
    new Set(
      appointments.map(
        (appointment) =>
          appointment.patientName
      )
    ).size;

  const totalConsultations =
    consultations.length;

  const avgConsultationTime =

    consultations.length === 0

      ? 0

      : Math.round(

          consultations.reduce(
            (
              total,
              consultation
            ) =>

              total +
              Number(
                consultation.duration
              ),

            0
          ) /

          consultations.length
        );

  const symptomCounts = {};

  concerns.forEach(
    (concern) => {

      const symptom =
        concern.concernType;

      symptomCounts[
        symptom
      ] =
        (
          symptomCounts[
            symptom
          ] || 0
        ) + 1;

    }
  );

  const commonSymptoms =

    Object.entries(
      symptomCounts
    )

      .sort(
        (
          a,
          b
        ) =>
          b[1] - a[1]
      )

      .slice(
        0,
        5
      );

  const highRiskPatients =
    vitals.filter(
      (vital) =>

        Number(
          vital.sugar
        ) > 140 ||

        Number(
          vital.spo2
        ) < 95
    ).length;

  return (

    <div
      style={{
        display:"flex"
      }}
    >

      <Sidebar role="Administrator" />

      <div
  style={{
    flex: 1,
    padding: "32px",
    background:
      "linear-gradient(135deg,#020617,#071938,#10214f)",
    minHeight: "100vh",
  }}
>

        <h1
  style={{
    color: "white",
    fontSize: "42px",
    fontWeight: "800",
    marginBottom: "10px",
  }}
>
  🌍 Population Health Insights
</h1>

<p
  style={{
    color: "#94a3b8",
    marginBottom: "20px",
  }}
>
  Analyze patient trends, consultation statistics and health risks.
</p>

<div
  style={{
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    marginBottom: "30px",
  }}
/>

        <div
          style={{
            display:"grid",
            gridTemplateColumns:
  "repeat(auto-fit,minmax(220px,1fr))",
            gap:"15px",
            marginBottom:"25px"
          }}
        >

          <div
  style={{
    background:
      "linear-gradient(180deg,#0f172a,#111827)",
    borderRadius: "18px",
    padding: "20px",
    color: "white",
    border:
      "1px solid rgba(255,255,255,0.05)",
  }}
>
  <h3>👥 Patients</h3>
  <h1>{totalPatients}</h1>
</div>

          <div
  style={{
    background:
      "linear-gradient(180deg,#0f172a,#111827)",
    borderRadius: "18px",
    padding: "20px",
    color: "white",
    border:
      "1px solid rgba(255,255,255,0.05)",
  }}
>
  <h3>📋 Consultations</h3>
  <h1>{totalConsultations}</h1>
</div>

          <div
  style={{
    background:
      "linear-gradient(180deg,#0f172a,#111827)",
    borderRadius: "18px",
    padding: "20px",
    color: "white",
    border:
      "1px solid rgba(255,255,255,0.05)",
  }}
>
  <h3>⏱ Avg Duration</h3>
  <h1>{avgConsultationTime} sec</h1>
</div>

          <div
  style={{
    background:
      "linear-gradient(180deg,#0f172a,#111827)",
    borderRadius: "18px",
    padding: "20px",
    color: "white",
    border:
      "1px solid rgba(255,255,255,0.05)",
  }}
>
  <h3>⚠ High Risk</h3>
  <h1>{highRiskPatients}</h1>
</div>

        </div>

        <h2
  style={{
    color: "white",
    marginBottom: "15px",
    marginTop: "20px",
  }}
>
  🩺 Common Symptoms
</h2>

        {
          commonSymptoms.map(
            (
              symptom,
              index
            ) => (

              <div
                key={index}
                style={{
  background:
    "linear-gradient(180deg,#0f172a,#111827)",
  border:
    "1px solid rgba(255,255,255,0.05)",
  borderRadius:"16px",
  padding:"16px",
  marginBottom:"12px",
  color:"white",
}}
              >

                <p>
                  {symptom[0]}
                </p>

                <p>
                  Cases:
                  {" "}
                  {symptom[1]}
                </p>

              </div>

            )
          )
        }

        <h2
  style={{
    color: "white",
    marginBottom: "15px",
    marginTop: "25px",
  }}
>
  ⚠ Population Risk Summary
</h2>

        <div
          style={{
  background:
    "linear-gradient(180deg,#0f172a,#111827)",
  padding:"24px",
  borderRadius:"18px",
  color:"white",
  border:
    "1px solid rgba(255,255,255,0.05)",
}}
        >

          <p>
            High Sugar Cases:
            {" "}
            {
              vitals.filter(
                (vital) =>
                  Number(
                    vital.sugar
                  ) > 140
              ).length
            }
          </p>

          <p>
            Low SpO2 Cases:
            {" "}
            {
              vitals.filter(
                (vital) =>
                  Number(
                    vital.spo2
                  ) < 95
              ).length
            }
          </p>

          <p>
            Obesity Risk Cases:
            {" "}
            {
              vitals.filter(
                (vital) =>
                  Number(
                    vital.weight
                  ) > 80
              ).length
            }
          </p>

        </div>

      </div>

    </div>

  );

}

export default PopulationInsights;