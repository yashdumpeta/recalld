import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import api from "../api.js"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
    //check if authorized, if not redirect to login page
    const [isAllowed, setIsAllowed] = useState(null)

    //refresh access token 
    const refresh_token = async () => {
        
        //get refresh token from our constants file
        const refresh_token = localStorage.getItem(REFRESH_TOKEN)
        //if no refresh token exists, just return false because this would never happen if someone had an account
        if (!refresh_token) {
            setIsAllowed(false);
            return;
        }

        try {
            //send the request to backend
            //automatically uses the baseURL in the api.js file to match the (api.post). Give the route you want to access
            //set an api post to refresh with the a refresh_token variable as like context/supplementary info to get the new access token
            const response = await api.post("/api/token/refresh/", {
                refresh: refresh_token
            });
            
            //were able to set the access token, got back an access token, set the local storage's access token to the new one
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                setIsAllowed(true)
            }
            else {
                setIsAllowed(false)
            }

        }
        catch {
            //error message if not able to refresh token
            setIsAllowed(false)
            console.log("Error")
        }
    }

    //do we need to refresh the token
    const authorize = async () => {
        const auth_token = localStorage.getItem(ACCESS_TOKEN)
        if (!auth_token) { //if token not valid
            setIsAllowed(false) //sets it to false
            return
        }
        try {
            const decodedToken = jwtDecode(auth_token) //decodes the token 
            const token_expiration = decodedToken.exp // (.exp is a expiration token variable for JWT tokens)
            const now = Date.now() / 1000 //(date in seconds)
            if (token_expiration < now) {
                await refresh_token() //if token is expired
            }
            else {
                setIsAllowed(true) //token not yet expireed
            }
        }
        catch (error) {
            console.error("Error during authorization:", error);
            setIsAllowed(false);
        }
    }


    useEffect(() => {
        authorize();
    }, []);

    if (isAllowed === null) {
        return <div>Loading...</div>
    }

    return (isAllowed ? children : <Navigate to="/loginPage" />)
}

export default ProtectedRoute