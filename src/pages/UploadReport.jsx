import { useState } from "react";
import Sidebar from "../components/Sidebar";

function UploadReport() {

  const [selectedFile, setSelectedFile] =
    useState(null);

  const saveReport = () => {

  if (!selectedFile) {

    alert(
      "Please select a file."
    );

    return;
  }

  const reader =
    new FileReader();

  reader.onload =
    function () {

      const reports =
        JSON.parse(
          localStorage.getItem(
            "medicalReports"
          )
        ) || [];

      reports.push({

        patientName:
          localStorage.getItem(
            "patientName"
          ),

        reportName:
          selectedFile.name,

        fileType:
          selectedFile.type,

        fileData:
          reader.result,

        uploadedAt:
          new Date()
            .toLocaleString(),
      });

      localStorage.setItem(
        "medicalReports",
        JSON.stringify(
          reports
        )
      );

      alert(
        "Report Uploaded Successfully"
      );

      setSelectedFile(
        null
      );
    };

  reader.readAsDataURL(
    selectedFile
  );
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

    fontSize: "42px",

    fontWeight: "800",

    marginBottom: "16px",

    lineHeight: "1.2",
  }}
>
  📂 Health Records
</h1>

  <p
  style={{
    color: "#94a3b8",

    fontSize: "16px",

    marginTop: "0",

    lineHeight: "1.6",
  }}
>
  Securely upload and manage your medical reports.
</p>

</div>

    <div
  style={{
    background: "#0f172a",

    borderRadius: "24px",

    padding: "30px",

    border:
      "1px solid rgba(255,255,255,0.05)",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.25)",
  }}
>

        <input
  type="file"
  onChange={(e) =>
    setSelectedFile(
      e.target.files[0]
    )
  }
  style={{
    color: "white",

    padding: "12px",

    borderRadius: "12px",

    background: "#111827",

    border:
      "1px solid rgba(255,255,255,0.05)",

    width: "100%",
    maxWidth: "500px",
  }}
/>

        <br />
        <br />

        {selectedFile && (
          <div
  style={{
    marginTop: "20px",

    padding: "15px",

    background: "#111827",

    borderRadius: "12px",

    color: "#60a5fa",
  }}
>
  📄 Selected File:
  {" "}
  {selectedFile.name}
</div>
        )}

        <br />

        <button
  onClick={saveReport}
  style={{
    marginTop: "20px",

    padding: "14px 28px",

    background:
      "linear-gradient(90deg,#2563eb,#7c3aed)",

    color: "white",

    border: "none",

    borderRadius: "14px",

    fontWeight: "700",

    cursor: "pointer",
  }}
>
  ⬆ Upload Report
</button>

      </div>
    </div>
    </div>
  );
}

export default UploadReport;