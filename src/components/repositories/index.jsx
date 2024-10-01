import './styled.css';

export function Repositories({repos, loadMore}) {
    return(
        <div className="repositories">
            <h3>Repositories</h3>
            <ul>
                {repos.length > 0 ? (
                    repos.map((repo, index) => {
                        return (
                            <li key={index}>
                                <a href={repo.html_url} target="_blank">{repo.name}</a>
                                <span>{repo.language ?? 'Sem linguagem principal'}</span>
                                <div className="repo-info">
                                    <span>Forks: {repo.forks_count}</span>
                                    <span>Stars: {repo.stargazers_count}</span>
                                    <span>Watchers: {repo.watchers_count}</span>
                                </div>
                            </li>
                        );
                    })
                ) : (
                    <p className="error-message">Nenhum repositório encontrado</p>
                )}
            </ul>

            <button onClick={() => loadMore()} className="load-more">Load More</button>
        </div>
    )
}