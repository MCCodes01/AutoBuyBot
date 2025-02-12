// ==UserScript==
// @name     BestBuy-RefreshNoBot
// @include  https://www.bestbuy.com/*
// @version      4.1a
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

 const ITEM_KEYWORD= "***"; // NO SPACES IN KEYWORD - ONLY ONE WORD
 const CREDITCARD_CVV = "***"; // BOT will run without changing this value.
 const TESTMODE = "Yes"; // TESTMODE = "No" will buy the card
 const SMS_DIGITS = "****"; // Enter last 4 digits of phone # for SMS verification (required for verification)

 //____ PLEASE WAIT FLAGS : ADVANCED OPTIONS _____________________________

 //const QUEUE_TIME_CUTOFF = 0 // (in Minutes) Keep retrying until queue time is below.
 //onst NEW_QUEUE_TIME_DELAY = 5 // (in Seconds) Ask new queue time set seconds
 const OOS_REFRESH = 10 // (in Seconds) Refresh rate on OOS item.

 //____ LAZY FLAGS : WILL NOT AFFECT BOT PERFORMACE _____________________

 const MAX_RETRIES = "500" // Fossil of EARTH

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
    const queues= JSON.parse(atob(localStorage.getItem('purchaseTracker')));
    console.log(queues);

    const skuQueue = queues[sku];
    if(!skuQueue){
        return null;
    }
    return skuQueue;
}

function getQueueTimeStartMs(sku){
    return getRecordForSku(sku)[0];
}

function getQueueDurationMs(sku){
    return getQueueTimeFromEncodedString(getRecordForSku(sku)[2]);
}

var sku = location.search.split('=')[1];
console.log('found sku', sku);

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

             return [remainingMin, remainingSec]


         } catch (e) {
         }
     };

 //________________________________________________________________________

                  // Create Floating Status Bar
 //________________________________________________________________________

 function createFloatingBadge(mode,status) {

     const iconUrl = "https://kkapuria3.github.io/images/KK.png";
     const $container = document.createElement("div");
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
     var MAIN_TITLE = (" OpenSourceBots | BestBuyBot v4.1 | ◻️TESTMODE: " +TESTMODE + "◻️ITEM KEYWORD: " + ITEM_KEYWORD+ "◻️OOS REFRESH: " + OOS_REFRESH);
     $text.innerText = MAIN_TITLE;
     $mode.innerText = mode;
     $status1.innerText = status;

     $container.style.cssText = "position:fixed;left:0;bottom:0;width:850px;height:75px;background: black;";
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
     $container.appendChild($status1)

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
     setTimeout(function()
     {
             if (location.href.includes("www.bestbuy.com/cart")) {
                 //Create Custom Badge
                 //
                 const $badge = createFloatingBadge("Cart Page 🛑 Do Not Refresh. Only one item can be carted per account.","Verfying that first item in CART has KEYWORD");
                 document.body.appendChild($badge);
                 $badge.style.transform = "translate(0, 0)"

                 //Wait 3 Seconds on Cart Page
                 //
                 setTimeout(function() {
                     //We will verify the first time in the cart. If the item name has the Keyword, that means the item was sucessfully added to cart.
                     //In that case the checkout button is clicked.
                     //
                     var CartItemCheck = document.getElementsByClassName("cart-item__title focus-item-0");
                     //console.log(CartItemCheck[0])
                     //
                     //
                     if (CartItemCheck[0] != null) {
                         if (CartItemCheck[0].innerHTML.includes(ITEM_KEYWORD)){
                             //
                             console.log('Item Has been Confirmed !')
                             console.log('Click Checkout')
                             var CheckoutButton = document.getElementsByClassName("btn btn-lg btn-block btn-primary");
                             CheckoutButton[0].click()
                             CheckoutButton = null ;
                         }
                     }
                 }, 2000 )//Three seconds will elapse and Code will execute.

             }
     }, 4000)
 }

 //________________________________________________________________________

                      //    VERIFICATION PAGE EventHandler
 //________________________________________________________________________

 function verificationpageEventHandler (evt) {
     console.log('Verification Step Reached')
     playChime();
     setTimeout(function()
     {
             if (location.href.indexOf("identity/signin/recoveryOptions") > -1) {
                 //Create Custom Badge
                 //
                 const $badge = createFloatingBadge("Get Ready To Verify 🛑 Do Not Refresh ","Validating and Entering SMS Digits | It will error if you havent updated SMS_DIGITS ");
                 document.body.appendChild($badge);
                 $badge.style.transform = "translate(0, 0)"
                 setTimeout(function()
                 {
                     var ContinueButton;
                     const ContinueButton_L1 = "btn btn-secondary btn-lg btn-block c-button-icon c-button-icon-leading cia-form__controls__submit "
                     const ContinueButton_L2 = "c-button c-button-secondary c-button-lg c-button-block c-button-icon c-button-icon-leading cia-form__controls__submit "
                     const ContinueButton_L3 = "c-button c-button-secondary c-button-md c-button-block"

                     if (document.getElementsByClassName(ContinueButton_L1).length == 1)
                                                                 {
                          ContinueButton = document.getElementsByClassName(ContinueButton_L1);
                          console.log('ContinueButton Class ID 1 : ' + ContinueButton_L1)
                     } else if (document.getElementsByClassName(ContinueButton_L2).length == 1) {
                          ContinueButton = document.getElementsByClassName(ContinueButton_L2);
                          console.log('ContinueButton Class ID 2 :' + ContinueButton_L2)

                     } else if (document.getElementsByClassName(ContinueButton_L3).length == 1) {
                          ContinueButton = document.getElementsByClassName(ContinueButton_L3);
                          console.log('ContinueButton Class ID 2 :' + ContinueButton_L3)

                     }

                     document.getElementById("smsDigits").focus();
                     document.getElementById("smsDigits").select();
                     if (!document.execCommand('insertText',false, SMS_DIGITS)) {
                         document.getElementById("smsDigits").value = SMS_DIGITS;
                     }
                     if (ContinueButton.length == 1) {
                         ContinueButton[0].click()
                         ContinueButton = null;
                     }
                 }, 1500)
            }
     }, 2000)
 }

 //________________________________________________________________________

                  //  SECOND ADD TO CART EventHandler
 //________________________________________________________________________


