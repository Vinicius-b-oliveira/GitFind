import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { ErrorModal } from "../../components/error-modal";
import { Link } from "react-router-dom";
import './styled.css'
import { formatDistanceToNow } from "date-fns";


export function UserDetails() {
    const location = useLocation();
    const { username } = useParams();

    const [userData, setUserData] = useState({});
    const [repos, setRepos] = useState([]);
    const [events, setEvents] = useState([]);
    const [reposPage, setReposPage] = useState(1);
    const [eventsPage, setEventsPage] = useState(1);


    const [error, setError] = useState("");
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    function openErrorModal() {
        setIsErrorModalOpen(true);
    }

    function closeErrorModal() {
        setIsErrorModalOpen(false);
    }

    async function fetchRepos() {
        const response = await api.get(`/${username}/repos`, {
            params: {per_page: 2, page: reposPage}
        });

        setReposPage(prevPage => prevPage + 1);

        return response.data;
    }

    async function fetchEvents() {
        const response = await api.get(`/${username}/events`, {
            params: {per_page: 4, page: eventsPage}
        });

        const dataFromEvents = response.data;

        const filteredData = dataFromEvents.map(event => {
            const hasCommits = event.payload && event.payload.commits && event.payload.commits.length > 0;
        
            return {
                type: event.type,
                repoName: event.repo?.name || "Nome de repositório indisponível",
                message: hasCommits ? event.payload.commits[0].message : "Sem mensagem",
                createdAt: formatDistanceToNow(new Date(event.created_at), { addSuffix: true })
            };
        });

        setEventsPage(prevPage => prevPage + 1);

        return filteredData;
    }

    useEffect(() => {
        async function fetchUserData() {
            if (!userData.login && location.state?.userData) {
                setUserData(location.state.userData);

                if (repos.length === 0 || events.length === 0) {
                    try {
                        const reposResponse = await fetchRepos();
                        const eventsResponse = await fetchEvents();

                        setRepos([...reposResponse]);
                        setEvents([...eventsResponse]);

                    } catch (err) {
                        if (err.response && err.response.headers['x-ratelimit-remaining'] === '0') {
                            const resetTime = err.response.headers['x-ratelimit-reset'];
                            const currentTime = Math.floor(Date.now() / 1000);
                            const timeUntilReset = resetTime - currentTime;

                            setError(`Limite de requisições atingido! Tente novamente em ${Math.ceil(timeUntilReset / 60)} minutos.`);

                            openErrorModal();
                        } else {
                            setError("Erro ao buscar os repositórios!");
                            openErrorModal();
                        }
                    }
                }
            } else {
                setError("Erro ao carregar dados desse usuário!");
                openErrorModal();
            }
        }

        fetchUserData();
    }, [username]);

    async function loadMoreRepos() {
        try {
            const reposResponse = await fetchRepos();

            setRepos(prevRepos => [...prevRepos, ...reposResponse]);
        } catch (err) {
            if (err.response && err.response.headers['x-ratelimit-remaining'] === '0') {
                const resetTime = err.response.headers['x-ratelimit-reset'];
                const currentTime = Math.floor(Date.now() / 1000);
                const timeUntilReset = resetTime - currentTime;

                setError(`Limite de requisições atingido! Tente novamente em ${Math.ceil(timeUntilReset / 60)} minutos.`);
                openErrorModal();
            } else {
                setError("Erro ao buscar os repositórios!");
                openErrorModal();
            }
        }
    }

    async function loadMoreEvents() {
        try {
            const eventsResponse = await fetchEvents();

            setEvents(prevEvents => [...prevEvents, ...eventsResponse]);
        } catch (err) {
            if (err.response && err.response.headers['x-ratelimit-remaining'] === '0') {
                const resetTime = err.response.headers['x-ratelimit-reset'];
                const currentTime = Math.floor(Date.now() / 1000);
                const timeUntilReset = resetTime - currentTime;

                setError(`Limite de requisições atingido! Tente novamente em ${Math.ceil(timeUntilReset / 60)} minutos.`);
                openErrorModal();
            } else {
                setError("Erro ao buscar os eventos!");
                openErrorModal();
            }
        }
    }

    return (
        <div className="container">
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <img src={userData.avatar_url} alt="Profile Avatar" className="profile-picture" />
                        <div className="profile-info">
                            <h2>{userData.login}</h2>
                            <p>{userData.bio ?? 'Esse usuário não possui bio!'}</p>
                            <div className="followers-container">
                                <div className="followers">
                                    <strong>
                                        {userData.followers > 1000 ? (
                                            ((userData.followers / 1000).toFixed(0) + 'k').toString()
                                        ) : (
                                            userData.followers
                                        )}
                                    </strong>
                                    <span>Followers</span>
                                </div>
                                <div className="following">
                                    <strong>
                                        {userData.following > 1000 ? (
                                            ((userData.following / 1000).toFixed(0) + 'k').toString()
                                        ) : (
                                            userData.following
                                        )}
                                    </strong>
                                    <span>Following</span>
                                </div>
                            </div>
                        </div>
                    </div>

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

                        <button onClick={() => loadMoreRepos()} className="load-more">Load More</button>
                    </div>

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
                                <li>Nenhum evento encontrado</li>
                            )}
                        </ul>
                        <button onClick={() => loadMoreEvents()} className="load-more">Load More</button>
                    </div>
                </div>
            </div>
            
            <Link to="/">
                <button className="back-button">Back to Home</button>
            </Link>

            {isErrorModalOpen && (
                <ErrorModal
                    errorDescription={error}
                    closeModal={closeErrorModal}
                />
            )}
        </div>
    )
}