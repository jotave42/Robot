const readLine = require('readline-sync')
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

    console.log(content)
}

start()