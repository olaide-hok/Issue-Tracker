import * as React from 'react'
import {useQuery, useQueryClient} from 'react-query'

/**
 * You've been provided with a template that renders
 * a single page of issues data. Update the query and
 * query function to support pagination. The API for
 * fetching pages is
 * "https://ui.dev/api/courses/react-query/issues?limit=:perPage&page=:pageNum"
 *
 * You'll also need to create a pagination component
 * for moving from page to page. It should show the
 * current page, and a next and previous button. The
 * next and previous buttons should be be disabled
 * when the user is on the first or last page.
 *
 * Automatically pre-fetch the next page of
 * data when the current page is done loading.
 */

async function fetchIssues(perPage, pageNum) {
    return fetch(
        `https://ui.dev/api/courses/react-query/issues?limit=${perPage}&page=${pageNum}`
    ).then((res) => res.json())
}
export function App() {
    const queryClient = useQueryClient()
    const [pageNum, setPageNum] = React.useState(1)
    const perPage = 10
    const issuesQuery = useQuery(
        ['issues', {pageNum}],
        () => fetchIssues(perPage, pageNum),
        {keepPreviousData: true}
    )

    React.useEffect(() => {
        queryClient.prefetchQuery(
            ['issues', {pageNum: pageNum + 1, perPage}],
            fetchIssues(perPage, pageNum)
        )
    }, [pageNum, perPage, queryClient])
    return (
        <div>
            <h1>Issues</h1>
            {issuesQuery.isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {issuesQuery.data.map((issue) => (
                        <li key={issue.id}>{issue.title}</li>
                    ))}
                </ul>
            )}
            <div className="pagination">
                {/* Create a pagination component here */}
                <button
                    onClick={() => setPageNum((pageNum) => pageNum - 1)}
                    disabled={pageNum === 1}>
                    Previous
                </button>
                <p>
                    Page {pageNum} {issuesQuery.isFetching ? '...' : ''}
                </p>
                <button
                    onClick={() => setPageNum((pageNum) => pageNum + 1)}
                    disabled={
                        !issuesQuery.data ||
                        issuesQuery.data.length === 0 ||
                        issuesQuery.isPreviousData
                    }>
                    Next
                </button>
            </div>
        </div>
    )
}

// Solution

async function fetchIssuesAns(page = 1) {
    return fetch(
        `https://ui.dev/api/courses/react-query/issues?limit=10&page=${page}`
    ).then((res) => res.json())
}

export default function AppAns() {
    const [page, setPage] = React.useState(1)
    const issuesQuery = useQuery(
        ['issues', {page}],
        () => fetchIssuesAns(page),
        {
            keepPreviousData: true,
        }
    )

    const queryClient = useQueryClient()
    React.useEffect(() => {
        queryClient.prefetchQuery(['issues', {page: page + 1}], () =>
            fetchIssues(page + 1)
        )
    }, [page, queryClient])
    return (
        <div>
            <h1>Issues</h1>
            {issuesQuery.isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {issuesQuery.data.map((issue) => (
                        <li key={issue.id}>{issue.title}</li>
                    ))}
                </ul>
            )}
            <div className="pagination">
                <button
                    onClick={() => setPage((page) => page - 1)}
                    disabled={page === 1}>
                    Previous
                </button>
                <p>
                    Page {page}
                    {issuesQuery.isFetching ? '...' : ''}
                </p>
                <button
                    onClick={() => setPage((page) => page + 1)}
                    disabled={issuesQuery.data?.length < 10}>
                    Next
                </button>
            </div>
        </div>
    )
}
