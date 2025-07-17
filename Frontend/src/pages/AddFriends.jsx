import { useState , useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import axios from 'axios';

function AddFriends() {

    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Filter users based on search term

    useEffect(() => {
        setFilteredUsers(prev => prev.filter(user => user?.name.toLowerCase().includes(searchTerm.toLowerCase())))
    }, [users])

    // useEffect(() => {

    //     const fetchUsers = async () => {

    //         try {
    //             const response = await axios.get(`${import.meta.env.VITE_API_URI}/users/get-users/sender/${sender}`, { withCredentials: true });

    //             const data = response.data

    //             console.log("data : " , data)

    //             if (data.success === true) {
    //                 setUsers(data.users)
    //             }
    //         } catch (error) {
    //             console.log("fetchUsers error : ", error)
    //         }

    //     }
    //     fetchUsers();

    // }, [])

    useEffect(() => {
        console.log("users : " , users);
        
    } , [users])

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            {/* NavBar would go here */}
            <div className="h-16 bg-white shadow-sm"></div>

            <main className="flex-1 overflow-y-auto py-6 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Let's Chat With Your Friends..
                        </h1>
                        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                            Connect with your favorite people and start meaningful conversations
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8 max-w-md mx-auto">
                        <div className="relative flex items-center">
                            <FaSearch className="absolute left-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for friends..."
                                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* User Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 justify-items-center">
                        {filteredUsers.map((user) => (
                            <div
                                key={user._id}
                                className="w-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="p-4 flex flex-col items-center">
                                    {/* User Avatar */}
                                    <div className="relative mb-3">
                                        {user.profilePic ? (
                                            <img
                                                src={user.profilePic}
                                                alt={user.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
                                                <span className="text-gray-500 text-xl font-bold">
                                                    {user.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        {/* Add Button */}
                                        <button className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-1.5 rounded-full hover:bg-purple-700 transition-colors">
                                            <FaPlus className="text-xs" />
                                        </button>
                                    </div>

                                    {/* User Name */}
                                    <h3 className="text-gray-800 font-medium text-center truncate w-full">
                                        {user.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">No users found</h3>
                            <p className="text-gray-500 mt-2">
                                Try searching with different terms
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AddFriends;