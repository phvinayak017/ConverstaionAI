const fs = require('fs')
const fetch = require('node-fetch')

const fetchFileData = async (url) => {
  const data = await fetch(url).then((response) => response.text())
  return data
}

const cleanWords = (word) => {
  const re = /^[a-z]+$/i
  let str = ''
  for (let c of word) {
    if (re.test(c)) {
      str = str + c
    }
  }
  return str
}

const hashWords = (textData) => {
  console.time('check time:')
  const wordDict = {}
  const wordsData = []

  // const data = `*****These eBooks Were Prepared By Thousands\nwordss of Volunteers!***** Doyle)\n\nCopyright redistributing\nthis permission.\n\nPlease
  //   'The',                 'Project',               'Gutenberg',
  // 'EBook',               'of',                    'The',
  // 'Adventures',          'of',                    'Sherlock',
  // 'Holmes\nby',          'Sir',                   'Arthur',
  // 'Conan',               'Doyle\n(#15',           'in',
  // 'our',                 'series',                'by',
  // 'Sir',                 'Arthur',                'Conan',
  // 'Doyle)\n\nCopyright', 'laws',                  'are',
  // 'changing',            'all',                   'over',
  // 'the',                 'world.',                'Be',
  // 'sure',                'to',                    'check',
  // 'the\ncopyright',      'laws',                  'for',
  // 'your',                'country',               'before',
  // 'downloading',         'or',                    'redistributing\nthis',
  // 'or',                  'any',                   'other',
  // 'Project',             'Gutenberg',             'eBook.\n\nThis',
  // 'header',              'should',                'be',
  // 'the',                 'first',                 'thing',
  // 'seen',                'when',                  'viewing',
  // 'this',                'Project\nGutenberg',    'file.',
  // 'Please',              'do',                    'not',
  // 'remove',              'it.',                   'Do',
  // 'not',                 'change',                'or',
  // 'edit',                'the\nheader',           'without',
  // 'written',             'permission.\n\nPlease', 'read',
  // 'the',                 '"legal',                'small',
  // 'print,"',             'and',                   'other',

  //   `
  const words = textData
    .split(' ')
    .map((word) => {
      let temp = word.split('\n')
      return temp.filter((i) => i !== '')
    })
    .filter((word) => word != '')

  console.log('words-----', words)
  for (word of words) {
    wordsData.push(...word)
  }

  const wordsList = wordsData.map((word) => {
    const pureWordREG = /^[a-zA-Z]+$/g
    let pureWord
    if (!pureWordREG.test(word)) {
      pureWord = cleanWords(word)
    } else {
      pureWord = word
    }
    return pureWord.toLowerCase()
  })

  // .filter((word) => word != '')
  // .map((word) => {
  //   let temp = word.split('\n')
  //   return [...temp]
  // })
  // console.timeEnd('check time:')
  console.log('words=', wordsList)

  for (let word of wordsList) {
    if (!wordDict[word]) {
      wordDict[word] = 1
    } else {
      wordDict[word]++
    }
  }

  const topTenWords = Object.entries(wordDict)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 11)
  console.log(topTenWords)
}

const solution = async () => {
  const url = 'http://norvig.com/big.txt'
  const textData = await fetchFileData(url)
  hashWords()
}

const out = solution()

// const i = 'Volunteers!*****'
// const i = 'Thousands'
// cleanWords(i)
