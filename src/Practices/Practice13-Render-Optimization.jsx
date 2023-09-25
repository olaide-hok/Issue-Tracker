import * as React from 'react'
import {useQuery} from 'react-query'
import {useRef} from 'react'

// Don't change this query function
let randomInteger = null
async function getData() {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
        randomInteger:
            randomInteger || (randomInteger = Math.floor(Math.random() * 100)),
        randomString: Math.random().toString(36).substring(7),
    }
}

export function useRenderCount() {
    const renderCount = useRef(0)
    renderCount.current += 1
    return renderCount.current
}

/**
 * You've been given an app which continuously loads data from a
 * server using the `getData` query function. Your objective is
 * to reduce the total render count for this component as low
 * as it can be. The minimum possible count is 2.
 */

export default function App() {
    const renderCount = useRenderCount()
    const query = useQuery(['data'], getData, {
        // Don't change this option
        refetchInterval: 1000,
        notifyOnChangeProps: ['isLoading', 'data'],
        select: (data) => data.randomInteger,
    })
    return (
        <div>
            <h1>Render Count: {renderCount}</h1>
            {query.isLoading ? (
                <p>Loading...</p>
            ) : (
                <p>Random Integer: {query.data}</p>
            )}
            <button onClick={() => window.location.reload()}>
                Reload the page
            </button>
        </div>
    )
}

function AppAns() {
    const renderCount = useRenderCount()
    const query = useQuery(['data'], getData, {
        // Don't change this option
        refetchInterval: 1000,
        notifyOnChangeProps: ['isLoading', 'data'],
        select: (data) => data.randomInteger,
    })
    return (
        <div>
            <h1>Render Count: {renderCount}</h1>
            {query.isLoading ? (
                <p>Loading...</p>
            ) : (
                <p>Random Integer: {query.data}</p>
            )}
            <button onClick={() => window.location.reload()}>
                Reload the page
            </button>
        </div>
    )
}
