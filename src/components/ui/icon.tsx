/** Ícones inline. Um set só — não misture com outro. */
const paths = {
  search: ['M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4.2-4.2'],
  close: ['M6 6l12 12M18 6L6 18'],
  chevronLeft: ['M15 6l-6 6 6 6'],
  chevronRight: ['M9 6l6 6-6 6'],
  chevronDown: ['M6 9l6 6 6-6'],
  more: ['M6 12h.01M12 12h.01M18 12h.01'],
  sun: [
    'M12 4V2M12 22v-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M4 12H2M22 12h-2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  ],
  moon: ['M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z'],
  plus: ['M12 5v14M5 12h14'],
  inbox: ['M4 13h4l2 3h4l2-3h4M4 13 6 5h12l2 8v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5Z'],
  alert: [
    'M12 8v5M12 17h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  ],
  check: ['M4 12.5 9 17.5 20 6.5'],
  checkCircle: ['M9 12l2 2 4-4', 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'],
  pencil: ['M4 20h4L20 8a2.8 2.8 0 0 0-4-4L4 16v4Z'],
  trash: ['M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3'],
  external: ['M7 17 17 7M9 7h8v8'],
  comment: ['M21 12a8 8 0 0 1-8 8H4l2.3-2.3A8 8 0 1 1 21 12Z'],
  shield: ['M12 3 5 6v6c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6l-7-3Z'],
  at: ['M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z', 'M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-4 7.5'],
  briefcase: ['M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Z', 'M9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
  fields: ['M4 6h10M4 12h16M4 18h7'],
  notes: ['M5 4h9l5 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z', 'M14 4v5h5'],
  updates: ['M4 12a8 8 0 0 1 13.7-5.7L20 8M20 4v4h-4', 'M20 12a8 8 0 0 1-13.7 5.7L4 16M4 20v-4h4'],
  flag: ['M6 21V4M6 4h11l-2 4 2 4H6'],
} as const

export type IconName = keyof typeof paths

export function Icon({ name, className = 'size-4' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
