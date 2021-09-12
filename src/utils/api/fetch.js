const API_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL
  : "https://api-staging.myarchery.id"

export default function resource(endpoint, config) {
  return fetch(API_URL + endpoint, config)
    .then(async response => {
      const responseObject = await response.json()
      responseObject.success = response.ok
      return responseObject
    })
    .catch(error => {
      return { message: JSON.stringify(error) }
    })
}