import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import UserDashboard from "./components/UserDashboard.jsx";
import { dashboardPaths, getUser } from "./services/authService";

// This only decides which page to show. The backend still checks the role on every API call.
function ProtectedRoute({ role, children }) {
	const user = getUser();
	if (!user || !localStorage.getItem("token")) {
		return <Navigate to="/login" replace />;
	}
	if (user.role !== role) {
		return <Navigate to={dashboardPaths[user.role]} replace />;
	}
	return children;
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route
					path="/admin"
					element={
						<ProtectedRoute role="admin">
							<Dashboard title="Admin Dashboard" />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/user"
					element={
						<ProtectedRoute role="user">
							<UserDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/store-owner"
					element={
						<ProtectedRoute role="store_owner">
							<Dashboard title="Store Owner Dashboard" />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
