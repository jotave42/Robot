const algorithmia = require('algorithmia')
const algorithmApiKey = require('../credentials/credentials.json').apiKey
const sentenceBounderyDetection =  require('sbd')

const watsonApikey = require('../credentials/watson-nlu.json').apikey
const watsonURL = require('../credentials/watson-nlu.json').url
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')
const nlu = new NaturalLanguageUnderstandingV1 ({
    iam_apikey: watsonApikey,
    version: '2018-04-05',
    url:watsonURL,
})

const state = require('./state.js')

async function robot(){
    content = state.load()
    console.log('Recebi com sucesso o contente: '+ content.searchTerm)
     
    await fetchContentFromWikiPedia(content)   
    sanitizeContent(content)
    breakContentIntoSentences(content)
    limitMaximunSentences(content)
    await fetchKeywordsOfAllSentences(content)

    state.save(content)

    async function fetchContentFromWikiPedia(content){
        const algorithmiaAuthenticated = algorithmia(algorithmApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const WikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const WikipediaContent = WikipediaResponse.get()
        content.sourceContentOriginal = WikipediaContent.content

    }
    function sanitizeContent(content){

        
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)
    
        content.sourceContentSanitized = withoutDatesInParentheses
    

        function removeBlankLinesAndMarkdown(texts){
            console.log(texts)
            const allLines = texts.split('\n')
            const withoutBlankLinesAndMarkDown = allLines.filter((line) =>{
                if(line.trim().length === 0 || line.trim().startsWith('=')){
                    return false
                }
                return true
            }) 
            return withoutBlankLinesAndMarkDown.join(' ')
        }
    }
    function removeDatesInParentheses(text) {
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
    }
    function breakContentIntoSentences(content){
        content.sentences = []

        const sentences = sentenceBounderyDetection.sentences(content.sourceContentSanitized)

        sentences.forEach((sentence) =>{
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })    
        })
        
    }
    function limitMaximunSentences(content){
        content.sentences = content.sentences.slice(0, content.maximunSentences)

    }
    async function fetchWatsonAndReturnKeyWords(sentence){
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text:sentence,
                features: {
                    keywords:{}
                }
            }, (error, response)=> {
                if(error){
                    throw error
                }
                const keywords = response.keywords.map((keyword)=> {
                    return keyword.text
                })
                resolve(keywords)
            })
        })
    }
    async function fetchKeywordsOfAllSentences(content){
        for (const sentence of content.sentences){
            sentence.keywords = await fetchWatsonAndReturnKeyWords(sentence.text)
        }
    }
    
}

module.exports = robot