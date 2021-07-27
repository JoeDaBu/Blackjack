const person = prompt("Please enter your name", "Name")
let text
if (person == null|| person =="") {
    text = "Dumb"
} else {
    text = person
}

let player = {
    name: text,
    chips: 200
}

let ace = {
    id: "Ace",
    value1: 11,
    value2: 1
}

let dealer = {
    name: "Dealer"
}

let hiddenCards = {
    id: "?",
    value: 0,
    position: 1
}
let s = 0
let aceP = 0
let acePPositions = []
let aceD = 0
let aceDPositions = []
const start = [renderCard, renderDealer, renderCard, renderHiddenCard]
let dealerCards = []
let cards = []
let sum = 0
let houseSum = 0
let hasBlackJack = false
let isAlive = false
let isDealerAlive = false
let prevAce = 0
let winState = "none"
let message = "Do you want to draw a new card?"
let finStart = false
let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let playerEl = document.getElementById("player-el")
let dealerEl = document.getElementById("dealer-el")
let dealerSum = document.getElementById("dealer-sum")
let startBtn = document.getElementById("start-btn")

playerEl.textContent = player.name + ": $" + player.chips

function dealerDraw() {
    if (houseSum > 21) {
        if (aceD) {
            aceD--
            houseSum -= 10
            dealerCards.splice(aceDPositions[0], 1, 1)
            aceDPositions.shift()
            dealerDraw()
        } else {
            winState = "win"
        }
    } else if (houseSum > sum) {
        winState = 'lose'
    } else if (houseSum == sum && houseSum > 16) {
        winState = "draw"
    } else if (houseSum > 16) {
        winState = 'win'
    } else {
        preRenderDealer()
        dealerDraw()
    
    }
}

function renderDraw() {
    sumEl.textContent = "Sum: " + sum
    if (cards.length >= 5) {
        hasBlackJack = true
        revealDealer()
        if(houseSum != 21) {
            winState = 'win'
        } else {
            winState = 'draw'
        }
        renderState()
    } else if (sum <= 20) {
    } else if (sum === 21) {
        message = "You've got Blackjack!"
        hasBlackJack = true
        revealDealer()
        if (houseSum == 21) {
            winState = "draw"
            renderState()
        } else {
            endGame()
        }
    } else {
        if (aceP) {
            aceP--
            sum -= 10
            sumEl.textContent = "Sum: " + sum
            cards.splice(acePPositions[0], 1, 1)
            cardsEl.textContent = cardsEl.textContent.replace('11', '1')
            acePPositions.shift()
            renderDraw()
        } else {
            message = "You busted! :("
            isAlive = false
            revealDealer()
            endGame()
        }
        
    }
    messageEl.textContent = message
}

function getRandomCard() {
    let randomNumber = Math.floor( Math.random()*13 ) + 1
    if (randomNumber > 10) {
        return 10
    } else if (randomNumber == 1) {
        return 11
    } else {
        return randomNumber
    }
}

function startGame() {
    isAlive = true
    if (s < start.length) {
        start[s++]()
        if (s == 4) {
            finStart = true
            renderDraw()
        } else {
            setTimeout(startGame, 1000)
        }
    }
}

function endGame() {
    startBtn.textContent = "RESET GAME"
    startBtn.setAttribute('onclick', 'resetGame()')
}

function resetGame() {
    s = 0
    cards = []
    dealerCards = []
    sum = 0
    houseSum = 0
    winState = "none"
    message = "Do you want to draw a new card?"
    hasBlackJack = false
    finStart = false
    prevAce = 0
    aceP = 0
    aceD = 0
    acePPositions = []
    aceDPositions = []
    messageEl.textContent = "Want to play a round?"
    sumEl.textContent = "Sum: "
    cardsEl.textContent = "Cards: "
    dealerEl.textContent = "Dealer: "
    dealerSum.textContent = ""
    startBtn.textContent = "START GAME"
    startBtn.setAttribute('onclick', 'startGame()')
}

function preRenderDealer() {
    let card = getRandomCard()
    if (card == 11) {
        aceD++
        aceDPositions.push(dealerCards.length)
    }
    dealerCards.push(card)
    houseSum += card
    return card
}

function renderDealer() {  
    dealerEl.textContent += " " + preRenderDealer()
    // console.log(dealerCards)
}

function renderCard() {
    let card = getRandomCard()
    if (card == 11) {
        aceP++
        acePPositions.push(cards.length)
    }
    cards.push(card)
    cardsEl.textContent += " " + card
    sum += card
}

function renderHiddenCard() {
    hiddenCards.value = preRenderDealer()
    dealerCards.pop()
    dealerEl.textContent += " " + hiddenCards.id
}

function stand() {
    isAlive = false
    callDealer()
}

function revealDealer() {
    if (aceD && houseSum > 21) {
        aceD--
        houseSum -= 10
        dealerCards.splice(aceDPositions[0], 1, 1)
        dealerEl.textContent = dealerEl.textContent.replace('11', '1')
        aceDPositions.shift()
    }
    dealerCards[hiddenCards.position] = hiddenCards.value
    dealerEl.textContent = "Dealer: "
    for (let  i = 0; i < dealerCards.length; i++) {
        dealerEl.textContent += dealerCards[i] + " "
    }

    dealerSum.textContent = "Dealer Sum: "
    dealerSum.textContent += houseSum
}

function callDealer() {
    revealDealer()
    dealerDraw()
    console.log(dealerCards)
    playDealerAnimation()
}


function playDealerAnimation() {
    let dSum = 0
    for (let i = 0; i <= hiddenCards.position; i++) {
        dSum += dealerCards[i]
    }
    setTimeout (() => animateCards(dSum, hiddenCards.position+1), 1000)
}

function animateCards(cSum, pos) {
    if (pos == dealerCards.length) {
        renderState()
        return
    }
    setTimeout(() => {
        if (pos == hiddenCards.position+1 && dealerCards[pos-1] == 1) {
            dealerEl.textContent = dealerEl.textContent.replace("11", '1')
        }
        if (dealerCards[pos] == 1 && !(cSum + 11 > 21)) {
            dealerEl.textContent += " " + 11
            cSum += 11
            prevAce++
        } else if (dealerCards[pos] == 1 && prevAce) {
            dealerEl.textContent += " " + 11
            dealerEl.textContent = dealerEl.textContent.replace("11", '1')
            cSum += 1
        } else {
            if (cSum + dealerCards[pos] > 21 && prevAce) {
                cSum -= 10
                prevAce--
                dealerEl.textContent = dealerEl.textContent.replace("11", '1')
            }
            dealerEl.textContent += " " + dealerCards[pos]
            cSum += dealerCards[pos]
        }
        dealerSum.textContent = "DealerSum: " + cSum
        animateCards(cSum, pos+1)
        }, 1000)
}

function renderState() {
    if (winState == "draw") {
        message = "You tied with your opponent!"
    } else if (winState == "lose") {
        message = "Unfortunate, you lost! :("
    } else if (winState == "win") {
        message = "You win money! :)"
    } else {
        message = "error beep boop you have corrupted me, pls contact the emergency services!"
        console.log("error")
    }
    messageEl.textContent = message
    endGame()
}




function newCard() {
    if (isAlive === true && hasBlackJack === false && finStart) {
        renderCard()
        renderDraw()        
    }
}
