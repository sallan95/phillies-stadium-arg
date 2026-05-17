export const PIECE_ID = 'piece-1'

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
  hint: string
}

export const QUESTIONS: QuizQuestion[] = [
  {
    question: 'What color are most of the seats in the stadium?',
    options: ['Red', 'Blue', 'Green', 'Orange'],
    correctAnswer: 'Red',
    hint: 'Look around — the seats are all the same color!',
  },
  {
    question: 'What famous American symbol is featured beyond the outfield wall?',
    options: ['Liberty Bell', 'Bald Eagle', 'Statue of Liberty', 'Independence Hall'],
    correctAnswer: 'Liberty Bell',
    hint: 'Look out past center field — it\'s a symbol of Philadelphia!',
  },
  {
    question: 'What is the name of the Phillies mascot?',
    options: ['Phillie Phanatic', 'Slugger', 'The Philly', 'Captain Red'],
    correctAnswer: 'Phillie Phanatic',
    hint: 'He\'s green, furry, and loves to dance — you\'ve probably already seen him today!',
  },
  {
    question: 'What color is on the Phillies\' home jersey?',
    options: ['Red', 'Blue', 'Green', 'Purple'],
    correctAnswer: 'Red',
    hint: 'Check out the players on the field — what color stands out most?',
  },
]
