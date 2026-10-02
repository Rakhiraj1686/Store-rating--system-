import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import StoreOwnerDashboard from "./components/StoreOwnerDashboard.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import { dashboardPaths, getUser } from "./services/authService";

// This only decides which page to show. The backend still checks the role on every API call.
function ProtectedRoute({ role, children }) {
	const user = getUser();
	if (!user || !localStorage.getItem("token")) {
		return <Navigate to="/login" replace />;
	}
	if (user.role !== role) {
		return <Navigate to={dashboardPaths[user.role] || "/login"} replace />;
	}
	return children;
}

function PublicRoute({ children }) {
	const user = getUser();
	if (user && localStorage.getItem("token")) {
		return <Navigate to={dashboardPaths[user.role] || "/login"} replace />;
	}
	return children;
}

function App() {
	const user = getUser();

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to={user && localStorage.getItem("token") ? dashboardPaths[user.role] || "/login" : "/login"} replace />} />
				<Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
				<Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
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
							<StoreOwnerDashboard />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to={user && localStorage.getItem("token") ? dashboardPaths[user.role] || "/login" : "/login"} replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
