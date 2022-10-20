import "./css/index.css"

import IMask from "imask";

const get = (e) => document.querySelector(e);

const ccBgColor01 = get(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = get(".cc-bg svg > g g:nth-child(2) path");

const ccLogo = get(".cc-logo span:nth-child(2) img")

const colors = {
    "visa": ["#436D99", "#2D57F2"],
    "mastercard": ["#DF6F29", "C69347"],
    "default": ["black", "gray"]
}


function setCardType(type = "default") {
    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])

    ccLogo.setAttribute("src", `cc-${type}.svg`)

}

setCardType("default")
globalThis.setCardType = setCardType


const securityCode = get("#security-code");
const securityCodePattern = {
    mask: "0000"
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = get("#expiration-date")

const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        }
    }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)


const cardNumber = get("#card-number");
const cardNumberPattern = {
    mask: [

        {
            mask: "0000 0000 0000 0000",
            cardtype: "visa",
            regex: /^4\d{0,15}/
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "mastercard",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/

        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
            regex: /d{0,16}/

        }
    ],
    dispatch: function(append, dynamicMasked) {
        const number = (dynamicMasked.value + append).replace(/D/g, '')
        const foundMask = dynamicMasked.compiledMasks.find(({ regex }) => number.match(regex))
        return foundMask
    }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)


const addButton = get("#add-card")

addButton.addEventListener("click", () => {
    alert("Não foi realizada nenhuma validação!")
})

const formCard = get("form")

formCard.addEventListener("submit", (event) => {
    event.preventDefault()
})


const cardHolder = get("#card-holder")
cardHolder.addEventListener("input", () => {
    const ccHolder = get(".cc-holder .value")
    ccHolder.innerText = (cardHolder.value.length > 0) ? cardHolder.value : 'FULANO DA SILVA'
})


securityCodeMasked.on("accept", () => {
    const ccSecurity = get(".cc-security .value")
    ccSecurity.innerText = (securityCodeMasked.value.length > 0) ? securityCodeMasked.value : '123'
})

cardNumberMasked.on("accept", () => {
    const ccNumber = get(".cc-number")
    ccNumber.innerText = (cardNumberMasked.value.length > 0) ? cardNumberMasked.value : '1234 5678 9012 3456'
    setCardType(cardNumberMasked.masked.currentMask.cardtype)
})


const cardExpiration = get("#expiration-date")
cardExpiration.addEventListener("input", () => {
    const ccExpiration = get(".cc-expiration .value")
    ccExpiration.innerText = (cardExpiration.value.length > 0) ? cardExpiration.value : '02/32'
})