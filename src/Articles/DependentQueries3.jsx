const IssueLabelFilter = ({owner, repo}) => {
    const labelsQuery = useQuery(['repos', owner, repo, 'labels'], () =>
        fetch(`https://api.github.com/repos/${owner}/${repo}/labels`).then(
            (res) => res.json()
        )
    )

    const labels = labelsQuery.data

    const issuesQuery = useQuery(
        ['repos', owner, repo, 'issues'],
        () =>
            fetch(
                `https://api.github.com/repos/${owner}/${repo}/issues?labels=${labels[0].name}`
            ).then((res) => res.json()),
        {
            enabled: !!labels,
        }
    )

    return (
        <div>
            <h2>Labels</h2>
            {labelsQuery.isLoading ? (
                <p>Loading labels...</p>
            ) : (
                <ul>
                    {labelsQuery.data.map((label) => (
                        <li key={label.id}>{label.name}</li>
                    ))}
                </ul>
            )}

            <hr />

            {issuesQuery.isLoading &&
            issuesQuery.fetchStatus === 'idle' ? null : (
                <>
                    <h2>Issues</h2>
                    {issuesQuery.isLoading ? (
                        <p>Loading issues...</p>
                    ) : (
                        <ul>
                            {issuesQuery.data.map((issue) => (
                                <li key={issue.id}>{issue.title}</li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    )
}
