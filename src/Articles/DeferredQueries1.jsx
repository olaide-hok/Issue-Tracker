// Problems with this implementation? First, the query immediately makes a request with an empty search query, which grabs all of the issues for that repository.

const IssueSearch = () => {
    const [search, setSearch] = React.useState('')
    const queryString =
        'q=' +
        encodeURIComponent(`${search} is:issue repo:facebook/react-native`)

    const issuesQuery = useQuery(['issues', search], () =>
        fetch(`https://api.github.com/search/issues?${queryString}`).then(
            (res) => res.json()
        )
    )

    return (
        <div>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for issues"
            />
            {issuesQuery.isLoading ? (
                <p>Loading issues...</p>
            ) : (
                <ul>
                    {issuesQuery.data.items.map((issue) => (
                        <li key={issue.id}>{issue.title}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}
