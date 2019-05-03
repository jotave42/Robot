const readLine = require('readline-sync')
const state = require('./state.js')
function robot() {
    const content = {
        maximunSentences : 7 
    }  
    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()

    function askAndReturnSearchTerm(){
        return readLine.question("Type a Wikipedia search term: ")
    }

    function askAndReturnPrefix(){
        const prefixs = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readLine.keyInSelect(prefixs,'Chose one option: ')
        const selectedPrefixText = prefixs[selectedPrefixIndex]
        
        return selectedPrefixText
    }
  

    state.save(content)

}
module.exports = robot