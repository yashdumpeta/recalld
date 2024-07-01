import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function MyForm({ route, method }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const response = await api.post(route, {username, password})
            if(method === "login"){
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
            <h2>{method === "register" ? "Create an account" : "Sign in to your account"}</h2>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                    id="username"
                    className="form-input" 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                    id="password"
                    className="form-input" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </div>
            <button className="form-submit-button" type="submit">
                {method === "register" ? "Sign up" : "Sign in"}
            </button>
        </form>
    )
;}

export default MyForm