function pleasewaitcompletedEventHandler(evt) {
    // Wait 4 seconds before clicking the final "Go to Cart" button
    setTimeout(function() {
        var GotoCartButton;
        // Existing class strings...
        const GotoCartButton_L1 = "c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block";
        const GotoCartButton_L2 = "c-button c-button-secondary c-button-sm c-button-block";
        // NEW variant that matches your provided HTML element:
        const GotoCartButton_L3 = "c-button c-button-secondary c-button-md c-button-block";
        if (document.getElementsByClassName(GotoCartButton_L1).length > 0) {
            GotoCartButton = document.getElementsByClassName(GotoCartButton_L1);
            console.log('GotoCartButton Class ID 1 : ' + GotoCartButton_L1);
        } else if (document.getElementsByClassName(GotoCartButton_L2).length > 0) {
            GotoCartButton = document.getElementsByClassName(GotoCartButton_L2);
            console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L2);
        } else if (document.getElementsByClassName(GotoCartButton_L3).length > 0) {
            GotoCartButton = document.getElementsByClassName(GotoCartButton_L3);
            console.log('GotoCartButton Class ID 3 :' + GotoCartButton_L3);
        }
        // If the button is found, iterate and click the one that links to the cart page.
        if (GotoCartButton != null) {
            for (var i = 0; i < GotoCartButton.length; i++) {
                if (GotoCartButton[i].href === 'https://www.bestbuy.com/cart' ||
                    GotoCartButton[i].href === '/cart') {
                    // Set up the click event handler
                    GotoCartButton[i].onclick = cartpageoperationsEvenHandler;
                    GotoCartButton[i].addEventListener("click", cartpageoperationsEvenHandler, false);
                    // Trigger a click on the element
                    GotoCartButton[i].click();
                    GotoCartButton = null;
                    break;
                }
            }
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
         const InStockButton_L1 = "btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button"
         const InStockButton_L2 = "c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button"
         const InStockButton_L3 = "c-button c-button-secondary c-button-md c-button-block"

         if (document.getElementsByClassName(InStockButton_L1).length > 0)
         {
              InStockButton = document.getElementsByClassName(InStockButton_L1);
              console.log('instockEventHandler Button Class 1 : ' + InStockButton_L1)

         } else if (document.getElementsByClassName(InStockButton_L2).length > 0) {

             InStockButton = document.getElementsByClassName(InStockButton_L2);
             console.log('instockEventHandler Button Class  2 :' + InStockButton_L2)

         } else if (document.getElementsByClassName(InStockButton_L3).length > 0) {

             InStockButton = document.getElementsByClassName(InStockButton_L3);
             console.log('instockEventHandler Button Class  3 :' + InStockButton_L3)

         }

         setTimeout(function() {
          let MainButtonColor = window.getComputedStyle(InStockButton[0]).backgroundColor;
         //Code to run After timeout elapses
           console.log('Confirming Button Color : ' + MainButtonColor)

                 if (MainButtonColor === 'rgb(197, 203, 213)') {

                         console.log('Button Color Gray. Is it still Adding ?')

                         setTimeout(function() {

                                 var REALLY_PLEASE_WAIT = window.getComputedStyle(InStockButton[0]).backgroundColor;

                                 if (REALLY_PLEASE_WAIT === 'rgb(197, 203, 213)') {

                                         console.log('Its really Please Wait.')

                                         var MODE = "Do not Refresh 🛑 For new queue time open this link in new firefox container tab"
                                         //
                                         var RETRY_COUNT = "1"
                                         let RETRY_QUEUE_COUNT = 0
                                         let QUEUE_TRY_COUNT = 0
                                         // Run this every 5 seconds
                                         setInterval(function() {
                                                 // run checkQueueTimeRemaining Function which returns [remainingMin, remainingSec]
                                                 const [remainingMin, remainingSec] = checkQueueTimeRemaining();
                                                 //DEBUG//console.log(remainingMin,'m : ', remainingSec,'s')
                                                 const queueBadge = 'Queue Time : ' + remainingMin + 'm : '+ remainingSec+'s'
                                                 const $badge = createFloatingBadge(MODE,queueBadge);
                                                 document.body.appendChild($badge);
                                                 $badge.style.transform = "translate(0, 0)"
                                                 // Run this every 20 seconds
                                                 setTimeout(function() {

                                                         //Find the Color of Main Button in Firefox
                                                         var PleaseWait;
                                                         const PleaseWait_L1 = "btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button"
                                                         const PleaseWait_L2 = "c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button"
                                                         const PleaseWait_L3 = "c-button c-button-secondary c-button-md c-button-block"

                                                         if (document.getElementsByClassName(PleaseWait_L1).length == 1)
                                                         {
                                                              PleaseWait = document.getElementsByClassName(PleaseWait_L1);
                                                              console.log('PleaseWait Button Class 1 : ' + PleaseWait_L1)

                                                         } else if (document.getElementsByClassName(PleaseWait_L2).length == 1) {

                                                             PleaseWait = document.getElementsByClassName(PleaseWait_L2);
                                                             console.log('PleaseWait Button Class  2 :' + PleaseWait_L2)
                                                         } else if (document.getElementsByClassName(PleaseWait_L3).length == 1) {

                                                             PleaseWait = document.getElementsByClassName(PleaseWait_L3);
                                                             console.log('PleaseWait Button Class  3 :' + PleaseWait_L3)
                                                         }

                                                         let MainButtonColor = window.getComputedStyle(PleaseWait[0]).backgroundColor;
                                                         //console.log(MainButtonColor);
                                                         console.log("Please Wait Button Detected :" + MainButtonColor + " | Lets keep trying ..");

                                                         if (MainButtonColor === 'rgb(255, 224, 0)' || MainButtonColor === 'rgb(0, 70, 190)') {
                                                                 // Color of Button Changes to yellow then click again
                                                                 let ATC_Color = window.getComputedStyle(InStockButton[0]).backgroundColor;
                                                                 // When button turns yellow, we scream bagged !
                                                                 console.log("Add to Cart is available:" + ATC_Color + " | Lets Bag This ! ");
                                                                 var ATCYellowButton;
                                                                 const ATCYellowButton_L1 = "btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button"
                                                                 const ATCYellowButton_L2 = "c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button"
                                                                 const ATCYellowButton_L3 = "c-button c-button-secondary c-button-md c-button-block"

                                                                 if (document.getElementsByClassName(ATCYellowButton_L1).length == 1)
                                                                 {
                                                                      ATCYellowButton = document.getElementsByClassName(ATCYellowButton_L1);
                                                                      console.log('PleaseWait Button Class 1 : ' + ATCYellowButton_L1)

                                                                 } else if (document.getElementsByClassName(ATCYellowButton_L2).length == 1) {

                                                                     ATCYellowButton = document.getElementsByClassName(ATCYellowButton_L2);
                                                                     console.log('PleaseWait Button Class  2 :' + ATCYellowButton_L2)
                                                                 } else if (document.getElementsByClassName(ATCYellowButton_L3).length == 1) {

                                                                     ATCYellowButton = document.getElementsByClassName(ATCYellowButton_L3);
                                                                     console.log('PleaseWait Button Class  2 :' + ATCYellowButton_L3)
                                                                 }

                                                                 // Now we will use event handlers to check for clicks. We have create a function on top defining instockEventhandler.
                                                                 // It is said this this method reduces memory leaks
                                                                 ATCYellowButton[0].onclick = pleasewaitcompletedEventHandler;
                                                                 ATCYellowButton[0].addEventListener("click", pleasewaitcompletedEventHandler, false);
                                                                 // When a click event is detected for parsed element, please execute the function from uptop
                                                                 ATCYellowButton[0].click(pleasewaitcompletedEventHandler);

                                                         } else {
                                                                 // Is queue bypass available ?
                                                                 // If available lets check add to cart button instanly
                                                                 // Press secondary button
                                                                 console.log("Checking bypass")
                                                                 var GotoCartButton;
                                                                 const GotoCartButton_L1 = "c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block"
                                                                 const GotoCartButton_L2 = "c-button c-button-secondary c-button-md c-button-block "
                                                                 const GotoCartButton_L3 = "c-button c-button-secondary c-button-md c-button-block"

                                                                 if (document.getElementsByClassName(GotoCartButton_L1).length > 0)
                                                                 {
                                                                      GotoCartButton = document.getElementsByClassName(GotoCartButton_L1);
                                                                      console.log('GotoCartButton Class ID 1 : ' + GotoCartButton_L1)
                                                                 } else if (document.getElementsByClassName(GotoCartButton_L2).length > 0) {
                                                                      GotoCartButton = document.getElementsByClassName(GotoCartButton_L2);
                                                                      console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L2)

                                                                 } else if (document.getElementsByClassName(GotoCartButton_L3).length > 0) {
                                                                      GotoCartButton = document.getElementsByClassName(GotoCartButton_L3);
                                                                      console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L3)

                                                                 }

                                                                 if (GotoCartButton != null) {
                                                                    for (var i=0;i<GotoCartButton.length; i++) {
                                                                        if (GotoCartButton[i].href == 'https://www.bestbuy.com/cart'){
                                                                            GotoCartButton[i].onclick = cartpageoperationsEvenHandler;
                                                                            GotoCartButton[i].addEventListener ("click", cartpageoperationsEvenHandler, false);
                                                                            // When a click event is detected for parsed element, please execute the function from uptop
                                                                            GotoCartButton[i].click (cartpageoperationsEvenHandler);
                                                                            GotoCartButton = null ;
                                                                        }
                                                                    }
                                                                 }

                                                                 /*
                                                                 // OLD CODE {might be useful for later}

                                                                 const regex = /(?<=Time Remaining: )(.*)(?= min)/g;
                                                                 const found = time.match(regex);
                                                                 console.log(found[0])
                                                                 if ((found[0] > QUEUE_TIME_CUTOFF) && (RETRY_QUEUE_COUNT < RETRY_COUNT)) {
                                                                         RETRY_QUEUE_COUNT += NEW_QUEUE_TIME_DELAY;
                                                                         let BetterTimeColor = window.getComputedStyle(BetterTime).backgroundColor
                                                                         BetterTime.click()
                                                                         QUEUE_TRY_COUNT++;
                                                                         console.log(BetterTimeColor)
                                                                         if (BetterTimeColor === 'rgb(197, 203, 213)') {
                                                                                 //console.log('refresh')
                                                                                 //window.open(window.location.href, '_blank');
                                                                                 //window.close();
                                                                                 location.reload();
                                                                         }
                                                                 }*/


                                                         }

                                                         //

                                                 }, 5 * 1000);

                                                 RETRY_COUNT++;
                                                 if (RETRY_COUNT > MAX_RETRIES) {
                                                         location.reload();
                                                 }

                                         }, 1000)

                                 } else {
                                         setTimeout(function() {
                                                 // Press secondary button
                                                 console.log('Level 2 | Blue Cart Button Appears')
                                                 var GotoCartButton;
                                                 const GotoCartButton_L1 = "c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block"
                                                 const GotoCartButton_L2 = "c-button c-button-secondary c-button-sm c-button-block "
                                                 const GotoCartButton_L3 = "c-button c-button-secondary c-button-md c-button-block"

                                                 if (document.getElementsByClassName(GotoCartButton_L1).length > 0)
                                                 {
                                                      GotoCartButton = document.getElementsByClassName(GotoCartButton_L1);
                                                      console.log('GotoCartButton Class ID 1 : ' + GotoCartButton_L1)
                                                 } else if (document.getElementsByClassName(GotoCartButton_L2).length > 0) {
                                                      GotoCartButton = document.getElementsByClassName(GotoCartButton_L2);
                                                      console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L2)

                                                 } else if (document.getElementsByClassName(GotoCartButton_L3).length > 0) {
                                                      GotoCartButton = document.getElementsByClassName(GotoCartButton_L3);
                                                      console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L3)

                                                 }

                                                 if (GotoCartButton != null) {
                                                    for (var i=0;i<GotoCartButton.length; i++) {
                                                        if (GotoCartButton[i].href == 'https://www.bestbuy.com/cart'){
                                                            GotoCartButton[i].onclick = cartpageoperationsEvenHandler;
                                                            GotoCartButton[i].addEventListener ("click", cartpageoperationsEvenHandler, false);
                                                            // When a click event is detected for parsed element, please execute the function from uptop
                                                            GotoCartButton[i].click (cartpageoperationsEvenHandler);
                                                            GotoCartButton = null ;
                                                        }
                                                    }
                                                 }
                                         }, 2000) // If item is not please waited then it will open go to cart again. This only happens for in stock items

                                 }

                         }, 1000)

                 } else {
                         setTimeout(function() {
                                 // Press secondary button
                                 console.log('Level 1 | Blue Cart Button Appears')
                                 var GotoCartButton;
                                 const GotoCartButton_L1 = "c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block"
                                 const GotoCartButton_L2 = "c-button c-button-secondary c-button-sm c-button-block "
                                 const GotoCartButton_L3 = "c-button c-button-secondary c-button-md c-button-block"

                                 if (document.getElementsByClassName(GotoCartButton_L1).length > 0)
                                 {
                                      GotoCartButton = document.getElementsByClassName(GotoCartButton_L1);
                                      console.log('GotoCartButton Class ID 1 : ' + GotoCartButton_L1)
                                 } else if (document.getElementsByClassName(GotoCartButton_L2).length > 0) {
                                      GotoCartButton = document.getElementsByClassName(GotoCartButton_L2);
                                      console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L2)

                                 } else if (document.getElementsByClassName(GotoCartButton_L3).length > 0) {
                                      GotoCartButton = document.getElementsByClassName(GotoCartButton_L3);
                                      console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L3)

                                 }

                                 if (GotoCartButton != null) {
                                    for (var i=0;i<GotoCartButton.length; i++) {
                                        if (GotoCartButton[i].href == 'https://www.bestbuy.com/cart'){
                                            GotoCartButton[i].onclick = cartpageoperationsEvenHandler;
                                            GotoCartButton[i].addEventListener ("click", cartpageoperationsEvenHandler, false);
                                            // When a click event is detected for parsed element, please execute the function from uptop
                                            GotoCartButton[i].click (cartpageoperationsEvenHandler);
                                            GotoCartButton = null ;
                                        }
                                    }
                                 }
                         }, 2000) // If item is not please waited then it will open go to cart again. This only happens for in stock items

                 }



         }, 1000); //Two seconds will elapse and Code will execute.
         //
 }
 //________________________________________________________________________

                            //  Main Code
 //________________________________________________________________________

