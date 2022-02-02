import "./App.css";
import Chat1 from "./page/chat1";
import Chat2 from "./page/chat2";
import OrderUser from  "./page/orderUser";
import OrderDriver from "./page/orderDriver";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

function App() {

  return ( 
    <div className = "App" >
      <Router>
        <Routes>
          <Route exact path='/' element={<Chat1/>}/>          
          <Route exact path='/chat2' element={<Chat2/>}/>
          <Route exact path='/order/for/user' element={<OrderUser/>}/>
          <Route exact path='/order/for/driver' element={<OrderDriver/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;