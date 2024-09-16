import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import './styled.css'
import { api } from "../../lib/axios";
import { ErrorModal } from "../../components/error-modal";


export function UserDetails() {
    const location = useLocation();
    const { username } = useParams();

    const [userData, setUserData] = useState({});
    const [repos, setRepos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [error, setError] = useState("");
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    function openErrorModal() {
        setIsErrorModalOpen(true);
    }

    function closeErrorModal() {
        setIsErrorModalOpen(false);
    }

    useEffect(() => {
        async function fetchUserData(page) {
            if (!userData.login && location.state?.userData) {
                setUserData(location.state.userData);

                if (repos.length === 0) {
                    try {
                        const response = await api.get(`/${username}/repos`, {
                            params: {
                                per_page: 2,
                                page: page
                            }
                        });

                        setRepos(prevRepos => [...prevRepos, ...response.data]);
                        setCurrentPage(prevPage => prevPage + 1)
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
            }
        }

        fetchUserData(currentPage);
    }, [username]);

    async function loadMoreRepos(page) {
        try {
            const response = await api.get(`/${username}/repos`, {
                params: {
                    per_page: 2,
                    page: page
                }
            });

            setRepos(prevRepos => [...prevRepos, ...response.data]);
            setCurrentPage(page + 1);
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
                                            <a href={repo.html_url}>{repo.name}</a>
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

                        <button onClick={() => loadMoreRepos(currentPage)} className="load-more">Load More</button>
                    </div>

                    <div className="events">
                        <h3>Recent Events</h3>
                        <ul>
                            <li>
                                <span>Pushed to master</span> on <a href="#">Hello-World</a>
                                <span className="date">2 days ago</span>
                            </li>
                            <li>
                                <span>Created new issue</span> on <a href="#">Spoon-Knife</a>
                                <span className="date">1 week ago</span>
                            </li>
                        </ul>
                        <button className="load-more">Load More</button>
                    </div>
                </div>
            </div>

            {isErrorModalOpen && (
                <ErrorModal
                    errorDescription={error}
                    closeModal={closeErrorModal}
                />
            )}
        </div>
    )
}