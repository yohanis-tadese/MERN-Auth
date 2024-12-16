// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useEffect, useState } from "react";
// import NotFound from "./pages/NotFound";
// import Navbar from "./components/Navbar";
// import { ToastContainer } from "react-toastify";
// import About from "./pages/About";

// const App = () => {
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     inactive: 0,
//     maintenance: 0,
//     others: 0,
//   });

//   useEffect(() => {
//     const fetchAllVehicles = async () => {
//       try {
//         const data = await fetchDashboardData();

//         setStats({
//           total: data.total,
//           active: data.active,
//           inactive: data.inactive,
//           maintenance: data.maintenance,
//           others: data.others,
//         });
//       } catch (error) {
//         console.error("Error fetching vehicles:", error);
//       }
//     };

//     fetchAllVehicles();
//   }, []);

//   return (
//     <Router>
//       <div className="flex ">
//         <div className="flex-1 h-full fixed ">
//           <Sidebar />
//         </div>

//         <div className="flex-1 ml-20 sm:ml-52 flex flex-col">
//           <div className="fixed top-0 right-0 left-20 sm:left-52  z-10 shadow-md">
//             <Navbar />
//           </div>

//           <div className="flex-1 p-6 pt-20 overflow-y-auto bg-gray-50">
//             <Routes>
//               <Route path="/" element={<Dashboard stats={stats} />} />
//               <Route path="/add-vechile" element={<AddVehicle />} />
//               <Route path="/vechiles" element={<VehicleList />} />
//               <Route path="/about" element={<About />} />
//               <Route path="/edit-vechile/:id" element={<EditVehicle />} />
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </div>
//         </div>

//         <ToastContainer />
//       </div>
//     </Router>
//   );
// };

// export default App;
