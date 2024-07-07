//import từ thư viện bên ngoài
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

//import từ bên trong src
import LoginForm from "./components/public/login/LoginForm"
import Homepage from "./components/staff/homepage/Homepage"
import Category from "./components/QAM/category/Category"
import Profile from "./components/staff/profile/Profile"
import Home from "./components/QAM/home/Home"
import HomeQAC from "./components/QAC/home/HomeQAC"
import ProfileQAC from "./components/QAC/profile/ProfileQAC"
import ProfileQAM from "./components/QAM/profile/ProfileQAM"
import HomeAd from "./components/admin/home/HomeAd"
import TopTrending from "./components/public/toptrending/TopTrending"
import Event from "./components/admin/event/Event"
import ErrorPage from "./components/public/error/ErrorPage"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/category" element={<Category />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/qualityAssuranceManager" element={<Home />} />
        <Route path="/qualityAssuranceCoordinator" element={<HomeQAC />} />
        <Route path="/profileQAC" element={<ProfileQAC />} />
        <Route path="/profileQAM" element={<ProfileQAM />} />
        <Route path="/admin" element={<HomeAd />} />
        <Route path="/topTrending" element={<TopTrending />} />
        <Route path="/setEvent" element={<Event />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  )
}

export default App