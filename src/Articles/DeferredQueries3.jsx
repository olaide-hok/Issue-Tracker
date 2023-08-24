// One solution would be to wrap the input in a form and only make a new request when that form is submitted.

const IssueSearch = () => {
    const [search, setSearch] = React.useState('')
    const queryString =
        'q=' + encodeURIComponent(`${search} is:issue repo:facebook/react`)

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
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    setSearch(e.target.elements.search.value)
                }}>
                <input
                    type="text"
                    name="search"
                    placeholder="Search for issues"
                />
            </form>
            {/* Add submit button */}
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
