// Sample peer-learning board. 1 credit = 1 hour of someone's time.
// taught = sessions already given. votes and sum = learner ratings so far (1 to 5 stars).
export const OFFERS = [
  { id: 'o1', skill: 'C programming basics', by: 'Neha, Comp-B', slot: 'Sat, 4 pm', taught: 14, votes: 9, sum: 42 },
  { id: 'o2', skill: 'Maths: matrices and differentiation', by: 'Rohan, IT-A', slot: 'Sun, 11 am', taught: 6, votes: 2, sum: 10 },
  { id: 'o3', skill: 'Photoshop for posters', by: 'Isha, EXTC-A', slot: 'Fri, 5 pm', taught: 9, votes: 6, sum: 26 },
  { id: 'o4', skill: 'Physics: wave optics', by: 'Kabir, Comp-C', slot: 'Wed, 3 pm', taught: 3, votes: 0, sum: 0 },
]
export const WANTS = [
  { id: 'w1', skill: 'Python basics', by: 'Meera, IT-B' },
  { id: 'w2', skill: 'Chemistry: polymers', by: 'Sahil, AIDS-A' },
  { id: 'w3', skill: 'Video editing', by: 'Tanya, Comp-A' },
]

// A rank is rough until this many learners have rated.
export const FIRM_VOTES = 5
// Every teacher starts as if they had 3 ratings of 4 stars, so one early 5-star
// rating cannot put someone at the top. Real ratings take over as they arrive.
const PRIOR_VOTES = 3
const PRIOR_AVG = 4

// `ratings` holds this student's own rating (1 to 5) per offer id.
export function rankTeachers(offers, ratings) {
  return offers
    .map((o) => {
      const mine = ratings[o.id] || 0
      const votes = o.votes + (mine ? 1 : 0)
      const sum = o.sum + mine
      return {
        ...o,
        votes,
        avg: votes ? sum / votes : null,
        score: (sum + PRIOR_AVG * PRIOR_VOTES) / (votes + PRIOR_VOTES),
        firm: votes >= FIRM_VOTES,
        mine,
      }
    })
    .sort((a, b) => b.score - a.score || b.taught - a.taught)
    .map((o, i) => ({ ...o, rank: i + 1 }))
}
