// ==UserScript==
// @name     BestBuy-RefreshNoBot
// @include  https://www.bestbuy.com/*
// @version      4.3
// @description  This aint bot, its RefreshNoBot
// @author       Karan Kapuria, Modified by MCCODES01
// @grant        window.close

// ==/UserScript==

//rgb(197, 203, 213) pleasewait
//rgb(255, 224, 0) add to cart
//rgb(0, 70, 190) verify your account

/*
          (                            )           )
   (      )\ )  *   )     (         ( /(     (  ( /(   *   )
 ( )\ (  (()/(` )  /(   ( )\    (   )\())  ( )\ )\())` )  /(
 )((_))\  /(_))( )(_))  )((_)   )\ ((_)\   )((_|(_)\  ( )(_))
((_)_((_)(_)) (_(_())  ((_)_ _ ((_)_ ((_) ((_)_  ((_)(_(_())
 | _ ) __/ __||_   _|   | _ ) | | \ \ / /  | _ )/ _ \|_   _|
 | _ \ _|\__ \  | |     | _ \ |_| |\ V /   | _ \ (_) | | |
 |___/___|___/  |_|     |___/\___/  |_|    |___/\___/  |_|

                                                                  */
 "use strict";
 //________________________________________________________________________

                        //  CONSTANTS
     // [ Do not add/remove quotation marks when updating]
 //________________________________________________________________________

 //____ REQUIRED FLAGS ____________________________________________________

 const ITEM_KEYWORD= "****"; // Edit this to match part of the page title
 const CREDITCARD_CVV = "***"; // BOT will run without changing this value.
 const TESTMODE = "**"; // TESTMODE = "No" will buy the card
 const SMS_DIGITS = "****"; // Enter last 4 digits of phone # for SMS verification (required for verification)

 //____ PLEASE WAIT FLAGS : ADVANCED OPTIONS _____________________________

 //const QUEUE_TIME_CUTOFF = 0 // (in Minutes) Keep retrying until queue time is below.
 //onst NEW_QUEUE_TIME_DELAY = 5 // (in Seconds) Ask new queue time set seconds
 const OOS_REFRESH = 9 // (in Seconds) Refresh rate on OOS item.

 //____ LAZY FLAGS : WILL NOT AFFECT BOT PERFORMACE _____________________

 const MAX_RETRIES = "500" // Fossil of EARTH

 // Debug mode - set to true to see more console logs
 const DEBUG = true;

 //________________________________________________________________________

                      // Countdown Timer Functionality
 //________________________________________________________________________

// Create a countdown timer to show when the page will refresh
function createCountdownTimer() {
    // Create the countdown element
    const countdown = document.createElement('div');
    countdown.id = 'refresh-countdown';
    countdown.style.cssText = "position:fixed;right:10px;top:10px;background:red;color:white;padding:8px;z-index:9999;font-weight:bold;border-radius:5px;";
    document.body.appendChild(countdown);

    // Initialize countdown with refresh interval
    let timeLeft = OOS_REFRESH;

    // Update the countdown timer
    function updateCountdown() {
        countdown.textContent = `REFRESH IN: ${timeLeft}s`;
        timeLeft--;

        if (timeLeft < 0) {
            timeLeft = OOS_REFRESH;
            console.log('REFRESHING PAGE NOW');
            window.location.reload();
        }
    }

    // Initial count display
    updateCountdown();

    // Update countdown every second
    setInterval(updateCountdown, 1000);
}

 //________________________________________________________________________

                  // Chime Sound
 //________________________________________________________________________

// Play a chime sound to notify the user
function playChime() {
    // You can choose any online sound file.
    const chimeUrl = "https://github.com/kkapuria3/BestBuy-GPU-Bot/blob/dev-v2.5-mem_leak_fix/resources/alert.mp3?raw=true";
    const audio = new Audio(chimeUrl);
    audio.play().catch(err => console.error("Audio play failed:", err));
}

 //________________________________________________________________________

                  // Queue Timer Functions
 //________________________________________________________________________

function n(e, t) {
     return parseInt(e, t)
 }

function r(e, t) {
    return e[t]
}

function getQueueTimeFromEncodedString(e) {
    var t = ("-", e.split("-")),
        l = t.map((function (e) {
            return n(e, 16)
        }));
    return function (e) {
        return 1e3 * e
    }(function (e, t) {
        return e / t
    }(n(function (e, t) {
        return e + t
    }(r(t, 2), r(t, 3)), 16), r(l, 1)))
}

function getRecordForSku(sku){
    try {
        const queues = JSON.parse(atob(localStorage.getItem('purchaseTracker')));
        if (DEBUG) console.log('Queue data:', queues);

        const skuQueue = queues[sku];
        if(!skuQueue){
            return null;
        }
        return skuQueue;
    } catch (e) {
        console.error('Error getting record for SKU:', e);
        return null;
    }
}

