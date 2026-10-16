// Every module of the app. Set built: true when a module is finished.
export const MODULES = [
  { path: '/planner', label: 'Planner', icon: 'plan', group: 'Study', built: true },
  { path: '/focus', label: 'Focus timer', icon: 'timer', group: 'Study', built: true },
  { path: '/library', label: 'Library', icon: 'book', group: 'Study', built: true },
  { path: '/pyq', label: 'PYQs', icon: 'file', group: 'Study', built: true },
  { path: '/calendar', label: 'Calendar and events', icon: 'cal', group: 'Campus', built: true },
  { path: '/map', label: 'Who to contact', icon: 'pin', group: 'Campus', built: true },
  { path: '/rides', label: 'Rides', icon: 'car', group: 'Campus', built: true },
  { path: '/challenges', label: 'Challenges', icon: 'cup', group: 'Community', built: true },
  { path: '/peer', label: 'Peer learning', icon: 'users', group: 'Community', built: true },
]
export const GROUPS = ['Study', 'Campus', 'Community']
