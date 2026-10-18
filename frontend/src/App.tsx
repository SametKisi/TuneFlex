import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Pitch from './Pages/Pitch'

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/pitch" element={<Pitch />} />
  </Routes>
)

export default App