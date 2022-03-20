new WOW().init();

const hamburgerSvg = document.getElementById('hamburger-svg');
const hamburgerAbsolute = document.getElementById('hamburger-absolute');
const mobileMenu = document.getElementById('mobile-menu');
const shortenerBox = document.getElementById('shortener-box');
const linkInput = document.getElementById('link');
const shortenItButton = document.getElementById('shorten-it-button');
const resultContainer = document.getElementById('result-container');

const shortenLinks = [];
let isMobile = navigator.userAgentData.mobile;
/* if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // true for mobile device
    isMobile = true;
}; */

function toggleSvgClass() {
    hamburgerSvg.classList.toggle('active');
    mobileMenu.style.transition = 'visibility 0.5s, opacity 0.5s linear';
    mobileMenu.classList.toggle('active');
}

hamburgerAbsolute.addEventListener(`${isMobile ? 'mousemove' : 'mouseenter'}`, function () {
    hamburgerSvg.classList.add('activeColor')
    if (isMobile) {
        setTimeout(() => {
            hamburgerSvg.classList.remove('activeColor')
        }, 300)
    }
})
hamburgerAbsolute.addEventListener('mouseleave', function () {
    hamburgerSvg.classList.remove('activeColor')
})


// --------------------------- start Shortener

function errorFunction() {
    shortenerBox.classList.add('error');
    createDOM()
}

function copyToClipBoard(value, index) {
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(value);

    document.querySelectorAll('.item-buttons')[index].textContent = 'Copied'
    document.querySelectorAll('.item-buttons')[index].classList.add('copied')
    setTimeout(function () {
        document.querySelectorAll('.item-buttons')[index].textContent = 'Copy'
        document.querySelectorAll('.item-buttons')[index].classList.remove('copied')
    }, 2000)
}

// Create HTML Elements
function createDOM() {
    shortenItButton.disabled = false;
    linkInput.value = '';
    resultContainer.textContent = '';

    shortenLinks.forEach((item, index) => {
        // Create a left side link
        let originalLink = document.createElement('a');
        originalLink.href = item.fullLink;
        originalLink.target = '_blank';
        originalLink.textContent = item.fullLink;
        // Create left-side div
        let leftSide = document.createElement('div');
        leftSide.classList.add('left-side');
        // Create hr tag
        let hr = document.createElement('hr');
        // Create a shorten link
        let shortenLink = document.createElement('a');
        shortenLink.href = item.shortenLink;
        shortenLink.target = '_blank';
        shortenLink.classList.add('shorten-link')
        shortenLink.textContent = item.shortenLink;
        // Create a button
        let button = document.createElement('button');
        button.setAttribute('onclick', `copyToClipBoard('${item.shortenLink}', ${index})`);
        button.classList.add('item-buttons')
        button.textContent = 'Copy'
        // Create right-side div
        let rightSide = document.createElement('div');
        rightSide.classList.add('right-side');
        // Create item div
        let itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        // Append all
        leftSide.appendChild(originalLink);
        rightSide.append(shortenLink, button);
        itemDiv.append(leftSide, hr, rightSide);
        resultContainer.append(itemDiv)
    })
}

async function getLink(value) {
    try {
        shortenItButton.disabled = true;
        let response = await fetch(`https://api.shrtco.de/v2/shorten?url=${value}`);
        let data = await response.json();
        let isHere = false;
        shortenLinks.forEach(item => {
            if (item.shortenLink === data.result.full_short_link) {
                isHere = true;
            }
        })
        
        if (!isHere) {
            shortenLinks.unshift(
                {
                    fullLink: data.result.original_link,
                    shortenLink: data.result.full_short_link
                }
            )
        }
        createDOM()
    } catch {
        errorFunction()
    }
}

// ShortenIt - Fires when user click to button or key 'enter' down to input
function shortenIt() {
    if (linkInput.value.trim() === '') {
        shortenerBox.classList.add('error');
        linkInput.value = '';
    } else {
        if (!linkInput.value.slice(0, 8).includes('https://') && !linkInput.value.slice(0, 8).includes('http://')) {
            getLink('https://' + linkInput.value)
        } else {
            getLink(linkInput.value)
        }
    }
}

// Event Listeners
linkInput.addEventListener('focusin', function () {
    shortenerBox.classList.remove('error')
})
linkInput.addEventListener('keydown', function (e) {
    if (shortenerBox.classList.value.includes('error')) {
        shortenerBox.classList.remove('error')
    }
    e.keyCode===13 ? shortenIt() : false
})

// --------------------------- end Shortener