function contains(a,b) {
    let counter = 0;
    for(var i = 0; i < b.length; i++) {
        if(a.includes(b[i])) counter++;
    }
    if(counter === b.length) return true;
    return false;
}

// Get Page Title
var pagetitle = String(document.title);

if (location.href.includes("www.bestbuy.com/cart")) {
    cartpageoperationsEvenHandler();
}

// Refresh page if Sign In page is encountered to recheck for Verification Page
if (pagetitle.includes("Sign In to Best Buy")) {
    setInterval(function() {
        console.log('Waiting for Sign in')
        var Recovery_pagetitle = String(document.title);
        if (Recovery_pagetitle.includes("Recovery")) {
            verificationpageEventHandler();
        }
    }, 1000);
}

// Check for Verification Page
if (pagetitle.includes("Recovery")) {
    verificationpageEventHandler();
}

if (pagetitle.includes(ITEM_KEYWORD)) {
    const $badge = createFloatingBadge("Auto Detecting Mode", "Initializing ..");
    console.log('BEGIN ')
    document.body.appendChild($badge);
    $badge.style.transform = "translate(0, 0)"

    // Find Sold Out button
    const buttons = document.getElementsByTagName('button');
    let soldOutFound = false;

    // Check for "Sold Out" text in any button
    for (const button of buttons) {
        if (button.textContent.trim() === 'Sold Out') {
            soldOutFound = true;
            break;
        }
    }

    // If Sold Out is found, start refresh cycle
    if (soldOutFound) {
        const $badge = createFloatingBadge(
            "No Stock Found | Note: Run bot only during a drop ",
            "Refreshing every " + OOS_REFRESH + " seconds until available"
        );
        document.body.appendChild($badge);
        $badge.style.transform = "translate(0, 0)";

        console.log('Sold Out Button Found: Starting refresh cycle');

        // Set up recurring refresh
        setInterval(function() {
            console.log('Refreshing page...');
            location.reload();
        }, OOS_REFRESH * 1000);
    } else {
        console.log('Item may be available: Checking for ATC Button');
        // Add to Cart Button Classes Layers
        var InStockButton;
        const InStockButton_L1 = "btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button"
        const InStockButton_L2 = "c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button"
        const InStockButton_L3 = "c-button c-button-secondary c-button-md c-button-block"

        if (document.getElementsByClassName(InStockButton_L1).length == 1) {
            InStockButton = document.getElementsByClassName(InStockButton_L1);
            console.log('InStockButton Class ID 1 : ' + InStockButton_L1)
        } else if (document.getElementsByClassName(InStockButton_L2).length == 1) {
            InStockButton = document.getElementsByClassName(InStockButton_L2);
            console.log('InStockButton Class ID 2 :' + InStockButton_L2)
        } else if (document.getElementsByClassName(InStockButton_L3).length == 1) {
            InStockButton = document.getElementsByClassName(InStockButton_L3);
            console.log('InStockButton Class ID 2 :' + InStockButton_L3)
        }

        // Checking if ATC button is found
        if (InStockButton.length > 0) {
            console.log('Add to Cart Found')
            let ATC_Color = window.getComputedStyle(InStockButton[0]).backgroundColor;

            if (ATC_Color === 'rgb(197, 203, 213)') {
                console.log('ATC is grey ! You have already pressed please wait for this item. Lets wait until we can bag this.')
                instockEventHandler();
            } else {
                setTimeout(function() {
                    console.log('ATC button is yellow ! Pressing it ! ')
                    InStockButton[0].onclick = instockEventHandler;
                    InStockButton[0].addEventListener("click", instockEventHandler, false);
                    InStockButton[0].click(instockEventHandler);
                }, 2000)
            }
        }
    }
}

