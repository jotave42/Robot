const algorithmia = require('algorithmia')
const algorithmApiKey = require('../credentials/credentials.json').apiKey

function robot(content){
    console.log('Recebi com sucesso o contente: '+ content.searchTerm)
    fetchContentFromWikiPedia(content)
    
 /*   sanitizeContent(content)
    breakContentIntoSentences(content)*/

    async function fetchContentFromWikiPedia(content){
        const algorithmiaAuthenticated = algorithmia(algorithmApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const WikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const WikipediaContent = WikipediaResponse.get()
        console.log(WikipediaContent)
        content.sourceContentOriginal = WikipediaContent.content

    }
}

module.exports = robot