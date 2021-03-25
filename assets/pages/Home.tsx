import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const Home = () => {
    const { userData, logout } = useAuth();
    const toast = useToast();

    const handleLogout = async () => {
        const [isSuccess] = await logout();

        if (isSuccess) toast("success", "Vous êtes déconnecté.");
    }

    return <>
        <h1>Homepage</h1>
        <button onClick={handleLogout}>Logout</button>
        <p>ID: {userData.id}</p>
        <p>Prénom: {userData.firstname}</p>
        <p>Nom de famille: {userData.lastname}</p>
        <p>Adresse email: {userData.email}</p>
    </>;
}

export default Home;