import * as React from 'react'
import {useQuery} from 'react-query'

async function fetchLabels() {
    // Don't change this fetch request
    const response = await fetch(
        'https://ui.dev/api/courses/react-query/labels',
        {
            headers: {
                'x-error': true,
            },
        }
    )

    // You can change how the error is handled here
    const results = await response.json()
    if (response.status >= 400) {
        throw new Error(
            `${
                results.error || 'An error has occurred'
            } - and this is a good thing!`
        )
    }
    return results
}

export default function App() {
    const labelsQuery = useQuery(['labels'], fetchLabels, {
        retry: false,
        onError: (error) => console.error(error),
    })

    return (
        <div>
            <h1>Labels</h1>
            {labelsQuery.isError && <p>{labelsQuery.error.message}</p>}
            {labelsQuery.isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {labelsQuery.data?.map((label) => (
                        <li key={label.id}>{label.name}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}
