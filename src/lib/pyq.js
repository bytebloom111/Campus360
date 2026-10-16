// Previous year papers. Add a real file link in `url` and the Open button appears.
const YEARS = [2025, 2024, 2023, 2022]
export const PYQ_SUBJECTS = ['Maths', 'Physics', 'Chemistry', 'Programming']
export const PAPERS = PYQ_SUBJECTS.flatMap((s) =>
  YEARS.map((y) => ({ id: `${s}-${y}`, subject: s, year: y, exam: `Sem 1, ${y}`, marks: 60, url: '' })),
)
// How many of the last 4 papers asked each topic (sample data).
export const TOPICS = {
  Maths: [['Matrices', 4], ['Differentiation', 4], ['Complex numbers', 3], ['Partial derivatives', 3], ['Series', 2]],
  Physics: [['Wave optics', 4], ['Quantum basics', 3], ['Lasers', 3], ['Semiconductors', 2]],
  Chemistry: [['Water treatment', 4], ['Polymers', 3], ['Corrosion', 3], ['Fuels', 2]],
  Programming: [['Loops and arrays', 4], ['Functions', 4], ['Pointers', 3], ['Strings', 3], ['Structures', 2]],
}
