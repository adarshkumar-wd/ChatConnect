import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { HashLoader } from "react-spinners"

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user , setUser] = useState();
    const [loding, setLoding] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            email: email,
            password: password
        }

        try {
            setLoding(true)
            const response = await axios.post(`${import.meta.env.VITE_API_URI}/users/login`, userData, { withCredentials: true });

            const data = response.data;
            if (data.success === true) {
                console.log("hii")
                setUser(data.user);
                console.log("hii2")
                // console.log(data.user)
                localStorage.setItem("user", JSON.stringify(data.user))
                navigate(`/`);
            }

            setEmail("");
            setPassword("");
            setLoding(false);
        } catch (error) {

        }

    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            {/* Loader Overlay */}
            <div
                className={`${loding ? "fixed" : "hidden"} inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity`}
            >
                <div className="bg-white p-8 rounded-xl shadow-2xl">
                    <HashLoader color="#6366f1" size={60} /> {/* Indigo color */}
                </div>
            </div>

            <main className="flex-1 flex items-center justify-center py-8 px-4">
                <div className="relative w-full max-w-md">
                    {/* Logo */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full shadow-xl border-4 border-white overflow-hidden">
                        <img
                            className="w-full h-full object-cover"
                            src="src/assets/chat_app.jpg"
                            alt="Chat App Logo"
                        />
                    </div>

                    {/* Login Form */}
                    <div className="w-full bg-white rounded-2xl shadow-xl border border-indigo-100 px-6 py-10 sm:px-8 sm:py-12">
                        <form className="flex flex-col gap-6">
                            <div className="text-center pt-6">
                                <h3 className="font-bold text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Welcome Back!
                                </h3>
                                <p className="text-indigo-700 mt-2">Sign in to continue your conversations</p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-indigo-900 font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email..."
                                        className="w-full rounded-xl border border-indigo-200 focus:border-indigo-400 outline-none py-3 px-4 text-indigo-900 placeholder-indigo-300 transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-indigo-900 font-medium mb-2">Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password..."
                                        className="w-full rounded-xl border border-indigo-200 focus:border-indigo-400 outline-none py-3 px-4 text-indigo-900 placeholder-indigo-300 transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 font-semibold text-xl rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 mt-4"
                            >
                                Login
                            </button>

                            <div className="text-center pt-4">
                                <p className="text-indigo-700">
                                    Don't have an account?
                                    <Link
                                        to={"/register"}
                                        className="ml-1 font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                                    >
                                        Register Here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )

}

export default Login