import { useState } from "react";
import api from "../api";
import { unstable_useViewTransitionState, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";


//route = where redirected after submitting form
//method = register/login
function MyForm({ route, method }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const response = await api.post(route, {username, password}) //post to the route that was passed to the form, passes 
            if(method === "login"){
                //if no error, get the access token and refresh token and sets them
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh)
                navigate("/dashboard")
            }
            else{
                navigate("/login")
            }
        }
        catch (error) {
            alert("Some error")
        }
        finally {
            setLoading(false)
        }

    }


    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{method === "login" ? "Login" : "Register"}</h1>
            <input className="form-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username">
            </input>
            <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password">
            </input>
            <button className="form-submit-buttom" type="submit">{method === "login" ? "Login" : "Register"}</button>
        </form>
    )
}

export default MyForm