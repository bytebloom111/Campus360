// Sample catalogue. Replace with the real library system later.
export const BOOKS = [
  { id: 'b1', title: 'Engineering Mathematics I', author: 'B. S. Grewal', subject: 'Maths', copies: 4, out: 3 },
  { id: 'b2', title: 'Higher Engineering Mathematics', author: 'B. V. Ramana', subject: 'Maths', copies: 3, out: 1 },
  { id: 'b3', title: 'Concepts of Physics', author: 'H. C. Verma', subject: 'Physics', copies: 5, out: 5 },
  { id: 'b4', title: 'Engineering Physics', author: 'Gaur and Gupta', subject: 'Physics', copies: 3, out: 0 },
  { id: 'b5', title: 'Engineering Chemistry', author: 'Jain and Jain', subject: 'Chemistry', copies: 4, out: 2 },
  { id: 'b6', title: 'Organic Chemistry Basics', author: 'Morrison and Boyd', subject: 'Chemistry', copies: 2, out: 2 },
  { id: 'b7', title: 'Let Us C', author: 'Yashavant Kanetkar', subject: 'Programming', copies: 6, out: 4 },
  { id: 'b8', title: 'Programming in ANSI C', author: 'E. Balagurusamy', subject: 'Programming', copies: 4, out: 1 },
  { id: 'b9', title: 'Head First Java', author: 'Sierra and Bates', subject: 'Programming', copies: 3, out: 3 },
  { id: 'b10', title: 'Basic Electrical Engineering', author: 'V. K. Mehta', subject: 'Electrical', copies: 3, out: 0 },
]
export const MAX_RESERVE = 3
export const HOLD_MS = 2 * 864e5
export const availableCount = (b, mine) => Math.max(0, b.copies - b.out - (mine ? 1 : 0))
