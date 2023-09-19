import {Fragment} from 'react'
import {QueryClient, QueryClientProvider, useInfiniteQuery} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'

const fetchInfiniteIssues = async ({queryKey, pageParam = 1}) => {
    const [issues, org, repo] = queryKey
    console.log('Fetching', org, repo, pageParam)
    const response = await fetch(
        `https://api.github.com/repos/${org}/${repo}/issues?page=${pageParam}`
    )

    const json = await response.json()
    return json
}

const Issue = ({issue: {title}}) => {
    return <h4>{title}</h4>
}
const InfiniteIssues = () => {
    const issuesInfiniteQuery = useInfiniteQuery(
        ['issues', 'facebook', 'react'],
        fetchInfiniteIssues,
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.length === 0) {
                    return
                }
                return pages.length + 1
            },
        }
    )

    if (issuesInfiniteQuery.isLoading) return <p>Loading...</p>

    return (
        <div>
            {issuesInfiniteQuery.data.pages.map((page, index) => (
                <Fragment key={index}>
                    {page.map((issue) => (
                        <Issue key={issue.id} issue={issue} />
                    ))}
                </Fragment>
            ))}
            <button
                onClick={() => issuesInfiniteQuery.fetchNextPage()}
                disabled={
                    !issuesInfiniteQuery.hasNextPage ||
                    issuesInfiniteQuery.isFetchingNextPage
                }>
                {issuesInfiniteQuery.isFetchingNextPage
                    ? 'Loading Next Page...'
                    : 'Load More'}
            </button>
        </div>
    )
}

const queryClient = new QueryClient()

export default function App() {
    return (
        // Provide the client to your App
        <QueryClientProvider client={queryClient}>
            <InfiniteIssues />
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}
