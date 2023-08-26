import * as React from 'react'
import {useIsFetching, useQuery} from 'react-query'

/**
 * Using the template below, create three components:
 *
 * 1. A component that fetches the profile picture for
 *      the user using the
 *      `https://ui.dev/api/courses/react-query/users/:id`
 *      endpoint using the prop that is passed in.
 * 2. A component that fetches a list of issues filtered
 *      by status. Use the
 *     `https://ui.dev/api/courses/react-query/issues?status=:status`
 *      endpoint. Only render the issue number and title
 * 3. A component that fetches a list of labels from the
 *      `https://ui.dev/api/courses/react-query/labels`
 *      endpoint. Render the label name and use the color
 *      of the label as the class to set the label color.
 *
 * Use the `isFetching` property to show a fetching indicator
 * for just the list of issues.
 *
 * Also use the `useIsFetching` hook to show a loading indicator
 * for every query next to the profile picture.
 */

async function fetchUser(userId) {
    return fetch(`https://ui.dev/api/courses/react-query/users/${userId}`).then(
        (res) => res.json()
    )
}
async function fetchIssues(status) {
    let url = new URL('https://ui.dev/api/courses/react-query/issues')
    if (status) {
        url.searchParams.append('status', status)
    }
    return fetch(url.toString()).then((res) => res.json())
}
async function fetchLabels() {
    return fetch(`https://ui.dev/api/courses/react-query/labels`).then((res) =>
        res.json()
    )
}

function Menubar({userId}) {
    const fetching = useIsFetching()
    const userQuery = useQuery(['user', userId], () => fetchUser(userId))
    const user = userQuery.data
    return (
        <nav>
            <h1>Fetching App{fetching ? '...' : null}</h1>
            {userQuery.isLoading ? null : (
                <img src={user.profilePictureUrl} alt={user.name} />
            )}
        </nav>
    )
}

function Issues() {
    const [status, setStatus] = React.useState('')
    // status is passed in as an object because it's a filter
    const issuesQuery = useQuery(['issues', {status}], () =>
        fetchIssues(status)
    )
    const issues = issuesQuery.data
    return (
        <>
            <h2>Issues{issuesQuery.isFetching ? '...' : ''}</h2>
            <select
                name="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}>
                <option value="">All issues</option>
                <option value="backlog">Backlog</option>
                <option value="todo">Todo</option>
                <option value="inProgress">In Progress</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
            </select>
            {issuesQuery.isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {issues.map((issue) => (
                        <li key={issue.id}>{issue.title}</li>
                    ))}
                </ul>
            )}
        </>
    )
}

function Labels() {
    const labelsQuery = useQuery(['labels'], fetchLabels)
    const labels = labelsQuery.data
    return (
        <>
            <h2>Labels</h2>
            <ul>
                {labelsQuery.isLoading ? (
                    <p>...</p>
                ) : (
                    labels.map((label) => (
                        <li key={label.id} className={`label ${label.color}`}>
                            {label.name}
                        </li>
                    ))
                )}
            </ul>
        </>
    )
}

export default function App() {
    return (
        <div>
            <Menubar userId="u_2" />
            <main>
                <section>
                    <Issues />
                </section>
                <aside>
                    <Labels />
                </aside>
            </main>
        </div>
    )
}
