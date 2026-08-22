import axios from "axios"
import { useEffect, useState } from "react"

function Userlist(){
    const[users,setUsers] = useState([])
    async function fetchUser(){
    const response =  await axios.get("http://localhost:3000/fetch-users")
    setUsers(response.data.data)
    }
    useEffect(function(){
        fetchUser()
    },[])
    console.log(users)
    return (
        <div>
            {users.map(function(user)
             {
                return (
                    <div>
                        <h1>{user.username}</h1>
                        <h1>{user.email}</h1>
                    </div>
                )

            })}
        </div>
    )
}

export default Userlist