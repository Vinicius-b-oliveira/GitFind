import './styled.css';

export function Events({events, loadMore}) {
    return(
        <div className="events">
            <h3>Recent Events</h3>
            <ul>
                {events.length > 0 ? (
                    events.map((event, index) => {
                        return(
                            <li key={index}> 
                                <span>"
                                    {event.message ?? 'sem commit'}"
                                </span> 

                                on <a href={`https://github.com/${event.repoName}`} target="_blank">{event.repoName}</a>

                                <span className="date">{event.createdAt}</span>
                            </li>
                        )
                    })
                ) : (
                    <li className="error-message">Nenhum evento encontrado</li>
                )}
            </ul>
            <button onClick={() => loadMore()} className="load-more">Load More</button>
        </div>
    )
}