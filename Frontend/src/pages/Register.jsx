import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { HashLoader } from 'react-spinners';

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const { user, setUser } = useContext(userDataContext)
  const [avatar, setAvatar] = useState()
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    console.log("user :", user)
  }, [user])


  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);

    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_API_URI}/users/register`, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data", } });
      const data = response.data;

      if (data.success === true) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        navigate(`/`)
      }

      setName("");
      setEmail("");
      setPassword("");
      setLoading(false);
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Loader Overlay */}
      <div
        className={`${loading ? "fixed" : "hidden"} inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity`}
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

          {/* Registration Form */}
          <div className="w-full bg-white rounded-2xl shadow-xl border border-indigo-100 px-6 py-10 sm:px-8 sm:py-12">
            <form className="flex flex-col gap-6">
              <div className="text-center pt-6">
                <h3 className="font-bold text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Create Your Account
                </h3>
                <p className="text-indigo-700 mt-2">Join us to start your messaging journey</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-indigo-900 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    className="w-full rounded-xl border border-indigo-200 focus:border-indigo-400 outline-none py-3 px-4 text-indigo-900 placeholder-indigo-300 transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

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
                    placeholder="Create a password..."
                    className="w-full rounded-xl border border-indigo-200 focus:border-indigo-400 outline-none py-3 px-4 text-indigo-900 placeholder-indigo-300 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-indigo-900 font-medium mb-2">Profile Picture</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full rounded-xl border border-indigo-200 focus:border-indigo-400 outline-none py-3 px-4 text-indigo-900 placeholder-indigo-300 transition-all file:hidden"
                      onChange={(e) => setAvatar(e.target.files[0])}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 font-semibold text-xl rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 mt-4"
              >
                Register
              </button>

              <div className="text-center pt-4">
                <p className="text-indigo-700">
                  Already have an account?
                  <Link
                    to={"/login"}
                    className="ml-1 font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    Login Here
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

export default Register