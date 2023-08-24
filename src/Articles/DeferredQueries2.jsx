// setting the enabled option to false when the search string is empty and not showing the results if fetchStatus is idle.
// Problem: the component fires off another request whenever the search term changes. Not only is this inefficient, but it also makes it too easy to run into Github's rate limit.

const IssueSearch = () => {
    const [search, setSearch] = React.useState('')
    const queryString =
        'q=' +
        encodeURIComponent(`${search} is:issue repo:facebook/react-native`)

    const issuesQuery = useQuery(
        ['issues', search],
        () =>
            fetch(`https://api.github.com/search/issues?${queryString}`).then(
                (res) => res.json()
            ),
        {
            enabled: !!search,
        }
    )

    return (
        <div>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for issues"
            />
            {issuesQuery.fetchStatus === 'idle' &&
            issuesQuery.isLoading ? null : issuesQuery.isLoading ? (
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
