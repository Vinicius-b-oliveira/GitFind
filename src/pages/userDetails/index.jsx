import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function UserDetails() {
    const [userData, setUserData] = useState({});
    const location = useLocation();

    useEffect(() => {
        if(location.state?.userData) {
            setUserData(location.state.userData);
        }
    }, [location])

    return (
        <>
            Hello World!

            
        </>
    )
}