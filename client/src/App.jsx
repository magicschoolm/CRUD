import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [userData, setUserData] = useState({name: "", age:  "", city: ""});

  // GET all users
  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");

      setUsers(res.data);
      setFilterUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Search
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();

    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );

    setFilterUsers(filteredUsers);
  };

  // Delete
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/users/${id}`);

        // Get updated data after deleting
        getAllUsers();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const closeModel = () => {
      setIsModelOpen(false)
  }

  //add user details 

  const handleAddRecord = () => {
    setUserData({name: "",
       age:  "",
       city: ""
      })
      setIsModelOpen(true)
  }



  const handleData =(e) => {
    setUserData({...userData, [e.target.name]: e.target.value})
  }


  const handleSumit = async (e) =>  {
    e.preventDefault()
      if (userData.id) {
        await axios.patch(`http://localhost:8000/users/${userData.id}`,
    userData).then((res) => {
      console.log(res)
    })
  } else {
    await axios.post("http://localhost:8000/users",
    userData).then((res) => {
      console.log(res)
  })}
    await getAllUsers();
    closeModel()
    setUserData({name: "",
       age:  "",
       city: ""
      })
      
  }


  const handleEditRecord = (user) => {
    setUserData(user)
    setIsModelOpen(true)
  }
  return (
    <>
      <div className="container">
        <h3>CRUD Application with React.js and Node.js</h3>

        <div className="input-search">
          <input
            type="search"
            placeholder="Search data"
            onChange={handleSearchChange}
          />

          <button className="btn-green"
          onClick={handleAddRecord}>
            Add Record
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {filterUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>

                <td>
                  <button className="btn-green"
                  onClick={() => handleEditRecord(user)}>
                    Edit
                  </button>
                </td>

                <td>
                  <button
                    className="btn-red"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModelOpen && (
          <div className="model">
          <div className="model-context">
            <span className="close" onClick={closeModel}>
              &times;
              </span>
            <h2>{userData.id ? "Update Record" : "add User"}</h2>
            <div className="input-group">
              <label htmlFor="name">full NAme</label>
              <input type="text" value={userData.name} name="name" id="name" onChange={handleData}/>
            </div>
            <div className="input-group">
              <label htmlFor="age">Age: </label>
              <input type="number" value={userData.age} name="age" id="age" onChange={handleData}/>
            </div>
            <div className="input-group">
              <label htmlFor="name">City: </label>
              <input type="text" value={userData.city} name="city" id="city" onChange={handleData}/>
            <div>
              <button className="btn green" onClick={handleSumit}>{userData.id ? "Update Record" : "add User"}</button>
            </div>
            </div>
            </div>
            </div>
        )}
      </div>
    </>
  );
}

export default App;