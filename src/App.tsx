// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/authContext';

// import './App.css';
// import './index.css';
// import ProtectedRoute from './Pages/Login/ProtectedRoute';
// import MasterController from './components/main/MasterController';
// import HeaderController from './components/main/HeaderController';
// import FooterController from './components/main/FooterController';
// import Login from './Pages/Login/Login';
// import StudentRegistrationController from './components/studentRegistration/StudentRegistrationController';
// import StudentAttendenceManagement from './components/StudentAttendence/StudentAttendenceManagement';


// const App = () => {
//   return (
//     <>
//       <HeaderController />
//       <div className="mainBody">
//         <SideBarController />
//         <div className="rhsBox">
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/login" element={<Login />} />

//             {/* Protected Routes */}
//             <Route element={<ProtectedRoute />}>
//               <Route path="/main" element={<MasterController />} />
//               <Route path="/StudentAttendenceManagement" element={<StudentAttendenceManagement />} />
//               <Route path="/StudentRegistrationController" element={<StudentRegistrationController />} />
//             </Route>

//             <Route path="*" element={<MasterController />} />
//             {/* Fallback Route */}

            
//           </Routes>
//           <FooterController />
//         </div>
//       </div>
//     </>


//   );
// };


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Router>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </Router>
//   </StrictMode>
// );







