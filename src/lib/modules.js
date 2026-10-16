// Every module of the app. Set built: true when a module is finished.
export const MODULES = [
  { path: '/planner', label: 'Planner', icon: 'plan', group: 'Study', built: true },
  { path: '/focus', label: 'Focus timer', icon: 'timer', group: 'Study', built: false },
  { path: '/library', label: 'Library', icon: 'book', group: 'Study', built: false },
  { path: '/pyq', label: 'PYQs', icon: 'file', group: 'Study', built: false },
  { path: '/calendar', label: 'Calendar and events', icon: 'cal', group: 'Campus', built: false },
  { path: '/map', label: 'Who to contact', icon: 'pin', group: 'Campus', built: false },
  { path: '/rides', label: 'Rides', icon: 'car', group: 'Campus', built: false },
  { path: '/challenges', label: 'Challenges', icon: 'cup', group: 'Community', built: false },
  { path: '/peer', label: 'Peer learning', icon: 'users', group: 'Community', built: false },
]
export const GROUPS = ['Study', 'Campus', 'Community']
