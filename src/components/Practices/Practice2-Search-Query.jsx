import * as React from 'react'
import {useQuery} from 'react-query'

export default function App() {
    const [search, setSearch] = React.useState('')

    const issuesSearch = useQuery(
        ['issues', 'search', search],
        () =>
            fetch(
                `https://ui.dev/api/courses/react-query/search/issues?q=${search}`
            ).then((res) => res.json()),
        {
            enabled: !!search,
        }
    )

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    setSearch(e.target.search.value)
                }}>
                <label>
                    Search:
                    <input type="text" name="search" placeholder="Search" />
                </label>
            </form>
            <p>
                Try something like <code>Dependencies</code>.
            </p>
            {issuesSearch.fetchStatus === 'idle' &&
            issuesSearch.isLoading ? null : issuesSearch.isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h2>Results: {issuesSearch.data.count}</h2>
                    <ul>
                        {issuesSearch.data.items.map((issue) => (
                            <li key={issue.id}>{issue.title}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}
