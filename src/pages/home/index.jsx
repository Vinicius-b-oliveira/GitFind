import { UserRoundSearch } from 'lucide-react';
import { UsernameInput } from '../../components/username-input';
import { useState } from 'react';
import { api } from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import { ErrorModal } from '../../components/error-modal';
import './styled.css';

export function Home() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [error, setError] = useState("")

    function handleUsername(value) {
        setUsername(value);
    }

    function openErrorModal() {
        setIsErrorModalOpen(true);
    }

    function closeErrorModal() {
        setIsErrorModalOpen(false);
    }

    async function handleSearch(event) {
        event.preventDefault();
    
        if (!username) {
            setError("Insira um nome!");
            return openErrorModal();
        }
    
        try {
            const res = await api.get(`/${username}`);
            const data = res.data;
    
            if (data.login) {
                setError("");
                navigate(`/user/${username}`, { state: { userData: res.data }});
            } else {
                setError("Usuário inválido!");
            }
        } catch (err) {
            if (err.response && err.response.headers['x-ratelimit-remaining'] === '0') {
                const resetTime = err.response.headers['x-ratelimit-reset'];
                const currentTime = Math.floor(Date.now() / 1000);
                const timeUntilReset = resetTime - currentTime;
                setError(`Limite de requisições atingido! Tente novamente em ${Math.ceil(timeUntilReset / 60)} minutos.`);
                openErrorModal();
            } else {
                setError("Erro ao buscar esse usuário!");
                openErrorModal();
            }
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

            {isErrorModalOpen && (
                <ErrorModal 
                    errorDescription={error} 
                    closeModal={closeErrorModal}
                />
            )}
        </main>
    )
}