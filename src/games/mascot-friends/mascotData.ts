export const PIECE_ID = 'piece-3'

export interface Mascot {
  name: string
  imageSrc: string
}

export interface Round {
  correct: Mascot
  wrong: [Mascot, Mascot, Mascot]
}

const fp = (filename: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=400`

export const ROUNDS: Round[] = [
  {
    correct: { name: 'Gritty', imageSrc: fp('Philadelphia_Flyers_mascot_Gritty.jpg') },
    wrong: [
      { name: 'Mr. Met', imageSrc: fp('Mr-met-mrs-met.jpg') },
      { name: 'Wally', imageSrc: fp('Wally_the_green_monster.jpg') },
      { name: 'Dinger', imageSrc: fp('Rockiesdinger.JPG') },
    ],
  },
  {
    correct: { name: 'Swoop', imageSrc: fp('Philadelphia_Eagles_Mascot_Swoop.jpg') },
    wrong: [
      { name: 'Sluggerrr', imageSrc: fp('Sluggerrr_(Kansas_City_Royals).jpg') },
      { name: 'Orbit', imageSrc: fp('Orbit_Houston_Astros_mascot_preseason_2014.jpg') },
      { name: 'Southpaw', imageSrc: fp('Southpaw.jpg') },
    ],
  },
  {
    correct: { name: 'Franklin', imageSrc: fp('Franklin_the_Dog.jpg') },
    wrong: [
      { name: 'Slider', imageSrc: fp('Slider_(26509880777).jpg') },
      { name: 'Baxter', imageSrc: fp('Smokey_Bear_and_Baxter_the_Bobcat_pose_for_a_photo_(53137160851).jpg') },
      { name: 'Blooper', imageSrc: fp('Blooper_Braves_mascot,_Sept_18,_2018.jpg') },
    ],
  },
]
