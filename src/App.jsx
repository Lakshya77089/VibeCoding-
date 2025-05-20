import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Google Generative AI SDK
import { 
  Users, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Truck, 
  DollarSign,
  Send,
  Navigation,
  List,
  User,
  Map,
  MessageCircle,
  X
} from 'lucide-react';

// Initialize Gemini AI with your API key
const GEMINI_API_KEY = 'process.env.API_KEY'; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Mock data for both user and tooker
const mockUserOrders = [
  {
    id: 'BMS001',
    status: 'Pending',
    from: 'kota',
    to: 'Ranpur',
    distance: '24 Km',
    weight: '25 kg',
    price: 75.50,
    tookerStatus: 'Waiting for Carrier'
  },
  {
    id: 'BMS002',
    status: 'Active',
    from: 'Udaipur',
    to: 'kota',
    distance: '520 Km',
    weight: '18 kg',
    price: 62.25,
    tookerStatus: 'Carrier Assigned'
  }
];

const mockTookerRequests = [
  {
    id: 'REQ001',
    from: 'Kota',
    to: 'Ranpur',
    distance: '24 Km',
    weight: '25 kg',
    price: 75.50,
    status: 'Available'
  },
  {
    id: 'REQ002',
    from: 'Udaipur',
    to: 'kota',
    distance: '520 Km',
    weight: '18 kg',
    price: 62.25,
    status: 'Available'
  }
];

// User Dashboard Component
const UserDashboard = () => {
  const [orders, setOrders] = useState(mockUserOrders);
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderUserDashboardStats = () => (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-100 p-4 rounded-lg shadow flex items-center">
        <Package className="mr-3 text-blue-600" />
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-800">{orders.length}</p>
        </div>
      </div>
      
      <div className="bg-green-100 p-4 rounded-lg shadow flex items-center">
        <CheckCircle className="mr-3 text-green-600" />
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Completed</h3>
          <p className="text-2xl font-bold text-green-800">
            {orders.filter(order => order.status === 'Completed').length}
          </p>
        </div>
      </div>
      
      <div className="bg-yellow-100 p-4 rounded-lg shadow flex items-center">
        <AlertCircle className="mr-3 text-yellow-600" />
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Pending</h3>
          <p className="text-2xl font-bold text-yellow-800">
            {orders.filter(order => order.status === 'Pending').length}
          </p>
        </div>
      </div>
      
      <div className="bg-purple-100 p-4 rounded-lg shadow flex items-center">
        <MapPin className="mr-3 text-purple-600" />
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Total Distance</h3>
          <p className="text-2xl font-bold text-purple-800">50 Km</p>
        </div>
      </div>
    </div>
  );

  const renderUserOrderTracking = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">My Orders</h2>
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Order ID</th>
            <th className="p-3">From</th>
            <th className="p-3">To</th>
            <th className="p-3">Status</th>
            <th className="p-3">Tooker Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">{order.id}</td>
              <td className="p-3">{order.from}</td>
              <td className="p-3">{order.to}</td>
              <td className="p-3">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-semibold
                  ${order.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}
                `}>
                  {order.status}
                </span>
              </td>
              <td className="p-3">{order.tookerStatus}</td>
              <td className="p-3">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUserNewOrderSection = () => (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Order</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
          <input 
            type="text" 
            placeholder="Enter pickup address" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Destination</label>
          <input 
            type="text" 
            placeholder="Enter destination address" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Luggage Weight</label>
          <input 
            type="number" 
            placeholder="Enter weight in kg" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Delivery Preference</label>
          <select 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option>Standard Delivery</option>
            <option>Express Delivery</option>
          </select>
        </div>
      </div>
      <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
        Create Order
      </button>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <User className="mr-3" /> User Baggage Transfer Dashboard
        </h1>
        
        {renderUserDashboardStats()}
        {renderUserOrderTracking()}
        {renderUserNewOrderSection()}
      </div>
    </div>
  );
};

// Tooker Dashboard Component
const TookerDashboard = () => {
  const [requests, setRequests] = useState(mockTookerRequests);
  const [activeTab, setActiveTab] = useState('available-requests');

  const renderTookerStats = () => (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-100 p-4 rounded-lg shadow flex items-center">
        <List className="mr-3 text-blue-600" />
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Total Requests</h3>
          <p className="text-2xl font-bold text-blue-800">{requests.length}</p>
        </div>
      </div>
      
      <div className="bg-green-100 p-4 rounded-lg shadow flex items-center">
        <CheckCircle className="mr-3 text-green-600" />
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Completed</h3>
          <p className="text-2xl font-bold text-green-800">0</p>
        </div>
      </div>
      
      <div className="bg-yellow-100 p-4 rounded-lg shadow flex items-center">
        <Navigation className="mr-3 text-yellow-600" />
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Active Transfers</h3>
          <p className="text-2xl font-bold text-yellow-800">0</p>
        </div>
      </div>
      
      <div className="bg-purple-100 p-4 rounded-lg shadow flex items-center">
        <DollarSign className="mr-3 text-purple-600" />
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Total Earnings</h3>
          <p className="text-2xl font-bold text-purple-800">$0</p>
        </div>
      </div>
    </div>
  );

  const renderAvailableRequests = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Available Luggage Transfer Requests</h2>
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Request ID</th>
            <th className="p-3">From</th>
            <th className="p-3">To</th>
            <th className="p-3">Distance</th>
            <th className="p-3">Weight</th>
            <th className="p-3">Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">{request.id}</td>
              <td className="p-3">{request.from}</td>
              <td className="p-3">{request.to}</td>
              <td className="p-3">{request.distance}</td>
              <td className="p-3">{request.weight}</td>
              <td className="p-3">${request.price}</td>
              <td className="p-3">
                <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  Accept
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderActiveTransfers = () => (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Active Transfers</h2>
      <p className="text-gray-600">No active transfers at the moment.</p>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <Truck className="mr-3" /> Tooker Baggage Transfer Dashboard
        </h1>
        
        {renderTookerStats()}
        {renderAvailableRequests()}
        {renderActiveTransfers()}
      </div>
    </div>
  );
};

// Main App Component with Gemini API Integration
const BaggageManagementApp = () => {
  const [currentDashboard, setCurrentDashboard] = useState('user');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  // Function to call Gemini API
  const callGeminiAPI = async (message) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use appropriate model name
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'Sorry, I couldn’t process your request. Please try again.';
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Add user's message to chat
    setMessages([...messages, { text: inputMessage, sender: 'user' }]);

    // Call Gemini API for bot response
    const botResponse = await callGeminiAPI(inputMessage);
    setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);

    // Clear input
    setInputMessage('');
  };

  return (
    <div className="relative">
      {/* Dashboard Switch Buttons */}
      <div className="bg-white shadow-md p-4 flex justify-center">
        <button 
          className={`mx-2 px-4 py-2 rounded ${
            currentDashboard === 'user' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => setCurrentDashboard('user')}
        >
          User Dashboard
        </button>
        <button 
          className={`mx-2 px-4 py-2 rounded ${
            currentDashboard === 'tooker' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => setCurrentDashboard('tooker')}
        >
          Tooker Dashboard
        </button>
      </div>
      
      {/* Main Dashboard Content */}
      {currentDashboard === 'user' ? <UserDashboard /> : <TookerDashboard />}

      {/* Chatbot Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50 flex items-center justify-center"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50">
          {/* Chat Header */}
          <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat Support (Powered by Gemini)</h3>
            <button onClick={() => setIsChatOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">Start a conversation!</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-l-md border border-gray-300 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaggageManagementApp;
