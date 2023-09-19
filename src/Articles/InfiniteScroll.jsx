import {Fragment, useRef, useEffect} from 'react'
import {QueryClient, QueryClientProvider, useInfiniteQuery} from 'react-query'

function useScrollToBottomAction(container, callback, offset = 0) {
    const callbackRef = useRef(callback)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        const handleScroll = () => {
            let scrollContainer =
                container === document ? document.scrollingElement : container
            if (
                scrollContainer.scrollTop + scrollContainer.clientHeight >=
                scrollContainer.scrollHeight - offset
            ) {
                callbackRef.current()
            }
        }

        container.addEventListener('scroll', handleScroll)

        return () => {
            container.removeEventListener('scroll', handleScroll)
        }
    }, [container, offset])
}

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
            getNextPageParam: (firstPage, pages) => {
                if (firstPage.length === 0) {
                    return
                }
                return pages.length + 1
            },
        }
    )

    useScrollToBottomAction(
        document,
        () => {
            if (issuesInfiniteQuery.isFetchingNextPage) return
            issuesInfiniteQuery.fetchNextPage()
        },
        500
    )

    if (issuesInfiniteQuery.isLoading) return 'Loading...'

    return (
        <div>
            {issuesInfiniteQuery.data.pages.map((page, index) => (
                <Fragment key={index}>
                    {page?.map((issue) => (
                        <Issue key={issue.id} issue={issue} />
                    ))}
                </Fragment>
            ))}
            {issuesInfiniteQuery.isFetchingNextPage && (
                <div>Loading Next Page...</div>
            )}
        </div>
    )
}

const queryClient = new QueryClient()

export default function App() {
    return (
        // Provide the client to your App
        <QueryClientProvider client={queryClient}>
            <InfiniteIssues />
        </QueryClientProvider>
    )
}
