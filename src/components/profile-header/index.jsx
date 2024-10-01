import './styled.css';

export function ProfileHeader({avatarUrl, login, bio, followers, following}) {
    return(
        <div className="profile-header">
            <img src={avatarUrl} alt="Profile Avatar" className="profile-picture" />
            <div className="profile-info">
                <h2>{login}</h2>
                <p>{bio ?? 'Esse usuário não possui bio!'}</p>
                <div className="followers-container">
                    <div className="followers">
                        <strong>
                            {followers > 1000 ? (
                                ((followers / 1000).toFixed(0) + 'k').toString()
                            ) : (
                                followers
                            )}
                        </strong>
                        <span>Followers</span>
                    </div>
                    <div className="following">
                        <strong>
                            {following > 1000 ? (
                                ((following / 1000).toFixed(0) + 'k').toString()
                            ) : (
                                following
                            )}
                        </strong>
                        <span>Following</span>
                    </div>
                </div>
            </div>
        </div>
    )
}