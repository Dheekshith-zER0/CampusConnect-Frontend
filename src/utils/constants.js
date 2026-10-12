// Must match the enums in the backend (ComplaintCategory / ComplaintStatus)
export const CATEGORIES = [
  { value: 'INFRASTRUCTURE', label: 'Infrastructure', icon: '🏗️', hint: 'Buildings, furniture, roads, doors' },
  { value: 'ELECTRICITY', label: 'Electricity', icon: '⚡', hint: 'Power cuts, lights, fans, sockets' },
  { value: 'WATER_SUPPLY', label: 'Water Supply', icon: '🚰', hint: 'Leaks, drinking water, plumbing' },
  { value: 'CLEANLINESS', label: 'Cleanliness', icon: '🧹', hint: 'Washrooms, garbage, hygiene' },
  { value: 'WIFI_INTERNET', label: 'Wi-Fi and Internet', icon: '📶', hint: 'Connectivity, speed, access' },
  { value: 'CLASSROOM_LAB', label: 'Classroom or Laboratory Issues', icon: '🔬', hint: 'Projectors, equipment, seating' },
  { value: 'OTHER', label: 'Other Campus Issues', icon: '📌', hint: 'Anything else on campus' },
]

export const STATUSES = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'REJECTED', label: 'Rejected' },
]

export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics and Communication',
  'Electrical',
  'Mechanical',
  'Civil',
  'Chemical',
  'Biotechnology',
  'Management',
  'Science and Humanities',
]

export function categoryOf(value) {
  return CATEGORIES.find((c) => c.value === value) || CATEGORIES[CATEGORIES.length - 1]
}