function getQueueTimeStartMs(sku){
    const record = getRecordForSku(sku);
    return record ? record[0] : 0;
}

function getQueueDurationMs(sku){
    const record = getRecordForSku(sku);
    return record ? getQueueTimeFromEncodedString(record[2]) : 0;
}

var sku = location.search.split('=')[1];
if (DEBUG) console.log('Found SKU:', sku);

// This function will be called when Please wait is detected to return queue time
let checkQueueTimeRemaining = () => {
    try {
        var startMs = getQueueTimeStartMs(sku);
        var durationMs = getQueueDurationMs(sku);
        var durationMin = Math.trunc(durationMs / 60000);
        var durationSec = Math.trunc((durationMs / 1000) - (durationMin * 60));
        var remainingMs = startMs + durationMs - new Date().getTime();
        var remainingMin = Math.trunc(remainingMs / 60000);
        var remainingSec = Math.trunc((remainingMs / 1000) - (remainingMin * 60));

        return [remainingMin, remainingSec];
    } catch (e) {
        console.error('Error checking queue time:', e);
        return [0, 0];
    }
};

 //________________________________________________________________________

                  // Create Floating Status Bar
 //________________________________________________________________________

 function createFloatingBadge(mode, status) {
    // First, remove any existing badges to avoid stacking multiple badges
    const existingBadges = document.querySelectorAll('.refreshnobot-badge');
    for (const badge of existingBadges) {
        badge.remove();
    }

    const iconUrl = "https://kkapuria3.github.io/images/KK.png";
    const $container = document.createElement("div");
    $container.className = 'refreshnobot-badge';
    const $bg = document.createElement("div");
    const $link = document.createElement("a");
    const $img = document.createElement("img");
    const $text = document.createElement("P");
    const $mode = document.createElement("P");
    const $status1 = document.createElement("P");

    $link.setAttribute("href", "https://github.com/kkapuria3");
    $link.setAttribute("target", "_blank");
    $link.setAttribute("title", "RefreshNoBot");
    $img.setAttribute("src", iconUrl);
    var MAIN_TITLE = (" OpenSourceBots | BestBuyBot v4.3 | ◻️TESTMODE: " +TESTMODE + "◻️ITEM KEYWORD: " + ITEM_KEYWORD+ "◻️OOS REFRESH: " + OOS_REFRESH);
    $text.innerText = MAIN_TITLE;
    $mode.innerText = mode;
    $status1.innerText = status;

    $container.style.cssText = "position:fixed;left:0;bottom:0;width:850px;height:75px;background: black;z-index:9999;";
    $bg.style.cssText = "position:absolute;left:-100%;top:0;width:60px;height:55px;background:#1111;box-shadow: 0px 0 10px #060303; border: 1px solid #FFF;";
    $link.style.cssText = "position:absolute;display:block;top:11px;left: 0px; z-index:10;width: 50px;height:50px;border-radius: 1px;overflow:hidden;";
    $img.style.cssText = "display:block;width:100%";
    $text.style.cssText = "position:absolute;display:block;top:3px;left: 50px;background: transperant; color: white;";
    $mode.style.cssText = "position:absolute;display:block;top:22px;left: 50px;background: transperant; color: white;";
    $status1.style.cssText = "position:absolute;display:block;top:43px;left: 50px;background: transperant; color: white;";

    $link.appendChild($img);
    $container.appendChild($bg);
    $container.appendChild($link);
    $container.appendChild($text);
    $container.appendChild($mode);
    $container.appendChild($status1);

    return $container;
 }

 //________________________________________________________________________

     //  FUNCTIONS | Writing seperate EventHandlers so we can prevent memory leak for long running bots
 //________________________________________________________________________

 // Ideas developed based on : https://stackoverflow.com/questions/13677589/addeventlistener-memory-leak-due-to-frames/13702786#13702786
 //________________________________________________________________________

                      //    CART PAGE EventHandler
 //________________________________________________________________________

 function cartpageoperationsEvenHandler (evt) {
     setTimeout(function() {
         if (location.href.includes("www.bestbuy.com/cart")) {
             //Create Custom Badge
             const $badge = createFloatingBadge("Cart Page 🛑 Do Not Refresh. Only one item can be carted per account.","Verfying that first item in CART has KEYWORD");
             document.body.appendChild($badge);
             $badge.style.transform = "translate(0, 0)";

             //Wait 2 Seconds on Cart Page
             setTimeout(function() {
                 //We will verify the first time in the cart. If the item name has the Keyword, that means the item was sucessfully added to cart.
                 var CartItemCheck = document.getElementsByClassName("cart-item__title focus-item-0");

                 if (DEBUG) {
                     console.log('Checking cart items:', CartItemCheck);
                     if (CartItemCheck.length > 0) {
                         console.log('First cart item text:', CartItemCheck[0].innerHTML);
                     }
                 }

                 if (CartItemCheck.length > 0 && CartItemCheck[0].innerHTML.includes(ITEM_KEYWORD)) {
                     console.log('Item Has been Confirmed!');
                     console.log('Click Checkout');
                     var CheckoutButton = document.getElementsByClassName("btn btn-lg btn-block btn-primary");
                     if (CheckoutButton.length > 0) {
                         CheckoutButton[0].click();
                     } else {
                         console.error('Checkout button not found');
                     }
                 }
             }, 2000);
         }
     }, 4000);
 }

 //________________________________________________________________________

                      //    VERIFICATION PAGE EventHandler
 //________________________________________________________________________

 function verificationpageEventHandler (evt) {
     console.log('Verification Step Reached');
     playChime();
     setTimeout(function() {
         if (location.href.indexOf("identity/signin/recoveryOptions") > -1) {
             //Create Custom Badge
             const $badge = createFloatingBadge("Get Ready To Verify 🛑 Do Not Refresh ","Validating and Entering SMS Digits | It will error if you havent updated SMS_DIGITS ");
             document.body.appendChild($badge);
             $badge.style.transform = "translate(0, 0)";

             setTimeout(function() {
                 var ContinueButton;
                 const ContinueButton_L1 = "btn btn-secondary btn-lg btn-block c-button-icon c-button-icon-leading cia-form__controls__submit ";
                 const ContinueButton_L2 = "c-button c-button-secondary c-button-lg c-button-block c-button-icon c-button-icon-leading cia-form__controls__submit ";
                 const ContinueButton_L3 = "c-button c-button-secondary c-button-md c-button-block";

                 if (document.getElementsByClassName(ContinueButton_L1).length == 1) {
                     ContinueButton = document.getElementsByClassName(ContinueButton_L1);
                     if (DEBUG) console.log('ContinueButton Class ID 1 : ' + ContinueButton_L1);
                 } else if (document.getElementsByClassName(ContinueButton_L2).length == 1) {
                     ContinueButton = document.getElementsByClassName(ContinueButton_L2);
                     if (DEBUG) console.log('ContinueButton Class ID 2 :' + ContinueButton_L2);
                 } else if (document.getElementsByClassName(ContinueButton_L3).length == 1) {
                     ContinueButton = document.getElementsByClassName(ContinueButton_L3);
                     if (DEBUG) console.log('ContinueButton Class ID 3 :' + ContinueButton_L3);
                 }

                 const smsField = document.getElementById("smsDigits");
                 if (smsField) {
                     smsField.focus();
                     smsField.select();
                     if (!document.execCommand('insertText', false, SMS_DIGITS)) {
                         smsField.value = SMS_DIGITS;
                     }

                     if (ContinueButton && ContinueButton.length == 1) {
                         ContinueButton[0].click();
                     }
                 } else {
                     console.error("SMS field not found");
                 }
             }, 1500);
         }
     }, 2000);
 }

 //________________________________________________________________________

                  //  SECOND ADD TO CART EventHandler
 //________________________________________________________________________


