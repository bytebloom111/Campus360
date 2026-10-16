const PATHS = {
  home: '<path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15V15H9v5.5H5.5A1.5 1.5 0 0 1 4 19z"/>',
  cal: '<rect x="4" y="5" width="16" height="15" rx="3.5"/><path d="M4 10h16M8 3v3.5M16 3v3.5M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01"/>',
  plan: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12h.01M12 3.5V1.5M20.5 12h2"/>',
  timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 1.5M9.5 3h5M18.6 6.4l1.4-1.4"/>',
  pin: '<path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 0 0-13 0c0 5.4 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  car: '<path d="M4 17v2M20 17v2M3.5 17h17v-4.3a2 2 0 0 0-.4-1.2L18 8.3A2 2 0 0 0 16.4 7.5H7.6A2 2 0 0 0 6 8.3L3.9 11.5a2 2 0 0 0-.4 1.2z"/><path d="M3.8 11.5h16.4M7.5 14.2h.01M16.5 14.2h.01"/>',
  cup: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.8v1.2A3.2 3.2 0 0 0 8 10.4M16 6h3.2v1.2a3.2 3.2 0 0 1-3.2 3.2M12 13v4M8.5 20.5h7M10 17h4"/>',
  book: '<path d="M12 6.8C10.4 5.3 8 4.7 4.5 4.7v12.8c3.5 0 5.9.6 7.5 2.1 1.6-1.5 4-2.1 7.5-2.1V4.7c-3.5 0-5.9.6-7.5 2.1zM12 6.8v12.8"/>',
  users: '<circle cx="9" cy="8.5" r="3.3"/><path d="M3 19.5a6 6 0 0 1 12 0M16 5.4a3.3 3.3 0 0 1 0 6.2M18 14.2a5.6 5.6 0 0 1 3 5.3"/>',
  file: '<path d="M6.5 3h7l4.5 4.5V20a1 1 0 0 1-1 1h-10.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM13.5 3v4.5H18M9 12.5h6M9 16h6"/>',
  user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
}

export default function Icon({ name, size = 22 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
    />
  )
}
