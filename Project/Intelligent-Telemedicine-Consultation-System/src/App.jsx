import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";

import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import DoctorRegister from "./pages/DoctorRegister";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import AdminDoctorRequests from "./pages/AdminDoctorRequests";
import DoctorAvailability from "./pages/DoctorAvailability";
import DoctorsDirectory from "./pages/DoctorsDirectory";
import DoctorProfile from "./pages/DoctorProfile";
import Prescription from "./pages/Prescription";
import SymptomChecker from "./pages/SymptomChecker";
import UploadReport from "./pages/UploadReport";
import EmergencyAssessment from "./pages/EmergencyAssessment";
import PatientReports from "./pages/PatientReports";
import ConsultationRoom from "./pages/ConsultationRoom";
import ConsultationSummary from "./pages/ConsultationSummary";
import PatientHistory from "./pages/PatientHistory";
import MyPrescriptions from "./pages/MyPrescriptions";
import ConsultationHistory from "./pages/ConsultationHistory";
import Notifications from "./pages/Notifications";
import WaitingRoom from "./pages/WaitingRoom";
import Referral from "./pages/Referral";
import PatientReferrals from "./pages/PatientReferrals";
import AddReview from "./pages/AddReview";
import HealthDashboard from "./pages/HealthDashboard";
import MedicationTracker from "./pages/MedicationTracker";
import AppointmentRescheduler from "./pages/AppointmentRescheduler";
import PatientConcernReporter from "./pages/PatientConcernReporter";
import DoctorConcernCenter from "./pages/DoctorConcernCenter";
import MyConcerns from "./pages/MyConcerns";
import VitalsTracker from "./pages/VitalsTracker";
import PopulationInsights from "./pages/PopulationInsights";
import CommunityHealthAlerts from "./pages/CommunityHealthAlerts";
import PatientConsultationRoom from "./pages/PatientConsultationRoom";
import SymptomHistory from "./pages/SymptomHistory";

function App() {
  // Read patientId here so LanguageProvider can load + save language preference
  const patientId = localStorage.getItem("patientId") || localStorage.getItem("patientName");

  return (
    <LanguageProvider patientId={patientId}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/doctor-register" element={<DoctorRegister />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/doctor-requests" element={<AdminDoctorRequests />} />
          <Route path="/doctor-availability" element={<DoctorAvailability />} />
          <Route path="/doctors" element={<DoctorsDirectory />} />
          <Route path="/doctor-profile/:doctorId" element={<DoctorProfile />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/upload-report" element={<UploadReport />} />
          <Route path="/emergency" element={<EmergencyAssessment />} />
          <Route path="/patient-reports" element={<PatientReports />} />
          <Route path="/consultation-room" element={<ConsultationRoom />} />
          <Route path="/consultation-summary" element={<ConsultationSummary />} />
          <Route path="/patient-history" element={<PatientHistory />} />
          <Route path="/my-prescriptions" element={<MyPrescriptions />} />
          <Route path="/consultation-history" element={<ConsultationHistory />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/waiting-room" element={<WaitingRoom />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/patient-referrals" element={<PatientReferrals />} />
          <Route path="/add-review" element={<AddReview />} />
          <Route path="/health-dashboard" element={<HealthDashboard />} />
          <Route path="/medication-tracker" element={<MedicationTracker />} />
          <Route path="/reschedule" element={<AppointmentRescheduler />} />
          <Route path="/report-concern" element={<PatientConcernReporter />} />
          <Route path="/patient-concerns" element={<DoctorConcernCenter />} />
          <Route path="/my-concerns" element={<MyConcerns />} />
          <Route path="/vitals-tracker" element={<VitalsTracker />} />
          <Route path="/population-insights" element={<PopulationInsights />} />
          <Route path="/community-health" element={<CommunityHealthAlerts />} />
          <Route path="/symptom-history" element={<SymptomHistory />} />
          <Route path="/patient-consultation-room" element={<PatientConsultationRoom />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;