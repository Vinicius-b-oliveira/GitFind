import { UserRoundSearch } from 'lucide-react';
import { UsernameInput } from '../../components/username-input';
import { useState } from 'react';
import { api } from '../../lib/axios';
import './styled.css';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [error, setError] = useState("")

    function handleUsername(value) {
        setUsername(value);
    }

    async function handleSearch(event) {
        event.preventDefault();
    
        if (!username) {
            return alert("Insira um nome de usuário!");
        }
    
        try {
            const res = await api.get(`/${username}`);
            const data = res.data;
    
            if (data.login) {
                setError("");
                navigate(`/user/${username}`, { state: { userData: res.data } })
            } else {
                console.log(data)
                setError("Usuário inválido!");
            }
        } catch (err) {
            setError("Erro ao buscar o usuário!");
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