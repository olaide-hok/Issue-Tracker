import * as React from 'react'
import {useInfiniteQuery} from 'react-query'

/**
 * You are starting with the solution to the previous
 * pagination practice. Convert this normal pagination
 * to use infinite pagination.
 *
 * You can remove the pagination buttons and use a
 * "Load more" button to load more data.
 *
 * There is no need to implement bi-directional
 * pagination, scroll-to-bottom triggers or
 * virtualized lists.
 */

async function fetchIssues({queryKey, pageParam = 1}) {
    const [issues] = queryKey
    return fetch(
        `https://ui.dev/api/courses/react-query/issues?limit=10&page=${pageParam}`
    ).then((res) => res.json())
}
export default function App() {
    const issuesQuery = useInfiniteQuery(['issues'], fetchIssues, {
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length === 0) {
                return
            }
            return pages.length + 1
        },
    })

    return (
        <div>
            <h1>Issues</h1>
            {issuesQuery.isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {issuesQuery.data.pages.map((page, index) => (
                        <React.Fragment key={index}>
                            {page.map((issue) => (
                                <li key={issue.id}>{issue.title}</li>
                            ))}
                        </React.Fragment>
                    ))}
                </ul>
            )}
            <div className="pagination">
                <button
                    onClick={() => issuesQuery.fetchNextPage()}
                    disabled={
                        !issuesQuery.hasNextPage ||
                        issuesQuery.isFetchingNextPage
                    }>
                    {issuesQuery.isFetchingNextPage
                        ? 'Loading Next Page...'
                        : 'Load More'}
                </button>
            </div>
        </div>
    )
}

// Solution

async function fetchIssuesAns({pageParam = 1}) {
    return fetch(
        `https://ui.dev/api/courses/react-query/issues?limit=10&page=${pageParam}`
    ).then((res) => res.json())
}
export function AppAns() {
    const issuesQuery = useInfiniteQuery(['issues'], fetchIssuesAns, {
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length < 10) return
            return pages.length + 1
        },
    })

    return (
        <div>
            <h1>Issues</h1>
            {issuesQuery.isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {issuesQuery.data.pages.map((page) =>
                        page.map((issue) => (
                            <li key={issue.id}>{issue.title}</li>
                        ))
                    )}
                </ul>
            )}
            <div className="pagination">
                {issuesQuery.hasNextPage && (
                    <button
                        onClick={() => issuesQuery.fetchNextPage()}
                        disabled={issuesQuery.isFetchingNextPage}>
                        {issuesQuery.isFetchingNextPage
                            ? 'Fetching...'
                            : 'Fetch More'}
                    </button>
                )}
            </div>
        </div>
    )
}
