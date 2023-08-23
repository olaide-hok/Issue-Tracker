import * as React from 'react'
import {useQuery, useQueryClient} from 'react-query'

export default function App() {
    const queryClient = useQueryClient()
    const usersQuery = useQuery(
        ['users'],
        () =>
            fetch('https://ui.dev/api/courses/react-query/users').then((res) =>
                res.json()
            ),
        {
            staleTime: 1000 * 60 * 5,
        }
    )
    return (
        <div>
            <h2>Users</h2>
            {usersQuery.isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {usersQuery.data.map((user) => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            )}
            {!usersQuery.isStale && (
                <button
                    onClick={() => {
                        queryClient.invalidateQueries(['users'])
                    }}>
                    Invalidate Query
                </button>
            )}
        </div>
    )
}