function pleasewaitcompletedEventHandler(evt) {
    // Wait 3 seconds before clicking the final "Go to Cart" button
    setTimeout(function() {
        var GotoCartButton;
        // Existing class strings...
        const GotoCartButton_L1 = "c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block";
        const GotoCartButton_L2 = "c-button c-button-secondary c-button-sm c-button-block";
        // NEW variant that matches your provided HTML element:
        const GotoCartButton_L3 = "c-button c-button-secondary c-button-md c-button-block";

        if (document.getElementsByClassName(GotoCartButton_L1).length > 0) {
            GotoCartButton = document.getElementsByClassName(GotoCartButton_L1);
            if (DEBUG) console.log('GotoCartButton Class ID 1 : ' + GotoCartButton_L1);
        } else if (document.getElementsByClassName(GotoCartButton_L2).length > 0) {
            GotoCartButton = document.getElementsByClassName(GotoCartButton_L2);
            if (DEBUG) console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L2);
        } else if (document.getElementsByClassName(GotoCartButton_L3).length > 0) {
            GotoCartButton = document.getElementsByClassName(GotoCartButton_L3);
            if (DEBUG) console.log('GotoCartButton Class ID 3 :' + GotoCartButton_L3);
        }

        // If the button is found, iterate and click the one that links to the cart page.
        if (GotoCartButton && GotoCartButton.length > 0) {
            for (var i = 0; i < GotoCartButton.length; i++) {
                if (GotoCartButton[i].href === 'https://www.bestbuy.com/cart' ||
                    GotoCartButton[i].href === '/cart') {
                    // Set up the click event handler
                    GotoCartButton[i].onclick = cartpageoperationsEvenHandler;
                    GotoCartButton[i].addEventListener("click", cartpageoperationsEvenHandler, false);
                    // Trigger a click on the element
                    GotoCartButton[i].click();
                    break;
                }
            }
        } else {
            console.error('Go to Cart button not found');
        }
    }, 3000);
}

 //________________________________________________________________________

                   //  ITEM IN STOCK EventHandler
 //________________________________________________________________________

 function instockEventHandler(evt) {
     // After pressing Add to Cart button we first wait for 5 seconds to get cart ready. In this time we will check if it shows please wait
     // Add to Cart Button Classes Layers
     var InStockButton;
     const InStockButton_L1 = "btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button";
     const InStockButton_L2 = "c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button";
     const InStockButton_L3 = "c-button c-button-secondary c-button-md c-button-block";

     if (document.getElementsByClassName(InStockButton_L1).length > 0) {
         InStockButton = document.getElementsByClassName(InStockButton_L1);
         if (DEBUG) console.log('instockEventHandler Button Class 1 : ' + InStockButton_L1);
     } else if (document.getElementsByClassName(InStockButton_L2).length > 0) {
         InStockButton = document.getElementsByClassName(InStockButton_L2);
         if (DEBUG) console.log('instockEventHandler Button Class 2 :' + InStockButton_L2);
     } else if (document.getElementsByClassName(InStockButton_L3).length > 0) {
         InStockButton = document.getElementsByClassName(InStockButton_L3);
         if (DEBUG) console.log('instockEventHandler Button Class 3 :' + InStockButton_L3);
     }

     if (!InStockButton || InStockButton.length === 0) {
         console.error('Add to Cart button not found');
         return;
     }

     setTimeout(function() {
         let MainButtonColor = window.getComputedStyle(InStockButton[0]).backgroundColor;
         //Code to run After timeout elapses
         if (DEBUG) console.log('Confirming Button Color : ' + MainButtonColor);

         if (MainButtonColor === 'rgb(197, 203, 213)') {
             console.log('Button Color Gray. Is it still Adding?');

             setTimeout(function() {
                 var REALLY_PLEASE_WAIT = window.getComputedStyle(InStockButton[0]).backgroundColor;

                 if (REALLY_PLEASE_WAIT === 'rgb(197, 203, 213)') {
                     console.log('Its really Please Wait.');

                     var MODE = "Do not Refresh 🛑 For new queue time open this link in new firefox container tab";
                     var RETRY_COUNT = 1;
                     let RETRY_QUEUE_COUNT = 0;
                     let QUEUE_TRY_COUNT = 0;

                     // Run this every 1 second to check queue time
                     setInterval(function() {
                         try {
                             // run checkQueueTimeRemaining Function which returns [remainingMin, remainingSec]
                             const [remainingMin, remainingSec] = checkQueueTimeRemaining();
                             if (DEBUG) console.log(`Queue time: ${remainingMin}m : ${remainingSec}s`);

                             const queueBadge = 'Queue Time : ' + remainingMin + 'm : '+ remainingSec+'s';
                             const $badge = createFloatingBadge(MODE, queueBadge);
                             document.body.appendChild($badge);
                             $badge.style.transform = "translate(0, 0)";

                             // Check button state periodically
                             setTimeout(function() {
                                 //Find the Color of Main Button
                                 var PleaseWait;
                                 const PleaseWait_L1 = "btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button";
                                 const PleaseWait_L2 = "c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button";
                                 const PleaseWait_L3 = "c-button c-button-secondary c-button-md c-button-block";

                                 if (document.getElementsByClassName(PleaseWait_L1).length == 1) {
                                     PleaseWait = document.getElementsByClassName(PleaseWait_L1);
                                     if (DEBUG) console.log('PleaseWait Button Class 1 : ' + PleaseWait_L1);
                                 } else if (document.getElementsByClassName(PleaseWait_L2).length == 1) {
                                     PleaseWait = document.getElementsByClassName(PleaseWait_L2);
                                     if (DEBUG) console.log('PleaseWait Button Class 2 :' + PleaseWait_L2);
                                 } else if (document.getElementsByClassName(PleaseWait_L3).length == 1) {
                                     PleaseWait = document.getElementsByClassName(PleaseWait_L3);
                                     if (DEBUG) console.log('PleaseWait Button Class 3 :' + PleaseWait_L3);
                                 }

                                 if (PleaseWait && PleaseWait.length > 0) {
                                     let MainButtonColor = window.getComputedStyle(PleaseWait[0]).backgroundColor;
                                     console.log("Please Wait Button Detected :" + MainButtonColor + " | Lets keep trying ..");

                                     if (MainButtonColor === 'rgb(255, 224, 0)' || MainButtonColor === 'rgb(0, 70, 190)') {
                                         // Color of Button Changes to yellow then click again
                                         let ATC_Color = window.getComputedStyle(InStockButton[0]).backgroundColor;
                                         // When button turns yellow, we scream bagged !
                                         console.log("Add to Cart is available:" + ATC_Color + " | Lets Bag This ! ");

                                         var ATCYellowButton;
                                         const ATCYellowButton_L1 = "btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button";
                                         const ATCYellowButton_L2 = "c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button";
                                         const ATCYellowButton_L3 = "c-button c-button-secondary c-button-md c-button-block";

                                         if (document.getElementsByClassName(ATCYellowButton_L1).length == 1) {
                                             ATCYellowButton = document.getElementsByClassName(ATCYellowButton_L1);
                                             if (DEBUG) console.log('Yellow Button Class 1 : ' + ATCYellowButton_L1);
                                         } else if (document.getElementsByClassName(ATCYellowButton_L2).length == 1) {
                                             ATCYellowButton = document.getElementsByClassName(ATCYellowButton_L2);
                                             if (DEBUG) console.log('Yellow Button Class 2 :' + ATCYellowButton_L2);
                                         } else if (document.getElementsByClassName(ATCYellowButton_L3).length == 1) {
                                             ATCYellowButton = document.getElementsByClassName(ATCYellowButton_L3);
                                             if (DEBUG) console.log('Yellow Button Class 3 :' + ATCYellowButton_L3);
                                         }

                                         // Now we will use event handlers to check for clicks
                                         if (ATCYellowButton && ATCYellowButton.length > 0) {
                                             ATCYellowButton[0].onclick = pleasewaitcompletedEventHandler;
                                             ATCYellowButton[0].addEventListener("click", pleasewaitcompletedEventHandler, false);
                                             ATCYellowButton[0].click();
                                         }
                                     } else {
                                         // Is queue bypass available?
                                         console.log("Checking bypass");
                                         checkForGoToCartButton();
                                     }
                                 }
                             }, 5 * 1000);

                             RETRY_COUNT++;
                             if (RETRY_COUNT > MAX_RETRIES) {
                                 console.log("Max retries exceeded, reloading...");
                                 location.reload();
                             }
                         } catch (e) {
                             console.error("Error monitoring queue:", e);
                         }
                     }, 1000);
                 } else {
                     setTimeout(function() {
                         // Press secondary button
                         console.log('Level 2 | Blue Cart Button Appears');
                         checkForGoToCartButton();
                     }, 2000);
                 }
             }, 1000);
         } else {
             setTimeout(function() {
                 // Press secondary button
                 console.log('Level 1 | Blue Cart Button Appears');
                 checkForGoToCartButton();
             }, 2000);
         }
     }, 1000);
 }

