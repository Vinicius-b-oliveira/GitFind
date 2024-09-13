import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import './styled.css'


export function UserDetails() {
    const [userData, setUserData] = useState({});
    const location = useLocation();

    useEffect(() => {
        if(location.state?.userData) {
            setUserData(location.state.userData);
        }
    }, [location])

    return (
        <div className="container">
            <div class="profile-container">
                <div class="profile-card">
                    <div class="profile-header">
                        <img src={userData.avatar_url} alt="Profile Avatar" class="profile-picture" />
                        <div class="profile-info">
                            <h2>{userData.login}</h2>
                            <p>{userData.bio ?? 'Esse usuário não possui bio!'}</p>
                            <div class="followers-container">
                                <div class="followers">
                                    <strong>
                                        {userData.followers > 1000 ? (
                                            ((userData.followers / 1000).toFixed(0) + 'k').toString() 
                                        ) : (
                                            userData.followers
                                        )}
                                        </strong>
                                    <span>Followers</span>
                                </div>
                                <div class="following">
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

                    <div class="repositories">
                        <h3>Repositories</h3>
                        <ul>
                            <li>
                                <a href="#">Hello-World</a>
                                <span>JavaScript</span>
                                <div class="repo-info">
                                    <span>Forks: 500</span>
                                    <span>Stars: 1.2K</span>
                                    <span>Watchers: 300</span>
                                </div>
                            </li>
                            <li>
                                <a href="#">Spoon-Knife</a>
                                <span>HTML</span>
                                <div class="repo-info">
                                    <span>Forks: 200</span>
                                    <span>Stars: 900</span>
                                    <span>Watchers: 100</span>
                                </div>
                            </li>
                        </ul>
                        <button class="load-more">Load More</button>
                    </div>

                    <div class="events">
                        <h3>Recent Events</h3>
                        <ul>
                            <li>
                                <span>Pushed to master</span> on <a href="#">Hello-World</a>
                                <span class="date">2 days ago</span>
                            </li>
                            <li>
                                <span>Created new issue</span> on <a href="#">Spoon-Knife</a>
                                <span class="date">1 week ago</span>
                            </li>
                        </ul>
                        <button class="load-more">Load More</button>
                    </div>
                </div>
            </div>
        </div>
    )
}