import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";

function Login() {
	return (
		<main>
			<h1>Login</h1>
			<p>Login is not available yet.</p>
		</main>
	);
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<Navigate to="/signup" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
