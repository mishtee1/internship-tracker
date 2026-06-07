const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPES = 'https://www.googleapis.com/auth/calendar.events'

let tokenClient = null
let accessToken = null

export function initGoogle() {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
          accessToken = response.access_token
        },
      })
      resolve()
    }
    document.head.appendChild(script)
  })
}

export function signIn() {
  return new Promise((resolve, reject) => {
    if (!tokenClient) { reject('Google not initialized'); return }
    tokenClient.callback = (response) => {
      if (response.error) { reject(response.error); return }
      accessToken = response.access_token
      resolve(accessToken)
    }
    tokenClient.requestAccessToken()
  })
}

export function signOut() {
  if (accessToken) {
    window.google.accounts.oauth2.revoke(accessToken)
    accessToken = null
  }
}

export function isSignedIn() {
  return !!accessToken
}

export async function createCalendarEvent(event) {
  if (!accessToken) throw new Error('Not signed in')
  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })
  return response.json()
}

export async function getUpcomingEvents() {
  if (!accessToken) throw new Error('Not signed in')
  const now = new Date().toISOString()
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=10&singleEvents=true&orderBy=startTime`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  )
  const data = await response.json()
  return data.items || []
}