// CART PAGE OPERATIONS
else if (location.href.includes("www.bestbuy.com/checkout")) {
    const $badge = createFloatingBadge("Final CheckPoint","Verifying and Submitting");
    document.body.appendChild($badge);
    $badge.style.transform = "translate(0, 0)"

    setTimeout(function() {
        try {
            function clickPlaceOrder() {
                if (TESTMODE === "No") {
                    let placeOrderButton = document.querySelector('button[data-track="Place your order"]');

                    if (!placeOrderButton) {
                        const buttonSelectors = [
                            'button.btn.btn-lg.btn-block.btn-primary',
                            'button.button__fast-track',
                            '.place-order button',
                            'button[type="submit"]'
                        ];

                        for (const selector of buttonSelectors) {
                            const buttons = document.querySelectorAll(selector);
                            for (const button of buttons) {
                                if (button.textContent &&
                                    button.textContent.toLowerCase().includes('place') &&
                                    button.textContent.toLowerCase().includes('order')) {
                                    placeOrderButton = button;
                                    break;
                                }
                            }
                            if (placeOrderButton) break;
                        }
                    }

                    if (!placeOrderButton) {
                        const buttonClass = document.getElementsByClassName("btn btn-lg btn-block btn-primary button__fast-track");
                        if (buttonClass.length > 0) {
                            placeOrderButton = buttonClass[0];
                        }
                    }

                    if (placeOrderButton) {
                        console.log('Found Place Order button, clicking...');
                        placeOrderButton.click();
                    } else {
                        console.log('Place Order button not found');
                    }
                }
            }

            // Check for CVV field
            var CVV_ID;
            const CVV_ID_L1 = "cvv"
            const CVV_ID_L2 = "credit-card-cvv"

            if (document.getElementById(CVV_ID_L1) != null) {
                CVV_ID = CVV_ID_L1;
            } else if (document.getElementById(CVV_ID_L2) != null) {
                CVV_ID = CVV_ID_L2;
            }

            // If CVV field exists, enter it then click Place Order
            if (document.getElementById(CVV_ID) != null) {
                document.getElementById(CVV_ID).focus();
                document.getElementById(CVV_ID).select();
                if (!document.execCommand('insertText',false, CREDITCARD_CVV)) {
                    document.getElementById(CVV_ID).value = CREDITCARD_CVV;
                }
                setTimeout(clickPlaceOrder, 1500);
            } else {
                // No CVV field, just click Place Order
                console.log('No CVV field found, proceeding to Place Order');
                clickPlaceOrder();
            }
        } catch (err) {
            console.error('Error during checkout:', err);
        }
    }, 2000);
}
 // SIGN IN OPERATIONS
 else if (location.href.includes("www.bestbuy.com/identity/signin")) {

         const $badge = createFloatingBadge("Sign-In Page Detected | Please have your credentials saved ","Clicking Sign-In in 5 Seconds");
         document.body.appendChild($badge);
         $badge.style.transform = "translate(0, 0)"

     setTimeout(function(){

         var signInButton = document.getElementsByClassName("c-button c-button-secondary c-button-lg c-button-block c-button-icon c-button-icon-leading cia-form__controls__submit")[0];
         signInButton.click()

         //
         //
     }, 5000);

 }