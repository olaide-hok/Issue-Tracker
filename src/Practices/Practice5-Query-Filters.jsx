import React from 'react'
import {useQuery, useQueryClient} from 'react-query'

/**
 * Using the three query functions below, create three queries.
 * Render the loading state and data for each of the queries. Include
 * buttons next to each result which invalidate the corresonding query.
 *
 * Also include a button which invalidates all the queries. It should only
 * call `invalidateQueries` once using a query filter.
 */
async function randomDecimal() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Math.random()
}
async function randomInteger() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Math.floor(Math.random() * 100)
}
async function randomString() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Math.random().toString(36).substring(7)
}

export default function App() {
    const queryClient = useQueryClient()

    const randomDecimalResult = useQuery(['randomDecimal'], randomDecimal)
    const randomIntegerResult = useQuery(['randomInteger'], randomInteger)
    const randomStringResult = useQuery(['randomString'], randomString)

    return (
        <div>
            <p>
                {randomDecimalResult.isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <strong>Random Decimal: {randomDecimalResult.data}</strong>
                )}
                <button
                    onClick={() => {
                        queryClient.invalidateQueries(['randomDecimal'])
                    }}>
                    Invalidate
                </button>
            </p>
            <p>
                {randomIntegerResult.isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <strong>Random Integer: {randomIntegerResult.data}</strong>
                )}
                <button
                    onClick={() => {
                        queryClient.invalidateQueries(['randomInteger'])
                    }}>
                    Invalidate
                </button>
            </p>
            <p>
                {randomStringResult.isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <strong>Random String: {randomStringResult.data}</strong>
                )}
                <button
                    onClick={() => {
                        queryClient.invalidateQueries(['randomString'])
                    }}>
                    Invalidate
                </button>
            </p>
            <InvalidateButton />
        </div>
    )
}

function InvalidateButton() {
    const queryClient = useQueryClient()

    return (
        <button
            onClick={() => {
                queryClient.invalidateQueries()
            }}>
            Invalidate All
        </button>
    )
}

// Solution
export function AppAnswer() {
    const decimalQuery = useQuery(['random', 'decimal'], randomDecimal, {
        staleTime: 3000,
    })
    const integerQuery = useQuery(['random', 'integer'], randomInteger, {
        staleTime: 5000,
    })
    const stringQuery = useQuery(['random', 'string'], randomString, {
        staleTime: 10000,
    })
    return (
        <div>
            <p>
                <strong>Random Decimal:</strong>{' '}
                {decimalQuery.isLoading ? 'Loading...' : decimalQuery.data}{' '}
                <button
                    onClick={() => {
                        decimalQuery.refetch()
                    }}>
                    Invalidate
                </button>
            </p>
            <p>
                <strong>Random Integer:</strong>{' '}
                {integerQuery.isLoading ? 'Loading...' : integerQuery.data}{' '}
                <button
                    onClick={() => {
                        integerQuery.refetch()
                    }}>
                    Invalidate
                </button>
            </p>
            <p>
                <strong>Random String:</strong>{' '}
                {stringQuery.isLoading ? 'Loading...' : stringQuery.data}{' '}
                <button
                    onClick={() => {
                        stringQuery.refetch()
                    }}>
                    Invalidate
                </button>
            </p>
            <InvalidateButtonAnswer />
        </div>
    )
}

function InvalidateButtonAnswer() {
    const queryClient = useQueryClient()
    return (
        <button
            onClick={() => {
                queryClient.invalidateQueries(['random'])
            }}>
            Invalidate All
        </button>
    )
}
