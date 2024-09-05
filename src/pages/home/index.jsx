import { UserRoundSearch } from 'lucide-react';
import { UsernameInput } from '../../components/username-input';
import { useState } from 'react';
import './styled.css';
import { api } from '../../lib/axios';

export function Home() {
    const [username, setUsername] = useState("");
    const [userData, setUserData] = useState({});
    const [error, setError] = useState("")

    function handleUsername(value) {
        setUsername(value);
    }

    async function handleSearch(event) {
        event.preventDefault();

        if(!username) {
            alert("Insira um nome de usuário!");
        }

        try {
            const res = await api.get(`/${username}`);
            setUserData(res.data);
            setError("");
        } catch (err) {
            setError("Erro ao buscar o usuário!");
            return;
        }
    }

    return (
        <main className='container'>
            <h1 className='title'>
                GitFind
                <UserRoundSearch size={40} className='logo-icon' />
            </h1>
            
            <form onSubmit={handleSearch} >
                <UsernameInput 
                    value={username} 
                    onValueChange={handleUsername} 
                    error={error} 
                />

                <button type='submit' className='search'>Buscar</button>
            </form>
        </main>
    )
}