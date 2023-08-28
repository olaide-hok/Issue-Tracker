import * as React from 'react'
import {useQuery} from 'react-query'

/**
 * Write a query which fetches from the
 * `https://ui.dev/api/courses/react-query/users/:userId`
 * endpoint using the provided user ID.
 *
 * Use the return value of that query to render a profile
 * picture.
 *
 * Provide placeholder data so the query will render a
 * placeholder image while the query loads.
 *
 * Hint: https://unsplash.it/200 is a good generic profile
 * picture URL.
 */

async function fetchUser(userId) {
    return fetch(`https://ui.dev/api/courses/react-query/users/${userId}`).then(
        (res) => res.json()
    )
}

export default function UserProfilePicture({userId}) {
    const userQuery = useQuery(['user', userId], () => fetchUser(userId), {
        placeholderData: {
            profilePictureUrl: 'https://unsplash.it/200 ',
        },
    })
    const user = userQuery.data

    return (
        <div>
            {userQuery.isLoading ? null : (
                <img src={user.profilePictureUrl} alt={user.name} />
            )}
        </div>
    )
}

//Course Solution

async function fetchUserAns(userId) {
  return fetch(
    `https://ui.dev/api/courses/react-query/users/${userId}`
  ).then((res) => res.json());
}

export default function UserProfilePictureAns({ userId }) {
  const userQuery = useQuery(["user", userId], () => fetchUserAns(userId), {
    placeholderData: {
      id: "placeholder",
      name: "Placeholder",
      profilePictureUrl: "https://unsplash.it/200"
    }
  });

  return (
    //No need of a loading state since their is a placeholder data object
    <img src={userQuery.data.profilePictureUrl} alt={userQuery.data.name} />
  );
}
