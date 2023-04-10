let imgElement = null;

document.addEventListener('DOMContentLoaded', (event) => {
    /* Detect for chatbot changes to change the bot avatar */
    const headerObserver = new MutationObserver(mutaions => {
        mutaions.forEach(mutaion => {
            const src = mutaion.target.getAttribute('src');
            document.querySelector('body').style.setProperty('--bot-icon', `url("${src}")`);
        });
    });

    headerObserver.observe(
        document.querySelector('.BotHeader_boldTitle__mzvkG'),
        {
            subtree: true,
            attributeFilter: ['src'],
        }
    );

    /* Detect for new chat message and then change the code styling */
    let chatObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.target.classList.contains('ChatMessagesView_infiniteScroll__K_SeP')) {
                // Old message, directly update the code block
                mutation.addedNodes.forEach(changeCodeBlock);
            } else if (mutation.addedNodes) {
                // New message, the message is generating and have to wait for the code block to complete before updating the code block
                mutation.addedNodes.forEach(newNode => {
                    // fin
                    if (newNode.nodeName === 'PRE') {
                        let codeTimer = null;
                        const highlightCode = () => {
                            codeObserver.disconnect();
                            changeCodeBlock(newNode);
                        }
                        const codeObserver = new MutationObserver(mutations => {
                            clearTimeout(codeTimer);
                            codeTimer = setTimeout(highlightCode, 1000);
                        });

                        const config = { attributes: true, childList: true, subtree: true, characterData: true };
                        codeObserver.observe(newNode, config);

                        codeTimer = setTimeout(highlightCode, 1000);
                    }
                });
            }
        });
    });

    const chats = document.querySelector('.ChatMessagesView_infiniteScroll__K_SeP');
    const config = { childList: true, subtree: true };
    chatObserver.observe(chats, config);

    // Initial set-up
    setTimeout(() => {
        hljs.highlightAll();
    }, 100);
});

function changeCodeBlock(node) {
    node.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
    });
}