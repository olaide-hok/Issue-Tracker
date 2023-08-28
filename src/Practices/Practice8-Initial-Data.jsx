import * as React from 'react'
import {useQuery} from 'react-query'

const staticLabels = [
    {id: 1, name: 'bug', color: 'red'},
    {id: 2, name: 'duplicate', color: 'orange'},
    {id: 3, name: 'enhancement', color: 'yellow'},
]

async function loadLabels() {
    return fetch('https://ui.dev/api/courses/react-query/labels').then((res) =>
        res.json()
    )
}
export default function Labels() {
    const labelsQuery = useQuery(['labels'], loadLabels, {
        initialData: staticLabels,
    })
    return (
        <ul>
            {labelsQuery.data.map((label) => (
                <li key={label.id} style={{color: label.color}}>
                    {label.name}
                </li>
            ))}
        </ul>
    )
}
