import './styled.css';

export function ErrorModal({errorDescription, closeModal}) {
    return(
        <div className="modal-container">
            <div className="modal">
                <h2 className="modal-title">Error</h2>
                <p className="modal-description">{errorDescription}</p>
                <button onClick={() => closeModal()} className="modal-button">OK</button>
            </div>
        </div>
    )
}