// Helper function to check for and click the Go to Cart button
function checkForGoToCartButton() {
    if (DEBUG) console.log('Checking for Go to Cart button');
    var GotoCartButton;
    const GotoCartButton_L1 = "c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block";
    const GotoCartButton_L2 = "c-button c-button-secondary c-button-sm c-button-block";
    const GotoCartButton_L3 = "c-button c-button-secondary c-button-md c-button-block";

    if (document.getElementsByClassName(GotoCartButton_L1).length > 0) {
        GotoCartButton = document.getElementsByClassName(GotoCartButton_L1);
        if (DEBUG) console.log('GotoCartButton Class ID 1 : ' + GotoCartButton_L1);
    } else if (document.getElementsByClassName(GotoCartButton_L2).length > 0) {
        GotoCartButton = document.getElementsByClassName(GotoCartButton_L2);
        if (DEBUG) console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L2);
    } else if (document.getElementsByClassName(GotoCartButton_L3).length > 0) {
        GotoCartButton = document.getElementsByClassName(GotoCartButton_L3);
        if (DEBUG) console.log('GotoCartButton Class ID 3 :' + GotoCartButton_L3);
    }

    if (GotoCartButton && GotoCartButton.length > 0) {
        for (var i = 0; i < GotoCartButton.length; i++) {
            if (GotoCartButton[i].href === 'https://www.bestbuy.com/cart' ||
                GotoCartButton[i].href === '/cart') {
                if (DEBUG) console.log('Found correct cart button, clicking');
                GotoCartButton[i].onclick = cartpageoperationsEvenHandler;
                GotoCartButton[i].addEventListener("click", cartpageoperationsEvenHandler, false);
                GotoCartButton[i].click();
                setTimeout(cartpageoperationsEvenHandler, 1000);
                break;
            }
        }
    }
}

 //________________________________________________________________________

                            //  Main Code
 //________________________________________________________________________

