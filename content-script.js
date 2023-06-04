let imgElement = null;

document.addEventListener('DOMContentLoaded', (event) => {
    /* Detect for chatbot changes to change the bot avatar */
    const headerObserver = new MutationObserver(mutaions => {
        mutaions.forEach(mutaion => {
            setBotAvatar(mutaion.target);
        });
    });

    headerObserver.observe(
        document.querySelector('.BotHeader_boldTitle__mzvkG'),
        {
            subtree: true,
            attributeFilter: ['src'],
        }
    );

    // Initial set-up
    setBotAvatar(document
        .querySelector('.BotHeader_boldTitle__mzvkG')
        .querySelector('img'));
});

function setBotAvatar(element) {
    const src = element.getAttribute('src');
    document.querySelector('body').style.setProperty('--bot-icon', `url("${src}")`);
}