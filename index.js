const readLine = require('readline-sync')
const robots = {
    text: require('./robots/text.js')
}
function start(){
    const content = {}
    
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

    robots.text(content)
    
    console.log(content)
}

start()