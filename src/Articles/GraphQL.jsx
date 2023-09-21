const issuesGraphQLQuery = `
query Issues($repo: String!, $org:String!) {
  repository(name: $repo, owner: $org) {
    issues(first: 10) {
      nodes {
        number
        title
      }
    }
  }
}
`

async function fetchIssues({queryKey}) {
    const [issues, org, repo] = queryKey
    const request = await fetch(`https://api.github.com/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
            query: issuesGraphQLQuery,
            variables: {repo, org},
            operationName: 'Issues',
        }),
    })

    const json = await request.json()

    if (json.errors) {
        throw new Error(json.errors[0].message)
    }

    return json
}

async function fetchGithubGraphQL({queryKey}) {
    const [graphQLQuery, variables] = queryKey

    const request = await fetch(`https://api.github.com/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
            query: graphQLQuery,
            variables,
        }),
    })

    const json = await request.json()

    if (json.errors) {
        throw new Error(json.errors[0].message)
    }

    return json
}

import {GraphQLClient, gql} from 'graphql-request'

const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
        Authorization: `Bearer ${window.GITHUB_TOKEN}`,
    },
})

function fetchIssues({queryKey}) {
    const [graphQLQuery, variables] = queryKey

    return graphQLClient.request(graphQLQuery, variables)
}

function GraphQLIssues({org, repo}) {
    const issuesQuery = useQuery([issuesGraphQLQuery, {org, repo}], fetchIssues)
    // ...
}
