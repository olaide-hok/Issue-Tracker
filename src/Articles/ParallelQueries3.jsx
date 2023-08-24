// useQueries
// React Query also provides the useQueries hook, which accepts an array of query options and returns an array of query results. It's especially useful when the number queries you are fetching can dynamically change.

import {useQueries} from 'react-query'

const ReposAndGists = ({username}) => {
    const [reposQuery, gistQuery] = useQueries([
        {
            queryKey: ['repos', username],
            queryFn: async () => {
                const res = await fetch(
                    `https://api.github.com/users/${username}/repos`
                )
                return await res.json()
            },
        },
        {
            queryKey: ['gists', username],
            queryFn: () => {
                return fetch(
                    `https://api.github.com/users/${username}/gists`
                ).then((res) => res.json())
            },
        },
    ])

    if (reposQuery.isLoading && gistQuery.isLoading) {
        return <p>Loading...</p>
    }

    if (reposQuery.isError && gistQuery.isError) {
        return (
            <>
                <p>Error: {reposQuery.error.message}</p>
                <p>Error: {gistQuery.error.message}</p>
            </>
        )
    }

    if (!reposAndGistsQuery.data) {
        return null
    }

    const repos = reposQuery.data
    const gists = gistQuery.data

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
