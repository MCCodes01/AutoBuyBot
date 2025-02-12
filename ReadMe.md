BestBuy-RefreshNoBot

A modified version of Karan Kapuria's Best Buy Bot. This Tampermonkey script automates the Best Buy purchase process, helping monitor item availability and attempt purchases when items come in stock.

Credit
This script is a modified version of the original [BestBuy-GPU-Bot](https://github.com/kkapuria3/BestBuy-GPU-Bot) created by Karan Kapuria. The current version includes modifications and improvements while maintaining the core functionality of the original bot.

⚠️ Disclaimer

This script is for educational purposes only. Using automated purchasing scripts may violate Best Buy's terms of service. Use at your own risk.

Features

- Automated item monitoring
- Auto-refresh on out-of-stock items
- Automatic add-to-cart when available
- Queue system handling
- SMS verification support
- Test mode for safe testing
- Visual status indicators

Prerequisites

1. Firefox browser (recommended)
2. [Tampermonkey](https://www.tampermonkey.net/) browser extension installed
3. Best Buy account with:
   - Saved shipping address
   - Saved payment method
   - SMS verification enabled

Installation

1. Install the Tampermonkey extension in your browser
2. Click on the Tampermonkey icon and select "Create new script"
3. Delete any existing code in the editor
4. Copy and paste the entire script code
5. Click File → Save or press Ctrl+S

Configuration

Edit these required constants at the top of the script:

```javascript
const ITEM_KEYWORD = "***";          // Product keyword to match (no spaces)
const CREDITCARD_CVV = "***";        // Your credit card CVV
const TESTMODE = "Yes";              // Set to "No" for actual purchases
const SMS_DIGITS = "****";           // Last 4 digits of your phone number
const OOS_REFRESH = 10;              // Refresh rate in seconds for out-of-stock items
const MAX_RETRIES = "500";           // Maximum retry attempts
```

Usage

1. Configure the script settings as described above
2. Navigate to the Best Buy product page of the item you want to monitor
3. The bot will automatically:
   - Check if the item is in stock
   - Refresh the page if out of stock
   - Attempt to purchase when available
   - Handle verification and checkout process

Status Indicators

The script displays a status bar at the bottom of the page showing:
- Current test mode status
- Item keyword being monitored
- Refresh rate settings
- Current operation status

Important Notes

1. Test Mode: Always test first with `TESTMODE = "Yes"` to ensure proper configuration
2. One Item Limit: The bot can only handle one item in cart at a time
3. Browser Settings:
   - Enable automatic sign-in for Best Buy
   - Save your payment information on Best Buy
   - Allow browser notifications if you want audio alerts

Troubleshooting

1. Verification Issues:
   - Ensure SMS_DIGITS is correctly set
   - Verify your phone number is confirmed with Best Buy

2. Add to Cart Issues:
   - Confirm ITEM_KEYWORD matches the product title
   - Check if you're already signed into Best Buy

3. Checkout Issues:
   - Verify saved payment method on Best Buy
   - Ensure correct CVV is configured
   - Check shipping address is saved

Support

This is a modified version of Karan Kapuria's open-source BestBuy-GPU-Bot project. While this version includes various modifications, the core functionality and foundation remain from the original work. For issues or improvements:
- Check the source code comments for additional details
- Verify your configuration matches the requirements
- Test in TESTMODE before attempting real purchases

Version

Current Version: 4.1a

Contributors

- Original Author: Karan Kapuria
- Modified by: MCCODES01

License

This project is for educational purposes only. Use responsibly and at your own risk.