function contains(a, b) {
    let counter = 0;
    for (var i = 0; i < b.length; i++) {
        if (a.includes(b[i])) counter++;
    }
    if (counter === b.length) return true;
    return false;
}

// If script is already running, don't start another instance
if (window.bestBuyScriptRunning) {
    console.log('Script already running, not starting another instance');
} else {
    window.bestBuyScriptRunning = true;
    console.log('BestBuy RefreshNoBot script starting...');

    // Get Page Title
    var pagetitle = String(document.title);
    if (DEBUG) console.log('Page title:', pagetitle);

    // Handle cart page
    if (location.href.includes("www.bestbuy.com/cart")) {
        console.log('Cart page detected');
        cartpageoperationsEvenHandler();
    }

    // Refresh page if Sign In page is encountered to recheck for Verification Page
    else if (pagetitle.includes("Sign In to Best Buy")) {
        console.log('Sign In page detected, monitoring for verification page');
        setInterval(function() {
            console.log('Waiting for Sign in');
            var Recovery_pagetitle = String(document.title);
            if (Recovery_pagetitle.includes("Recovery")) {
                verificationpageEventHandler();
            }
        }, 1000);
    }

    // Check for Verification Page
    else if (pagetitle.includes("Recovery")) {
        console.log('Recovery page detected');
        verificationpageEventHandler();
    }

    // Handle product page
    else if (pagetitle.includes(ITEM_KEYWORD)) {
        console.log('Product page with keyword detected');
        const $badge = createFloatingBadge("Auto Detecting Mode", "Initializing..");
        document.body.appendChild($badge);
        $badge.style.transform = "translate(0, 0)";

        // Create countdown timer for refresh
        createCountdownTimer();

        // Find Sold Out or Coming Soon button
        const buttons = document.getElementsByTagName('button');
        let soldOutFound = false;

        // Check for "Sold Out" or "Coming Soon" text in any button - using more flexible matching
        if (DEBUG) console.log('Checking for sold out or coming soon buttons');
        for (const button of buttons) {
            const buttonText = button.textContent.trim().toLowerCase();
            if (DEBUG && buttonText) console.log('Button text:', buttonText);

            if (buttonText.includes('sold out') || buttonText.includes('coming soon')) {
                console.log('Found unavailable button:', button.textContent.trim());
                soldOutFound = true;
                break;
            }
        }

        // If Sold Out or Coming Soon is found, show appropriate message
        if (soldOutFound) {
            console.log('Item unavailable (Sold Out/Coming Soon) detected');
            const $badge = createFloatingBadge(
                "No Stock Found | Note: Run bot only during a drop ",
                "Refreshing every " + OOS_REFRESH + " seconds until available"
            );
            document.body.appendChild($badge);
            $badge.style.transform = "translate(0, 0)";
        } else {
            console.log('Item may be available: Checking for ATC Button');
            // Add to Cart Button Classes Layers
            var InStockButton;
            const InStockButton_L1 = "btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button";
            const InStockButton_L2 = "c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button";
            const InStockButton_L3 = "c-button c-button-secondary c-button-md c-button-block";

            if (document.getElementsByClassName(InStockButton_L1).length > 0) {
                InStockButton = document.getElementsByClassName(InStockButton_L1);
                console.log('InStockButton Class ID 1 : ' + InStockButton_L1);
            } else if (document.getElementsByClassName(InStockButton_L2).length > 0) {
                InStockButton = document.getElementsByClassName(InStockButton_L2);
                console.log('InStockButton Class ID 2 :' + InStockButton_L2);
            } else if (document.getElementsByClassName(InStockButton_L3).length > 0) {
                InStockButton = document.getElementsByClassName(InStockButton_L3);
                console.log('InStockButton Class ID 3 :' + InStockButton_L3);
            }

            // Checking if ATC button is found
            if (InStockButton && InStockButton.length > 0) {
                console.log('Add to Cart Found');
                let ATC_Color = window.getComputedStyle(InStockButton[0]).backgroundColor;

                if (ATC_Color === 'rgb(197, 203, 213)') {
                    console.log('ATC is grey! You have already pressed please wait for this item. Lets wait until we can bag this.');
                    instockEventHandler();
                } else {
                    setTimeout(function() {
                        console.log('ATC button is yellow! Pressing it!');
                        InStockButton[0].onclick = instockEventHandler;
                        InStockButton[0].addEventListener("click", instockEventHandler, false);
                        InStockButton[0].click();
                    }, 2000);
                }
            }
        }
    }
    // CHECKOUT PAGE OPERATIONS (FIXED TO PROPERLY CLICK PLACE ORDER)
    else if (location.href.includes("www.bestbuy.com/checkout")) {
        const $badge = createFloatingBadge("Final CheckPoint", "Verifying and Submitting");
        document.body.appendChild($badge);
        $badge.style.transform = "translate(0, 0)";

        // Play chime to alert user
        playChime();

        let checkoutAttempts = 0;
        const MAX_CHECKOUT_ATTEMPTS = 3;

        function clickPlaceOrder() {
            if (TESTMODE.trim().toLowerCase() === "no") {
                console.log('Test mode is off, attempting to place order');

                // Try multiple selectors to find the Place Order button
                let placeOrderButton = null;

                // First attempt - direct attribute
                placeOrderButton = document.querySelector('button[data-track="Place your order"]');
                if (placeOrderButton) console.log('Found button via data-track attribute');

                // Second attempt - text content
                if (!placeOrderButton) {
                    console.log('Trying to find button by text content');
                    const allButtons = document.querySelectorAll('button');
                    for (const button of allButtons) {
                        if (button.textContent &&
                            button.textContent.toLowerCase().includes('place') &&
                            button.textContent.toLowerCase().includes('order')) {
                            placeOrderButton = button;
                            console.log('Found button via text content');
                            break;
                        }
                    }
                }

                // Third attempt - specific classes
                if (!placeOrderButton) {
                    console.log('Trying to find button by class combinations');
                    const buttonSelectors = [
                        'button.btn.btn-lg.btn-block.btn-primary',
                        'button.button__fast-track',
                        '.place-order button',
                        'button[type="submit"]',
                        '.order-summary__place-order button',
                        '.button-wrap button',
                        '.checkout-buttons button',
                        'button.place-order-button',
                        '.checkout-panel button.btn-primary',
                        '.button__place-order'
                    ];

                    for (const selector of buttonSelectors) {
                        const buttons = document.querySelectorAll(selector);
                        if (buttons.length > 0) {
                            console.log('Found potential buttons with selector: ' + selector);
                            for (const button of buttons) {
                                if (button.textContent &&
                                    button.textContent.toLowerCase().includes('place') &&
                                    button.textContent.toLowerCase().includes('order')) {
                                    placeOrderButton = button;
                                    console.log('Found matching button text within class selector');
                                    break;
                                }
                            }
                        }
                        if (placeOrderButton) break;
                    }
                }

                // Fourth attempt - any button with relevant classes
                if (!placeOrderButton) {
                    console.log('Final attempt - looking for any button with relevant classes');
                    const allButtons = document.querySelectorAll('button');
                    for (const button of allButtons) {
                        const classAttr = button.getAttribute('class') || '';
                        if ((classAttr.includes('primary') || classAttr.includes('order') || classAttr.includes('checkout')) &&
                            button.textContent &&
                            (button.textContent.toLowerCase().includes('place') ||
                             button.textContent.toLowerCase().includes('order') ||
                             button.textContent.toLowerCase().includes('submit'))) {
                            placeOrderButton = button;
                            console.log('Found button via class analysis:', button.textContent);
                            break;
                        }
                    }
                }

                if (placeOrderButton) {
                    console.log('Found Place Order button, attempting to click...');

                    // Try different methods to click the button
                    try {
                        // Method 1: Standard click
                        placeOrderButton.click();
                        console.log('Standard click executed');

                        // Method 2: Dispatch mouse events with delay
                        setTimeout(() => {
                            try {
                                placeOrderButton.dispatchEvent(new MouseEvent('click', {
                                    bubbles: true,
                                    cancelable: true,
                                    view: window
                                }));
                                console.log('MouseEvent click dispatched');
                            } catch (e) {
                                console.error('Error dispatching mouse event:', e);
                            }
                        }, 500);

                        // Method 3: Try to submit the form if button is in a form
                        setTimeout(() => {
                            try {
                                const form = placeOrderButton.closest('form');
                                if (form) {
                                    form.submit();
                                    console.log('Form submission attempted');
                                }
                            } catch (e) {
                                console.error('Error submitting form:', e);
                            }
                        }, 1000);
                    } catch (clickErr) {
                        console.error('Error clicking button:', clickErr);
                    }
                } else {
                    console.log('Place Order button not found after multiple attempts');
                    console.log('Dumping all buttons on page for debugging:');
                    const allButtons = document.querySelectorAll('button');
                    allButtons.forEach((btn, index) => {
                        console.log(`Button ${index}: text="${btn.textContent.trim()}", class="${btn.getAttribute('class') || 'none'}"`);
                    });
                }
            } else {
                console.log('Test mode enabled, not placing order. TESTMODE value:', TESTMODE);
            }
        }

        function attemptCheckout() {
            checkoutAttempts++;
            console.log(`Checkout attempt ${checkoutAttempts} of ${MAX_CHECKOUT_ATTEMPTS}`);

            try {
                // Check for CVV field with multiple possible IDs
                var CVV_ID;
                const CVV_ID_L1 = "cvv";
                const CVV_ID_L2 = "credit-card-cvv";
                const CVV_ID_L3 = "security-code";
                const CVV_ID_L4 = "creditCardCvv";

                if (document.getElementById(CVV_ID_L1)) {
                    CVV_ID = CVV_ID_L1;
                    console.log('Found CVV field with ID:', CVV_ID);
                } else if (document.getElementById(CVV_ID_L2)) {
                    CVV_ID = CVV_ID_L2;
                    console.log('Found CVV field with ID:', CVV_ID);
                } else if (document.getElementById(CVV_ID_L3)) {
                    CVV_ID = CVV_ID_L3;
                    console.log('Found CVV field with ID:', CVV_ID);
                } else if (document.getElementById(CVV_ID_L4)) {
                    CVV_ID = CVV_ID_L4;
                    console.log('Found CVV field with ID:', CVV_ID);
                }

                // Try to find CVV by name or placeholder
                if (!CVV_ID) {
                    console.log('Searching for CVV field by attribute...');
                    const cvvInputs = document.querySelectorAll('input[name*="cvv"], input[name*="security"], input[name*="cvc"], input[placeholder*="CVV"], input[placeholder*="security code"]');
                    if (cvvInputs.length > 0) {
                        const cvvField = cvvInputs[0];
                        console.log('Found CVV input by attribute:', cvvField);

                        // Set value directly
                        cvvField.focus();
                        cvvField.select();
                        if (!document.execCommand('insertText', false, CREDITCARD_CVV)) {
                            cvvField.value = CREDITCARD_CVV;
                        }
                        console.log('CVV entered, proceeding to place order...');
                        setTimeout(clickPlaceOrder, 1500);
                        return;
                    }
                }

                // If CVV field found by ID, enter it then click Place Order
                if (document.getElementById(CVV_ID)) {
                    console.log('Entering CVV value...');
                    const cvvField = document.getElementById(CVV_ID);
                    cvvField.focus();
                    cvvField.select();
                    if (!document.execCommand('insertText', false, CREDITCARD_CVV)) {
                        cvvField.value = CREDITCARD_CVV;
                    }
                    console.log('CVV entered, proceeding to place order...');
                    setTimeout(clickPlaceOrder, 1500);
                } else {
                    // No CVV field found, try to click Place Order directly
                    console.log('No CVV field found, proceeding directly to Place Order');
                    clickPlaceOrder();
                }
            } catch (err) {
                console.error('Error during checkout attempt:', err);

                // Retry if not exceeded max attempts
                if (checkoutAttempts < MAX_CHECKOUT_ATTEMPTS) {
                    console.log(`Retrying checkout in 2 seconds... (Attempt ${checkoutAttempts + 1})`);
                    setTimeout(attemptCheckout, 2000);
                } else {
                    console.log('Max checkout attempts reached. Unable to complete checkout.');

                    // One final try with the most basic approach
                    console.log('Attempting one final approach...');
                    try {
                        const finalButtons = document.querySelectorAll('button');
                        for (const button of finalButtons) {
                            if (button.textContent && button.textContent.toLowerCase().includes('place') && button.textContent.toLowerCase().includes('order')) {
                                console.log('Final attempt - clicking button with text:', button.textContent);
                                button.click();
                                break;
                            }
                        }
                    } catch (e) {
                        console.error('Final attempt failed:', e);
                    }
                }
            }
        }

        // Start the checkout process
        setTimeout(attemptCheckout, 2000);
    }
    // SIGN IN OPERATIONS
    else if (location.href.includes("www.bestbuy.com/identity/signin")) {
        const $badge = createFloatingBadge("Sign-In Page Detected | Please have your credentials saved ", "Clicking Sign-In in 5 Seconds");
        document.body.appendChild($badge);
        $badge.style.transform = "translate(0, 0)";

        setTimeout(function() {
            var signInButton = document.getElementsByClassName("c-button c-button-secondary c-button-lg c-button-block c-button-icon c-button-icon-leading cia-form__controls__submit")[0];
            if (signInButton) {
                signInButton.click();
            } else {
                console.error('Sign in button not found');
            }
        }, 5000);
    }
    // For any other BestBuy page, check if we should add a refresh timer
    else if (location.href.includes("www.bestbuy.com")) {
        console.log('On a BestBuy page, adding refresh countdown timer');
        createCountdownTimer();
    }
}
