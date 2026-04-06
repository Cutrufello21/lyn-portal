export const DEMO_DELIVERIES = [
  { id: 1, patient: 'Margaret Thompson', address: '142 Oak Street', city: 'Fairlawn', zip: '44333', driver: 'Marcus Rivera', status: 'delivered', time: '1:12 PM', gps: { lat: 41.1278, lng: -81.6190 }, distance: 42, note: 'Front door' },
  { id: 2, patient: 'Robert Williams', address: '891 Maple Ave', city: 'Akron', zip: '44301', driver: 'Marcus Rivera', status: 'delivered', time: '1:34 PM', gps: { lat: 41.0856, lng: -81.5115 }, distance: 18, note: 'Left with patient', coldChain: true },
  { id: 3, patient: 'Dorothy Evans', address: '2200 State Rd', city: 'Cuyahoga Falls', zip: '44223', driver: 'Marcus Rivera', status: 'delivered', time: '1:58 PM', gps: { lat: 41.1339, lng: -81.4845 }, distance: 85, note: 'Back door' },
  { id: 4, patient: 'James Anderson', address: '567 Highland Ave', city: 'Akron', zip: '44302', driver: 'Marcus Rivera', status: 'pending', time: '\u2014' },
  { id: 5, patient: 'Patricia Moore', address: '1100 Portage Trail', city: 'Akron', zip: '44313', driver: 'Marcus Rivera', status: 'pending', time: '\u2014', coldChain: true },
  { id: 6, patient: 'William Davis', address: '330 W Market St', city: 'Akron', zip: '44303', driver: 'Angela Foster', status: 'delivered', time: '1:08 PM', gps: { lat: 41.0814, lng: -81.5280 }, distance: 33, note: 'Front door' },
  { id: 7, patient: 'Barbara Taylor', address: '45 Merriman Rd', city: 'Akron', zip: '44303', driver: 'Angela Foster', status: 'delivered', time: '1:29 PM', gps: { lat: 41.0790, lng: -81.5310 }, distance: 27, note: 'Mailbox' },
  { id: 8, patient: 'Richard Brown', address: '780 E Tallmadge Ave', city: 'Akron', zip: '44310', driver: 'Angela Foster', status: 'delivered', time: '1:52 PM', gps: { lat: 41.0910, lng: -81.4980 }, distance: 55, note: 'Left with patient', coldChain: true },
  { id: 9, patient: 'Mary Jackson', address: '1550 Sand Run Rd', city: 'Akron', zip: '44313', driver: 'Angela Foster', status: 'delivered', time: '2:18 PM', gps: { lat: 41.1050, lng: -81.5520 }, distance: 140, note: 'With neighbor' },
  { id: 10, patient: 'Charles White', address: '210 Ghent Rd', city: 'Fairlawn', zip: '44333', driver: 'Angela Foster', status: 'pending', time: '\u2014' },
  { id: 11, patient: 'Susan Harris', address: '920 N Main St', city: 'North Canton', zip: '44720', driver: 'Derek Simmons', status: 'delivered', time: '1:15 PM', gps: { lat: 40.8760, lng: -81.3910 }, distance: 22, note: 'Front door' },
  { id: 12, patient: 'Joseph Clark', address: '1445 Whipple Ave NW', city: 'Canton', zip: '44708', driver: 'Derek Simmons', status: 'delivered', time: '1:42 PM', gps: { lat: 40.8340, lng: -81.4250 }, distance: 38, note: 'Left with patient', coldChain: true },
  { id: 13, patient: 'Nancy Lewis', address: '603 12th St NW', city: 'Canton', zip: '44703', driver: 'Derek Simmons', status: 'delivered', time: '2:05 PM', gps: { lat: 40.8080, lng: -81.3920 }, distance: 65, note: 'Front door' },
  { id: 14, patient: 'Thomas Robinson', address: '2800 Tuscarawas St W', city: 'Canton', zip: '44708', driver: 'Derek Simmons', status: 'pending', time: '\u2014' },
  { id: 15, patient: 'Karen Walker', address: '188 Massillon Rd', city: 'Green', zip: '44232', driver: 'Rachel Kim', status: 'delivered', time: '1:22 PM', gps: { lat: 40.9450, lng: -81.4680 }, distance: 29, note: 'Back door' },
  { id: 16, patient: 'Daniel Young', address: '4100 S Arlington Rd', city: 'Akron', zip: '44312', driver: 'Rachel Kim', status: 'delivered', time: '1:48 PM', gps: { lat: 41.0230, lng: -81.4890 }, distance: 44, note: 'Front door' },
  { id: 17, patient: 'Betty King', address: '735 E Waterloo Rd', city: 'Akron', zip: '44306', driver: 'Rachel Kim', status: 'delivered', time: '2:11 PM', gps: { lat: 41.0420, lng: -81.4710 }, distance: 51, note: 'Left with patient', coldChain: true },
  { id: 18, patient: 'Ruth Nelson', address: '415 Grant St', city: 'Akron', zip: '44311', driver: "Brian O'Neill", status: 'failed', time: '2:45 PM', gps: { lat: 41.0680, lng: -81.4830 }, distance: 310, note: 'Patient not home', overridden: true },
]

export const PHARMACY_NAME = 'Giant Eagle Pharmacy'

export const DEMO_STATS = {
  total: 247,
  delivered: 219,
  pending: 24,
  failed: 4,
  totalTrend: '+12%',
  deliveredTrend: '+8%',
  pendingTrend: '-3%',
  failedTrend: '-2%',
}
