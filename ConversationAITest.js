//  open terminal and run "node ConversationAITest.js"

const fs = require('fs')
const fetch = require('node-fetch')

const fetchFileData = async (url) => {
  const data = await fetch(url).then((response) => response.text())
  return data
}

const fetchWordsDetailsFromAPI = async (word) => {
  const key =
    'dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9'

  const url = new URL(
    'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=' + key
  )
  url.searchParams.append('lang', 'en-en')
  url.searchParams.append('text', word)

  return await fetch(url).then((res) => res.json())
}

const getWordsDetails = async (words) => {
  const wordDetails = []
  for (word of words) {
    const data = await fetchWordsDetailsFromAPI(word[0])
    let dataObj = {}
    if (data !== null && data.def !== null && data.def.length > 0) {
      const { tr, text } = data.def[0]
      dataObj.Word = text
      dataObj.Count = word[1]
      dataObj.Synonyms = tr[0].syn ? tr[0].syn[0].text : tr[0].text
      dataObj.Pos = tr[0].pos
    } else {
      dataObj.Word = word[0]
      dataObj.Count = word[1]
      dataObj.Synonyms = 'N/A'
      dataObj.Pos = 'N/A'
    }
    wordDetails.push(dataObj)
  }
  return wordDetails
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

const hashWords = async (textData) => {
  console.time('check time:')
  const wordDict = {}
  const wordsData = []

  const words = textData
    .split(' ')
    .map((word) => {
      let temp = word.split('\n')
      return temp.filter((i) => i !== '')
    })
    .filter((word) => word != '')

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
  return await getWordsDetails(topTenWords)
}

const solution = async () => {
  const url = 'http://norvig.com/big.txt'
  const textData = await fetchFileData(url)
  const output = await hashWords(textData)
  console.log('output', output)
}

solution()
