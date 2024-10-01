import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { ErrorModal } from "../../components/error-modal";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import './styled.css'
import { ProfileHeader } from "../../components/profile-header";
import { Repositories } from "../../components/repositories";
import { Events } from "../../components/events";


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

    function CalcRemainingTime(resetTime) {
        const currentTime = Math.floor(Date.now() / 1000);
        return resetTime - currentTime;
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

    async function loadMoreRepos() {
        try {
            const reposResponse = await fetchRepos();

            setRepos(prevRepos => [...prevRepos, ...reposResponse]);
        } catch (err) {
            if (err.response && err.response.headers['x-ratelimit-remaining'] === '0') {
                const timeUntilReset = CalcRemainingTime(err.response.headers['x-ratelimit-reset']);

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
                const timeUntilReset = CalcRemainingTime(err.response.headers['x-ratelimit-reset']);

                setError(`Limite de requisições atingido! Tente novamente em ${Math.ceil(timeUntilReset / 60)} minutos.`);
                openErrorModal();
            } else {
                setError("Erro ao buscar os eventos!");
                openErrorModal();
            }
        }
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
                            const timeUntilReset = CalcRemainingTime(err.response.headers['x-ratelimit-reset']);

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

    return (
        <div className="container">
            <div className="profile-container">
                <div className="profile-card">

                    <ProfileHeader 
                        avatarUrl={userData.avatar_url}
                        bio={userData.bio}
                        followers={userData.followers}
                        following={userData.following}
                        login={userData.login}
                    />

                    <Repositories 
                        repos={repos}
                        loadMore={loadMoreRepos}
                    />

                    <Events 
                        events={events}
                        loadMore={loadMoreEvents}
                    />
                </div>
            </div>
            
            <Link to="/">
                <button className="home-button">Back to Home</button>
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