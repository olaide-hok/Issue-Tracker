import * as React from 'react'
import {useQuery, useQueryClient} from 'react-query'

/**
 * Create a component that renders a list of issues
 * fetched from
 * `https://ui.dev/api/courses/react-query/issues`.
 *
 * Clicking on an issue should update the `issueNumber`
 * state, which renders the issue details.
 *
 * The issue details component should fetch from the
 * `https://ui.dev/api/courses/react-query/issues/:issueNumber`
 * endpoint. It should also render the comments fetched from
 * `https://ui.dev/api/courses/react-query/issues/:issueNumber/comments`.
 *
 * The issue details should be preloaded with data,
 * either through `initialData` or by priming
 * the cache with `queryClient.setQueryData`.
 * On the issue list component, hovering over
 * the issue should prefetch the comments.
 */
async function fetchIssues() {
    const res = await fetch(`https://ui.dev/api/courses/react-query/issues`)
    const issues = await res.json()
    return issues
}
async function fetchIssueDetails(issueNumber) {
    return fetch(
        `https://ui.dev/api/courses/react-query/issues/${issueNumber}`
    ).then((res) => res.json())
}
async function fetchIssueComments(issueNumber) {
    return fetch(
        `https://ui.dev/api/courses/react-query/issues/${issueNumber}/comments`
    ).then((res) => res.json())
}

function Issues({setIssueNumber}) {
    const queryClient = useQueryClient()
    // Implement the query here
    const issuesQuery = useQuery(['labels'], fetchIssues, {placeholderData: []})
    //   const issuesQuery = { data: [] };
    issuesQuery.data.forEach((issue) => {
        queryClient.setQueryData(['issue', issue.number], issue)
    })

    return (
        <div>
            <h1>Issues</h1>
            <ul>
                {issuesQuery.data.map((issue) => (
                    <li key={issue.id}>
                        <a
                            href="#"
                            onClick={() => setIssueNumber(issue.number)}
                            onMouseEnter={() => {
                                queryClient.prefetchQuery(
                                    ['issuesComments'],
                                    () => fetchIssueComments(issue.number),
                                    {
                                        staleTime: 1000 * 5, // 5 seconds
                                    }
                                )
                            }}>
                            {issue.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function IssueDetails({issueNumber, setIssueNumber}) {
    // Implement the query here
    const issueQuery = useQuery(
        ['issues', issueNumber],
        () => fetchIssueDetails(issueNumber),
        {placeholderData: {}}
    )
    //   const issueQuery = { data: {} };

    return (
        <div>
            <h1>Issue Details</h1>
            <a href="#" onClick={() => setIssueNumber(null)}>
                Back to issues
            </a>
            <p>
                #{issueQuery.data.number} {issueQuery.data.title}
            </p>
            <IssueComments issueNumber={issueNumber} />
        </div>
    )
}

function IssueComments({issueNumber}) {
    // Implement the query here
    const commentsQuery = useQuery(
        ['issuesComments', issueNumber],
        () => fetchIssueComments(issueNumber),
        {placeholderData: {}}
    )
    // const commentsQuery = {data: []}

    return (
        <div>
            <h2>Comments</h2>
            <ul>
                {commentsQuery.data.map((comment) => (
                    <li key={comment.id}>{comment.comment}</li>
                ))}
            </ul>
        </div>
    )
}

export function App() {
    const [issueNumber, setIssueNumber] = React.useState(null)
    if (issueNumber === null) {
        return <Issues setIssueNumber={setIssueNumber} />
    } else {
        return (
            <IssueDetails
                issueNumber={issueNumber}
                setIssueNumber={setIssueNumber}
            />
        )
    }
}

async function fetchIssuesAns(queryClient) {
    const results = await fetch(
        `https://ui.dev/api/courses/react-query/issues`
    ).then((res) => res.json())
    results.forEach((issue) => {
        queryClient.setQueryData(['issues', issue.number], issue)
    })
    return results
}
async function fetchIssueDetailsAns(issueNumber) {
    return fetch(
        `https://ui.dev/api/courses/react-query/issues/${issueNumber}`
    ).then((res) => res.json())
}
async function fetchIssueCommentsAns(issueNumber) {
    return fetch(
        `https://ui.dev/api/courses/react-query/issues/${issueNumber}/comments`
    ).then((res) => res.json())
}

function IssuesAns({setIssueNumber}) {
    const queryClient = useQueryClient()
    const issuesQuery = useQuery(['issues'], () => fetchIssuesAns(queryClient))

    return (
        <div>
            <h1>Issues</h1>
            <ul>
                {issuesQuery.isLoading ? (
                    <p>Loading...</p>
                ) : (
                    issuesQuery.data.map((issue) => (
                        <li key={issue.id}>
                            <a
                                href="#"
                                onClick={() => setIssueNumber(issue.number)}
                                onMouseEnter={() => {
                                    queryClient.prefetchQuery(
                                        ['issues', issue.number, 'comments'],
                                        () => fetchIssueComments(issue.number)
                                    )
                                }}>
                                {issue.title}
                            </a>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}

function IssueDetailsAns({issueNumber, setIssueNumber}) {
    // Implement the query here
    const issueQuery = useQuery(['issues', issueNumber], () =>
        fetchIssueDetailsAns(issueNumber)
    )

    return (
        <div>
            <h1>Issue Details</h1>
            <a href="#" onClick={() => setIssueNumber(null)}>
                Back to issues
            </a>
            {issueQuery.isLoading ? (
                <p>Loading...</p>
            ) : (
                <p>
                    #{issueQuery.data.number} {issueQuery.data.title}
                </p>
            )}
            <IssueCommentsAns issueNumber={issueNumber} />
        </div>
    )
}

function IssueCommentsAns({issueNumber}) {
    // Implement the query here
    const commentsQuery = useQuery(['issues', issueNumber, 'comments'], () =>
        fetchIssueCommentsAns(issueNumber)
    )

    return (
        <div>
            <h2>Comments</h2>
            {commentsQuery.isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {commentsQuery.data.map((comment) => (
                        <li key={comment.id}>{comment.comment}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default function AppAns() {
    const [issueNumber, setIssueNumber] = React.useState(null)
    if (issueNumber === null) {
        return <IssuesAns setIssueNumber={setIssueNumber} />
    } else {
        return (
            <IssueDetailsAns
                issueNumber={issueNumber}
                setIssueNumber={setIssueNumber}
            />
        )
    }
}
