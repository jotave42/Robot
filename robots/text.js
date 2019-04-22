const algorithmia = require('algorithmia')
const algorithmApiKey = require('../credentials/credentials.json').apiKey
const sentenceBounderyDetection =  require('sbd')
async function robot(content){
    console.log('Recebi com sucesso o contente: '+ content.searchTerm)
     
    await fetchContentFromWikiPedia(content)   
    sanitizeContent(content)
    breakContentIntoSentences(content)

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
}

module.exports = robot