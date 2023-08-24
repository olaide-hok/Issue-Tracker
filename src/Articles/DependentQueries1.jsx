async function getLabelsAndIssues(owner, repo) {
    const labels = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/labels`
    ).then((res) => res.json())

    const issues = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?labels=${labels[0].name}`
    ).then((res) => res.json())

    return [labels, issues]
}

const IssueLabelFilter = ({owner, repo}) => {
    const [labels, issues] = getLabelsAndIssues(owner, repo)

    return (
        <div>
            <h2>Labels</h2>
            {labels.isLoading ? (
                <p>Loading labels...</p>
            ) : (
                <ul>
                    {labels.data.map((label) => (
                        <li key={label.id}>{label.name}</li>
                    ))}
                </ul>
            )}

            <hr />

            <h2>Issues</h2>
            {issues.isLoading ? (
                <p>Loading issues...</p>
            ) : (
                <ul>
                    {issues.data.map((issue) => (
                        <li key={issue.id}>{issue.title}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}
