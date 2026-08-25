import { useEffect, useState } from "react"
import { fetchUsers } from "../lib/api.js"

function Userlist(){
    const[users,setUsers] = useState([])
    async function fetchUser(){
    try {
        const data = await fetchUsers()
        setUsers(data.data || [])
    } catch (error) {
        console.error(error)
    }
    }
    useEffect(function(){
        fetchUser()
    },[])
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