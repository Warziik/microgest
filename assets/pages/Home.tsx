import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
    const { userData } = useAuth();

    return <>
        <p>ID: {userData.id}</p>
        <p>Prénom: {userData.firstname}</p>
        <p>Nom de famille: {userData.lastname}</p>
        <p>Adresse email: {userData.email}</p>
    </>;
}

export default Home;