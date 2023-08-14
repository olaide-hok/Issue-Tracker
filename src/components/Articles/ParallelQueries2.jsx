import {useQuery} from 'react-query'

function getReposAndGists(username) {
    return Promise.all([
        fetch(`https://api.github.com/users/${username}/repos`).then((res) =>
            res.json()
        ),
        fetch(`https://api.github.com/users/${username}/gists`).then((res) =>
            res.json()
        ),
    ])
}

const ReposAndGists = ({username}) => {
    const reposAndGistsQuery = useQuery(['reposAndGists', username], () =>
        getReposAndGists(username)
    )

    if (reposAndGistsQuery.isLoading) {
        return <p>Loading...</p>
    }

    if (reposAndGistsQuery.isError) {
        return <p>Error: {reposAndGistsQuery.error.message}</p>
    }

    if (!reposAndGistsQuery.data) {
        return null
    }

    const [repos, gists] = reposAndGistsQuery.data

    return (
        <div>
            <h2>Repos</h2>
            <ul>
                {repos.map((repo) => (
                    <li key={repo.id}>{repo.name}</li>
                ))}
            </ul>

            <hr />

            <h2>Gists</h2>
            <ul>
                {gists.map((gist) => (
                    <li key={gist.id}>{gist.description}</li>
                ))}
            </ul>
        </div>
    )
}
