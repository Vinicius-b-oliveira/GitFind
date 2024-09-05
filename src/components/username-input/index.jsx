import { Search } from 'lucide-react';
import './styled.css';

export function UsernameInput({value, onValueChange, error}) {
    return(
            <div className='input-container'>
                <input 
                    type="text" 
                    placeholder='Insira o usuário' 
                    className='username' 
                    value={value}
                    onChange={e => onValueChange(e.target.value)}
                />

                <Search className="icon" />

                {error && (
                    <p className='error'>{error}</p>
                 )}
            </div>
    )
}