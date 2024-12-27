import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login'
import Dashboard from './Components/Dashboard/Dashboard'
import Bloglist from './Components/Blogs/BlogList'
import Addblogs from './Components/Blogs/Addblogs';
import UserList from './Components/Users/UsersList';
import AddUser from './Components/Users/AddUser';
import ApiList from './Components/Api/ApiList';
import AddApi from './Components/Api/AddApi';
import UpdateUser from './Components/Users/UpdateUser';
import UpdateBlogs from './Components/Blogs/UpdateBlogs';
import UpdateApi from './Components/Api/UpdateApi';


function App() {
  return (
    <>
     <BrowserRouter>
       <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/admin/dashboard' element= {<Dashboard/>} /> 
        <Route path= '/blogs/blog-list' element={<Bloglist/>}  />    
        <Route path= '/blogs/add-blog' element={<Addblogs/>}  />  
        <Route path='/Users/user-list' element={<UserList/>} />
        <Route path='/users/add-user' element={<AddUser/>} />
        <Route path='/users/api-list' element={<ApiList/>} />
        <Route path='/users/add-api' element={<AddApi/>} />
        <Route path='/users/edit-user/:id' element={<UpdateUser/>} />
        <Route path='/users/update-user/:id' element={<UpdateBlogs/>} />
        <Route path='/users/update-api/:id' element={<UpdateApi/>} />
       </Routes>
     </BrowserRouter>
    </>
  );
}

export default App;
