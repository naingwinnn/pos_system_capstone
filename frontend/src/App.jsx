// // App.jsx
// import React from 'react';
// // import ShopDashboard from './superadmin/shopDashboard';
// import CustomerDashboard from './customer/CustomerDashboard';

// function App() {
//   return (
//     <div className="App">
//       <CustomerDashboard />
//     </div>
//   );
// }

// export default App;
// // import React from 'react';
// // import ShopDashboard from './superadmin/shopDashboard';
// // function App() {
// //   return (
// //     <div className="App">
// //       <ShopDashboard />
// //     </div>
// //   );
// // }

// // export default App;




// 

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerDashboard from './components/customer/CustomerDashboard';
import ShopPage from './components/customer/ShopPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CustomerDashboard />} />
          <Route path="/shop/:id" element={<ShopPage />} />
          <Route path="*" element={
            <div className="not-found">
              <div className="not-found-container">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" className="home-link">Go to Homepage</a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;