## Summary
Auto Heal is an automation script for Habitica that casts healing skills (Blessing & Healing Light) every 15 mins as needed to heal the player & their party. The script checks the health of the player & each party member before casting, so no mana is wasted. This script only works for healers.

## Before Installing
It is highly recommended that you use a desktop computer for this, as some of the steps don't work well on mobile. First you must uninstall any scripts that do the same thing(s) as Auto Heal. For example, if you are running the [Auto Cast Party Buff Skills](https://habitica.fandom.com/wiki/Google_Apps_Script#Auto_Cast_Party_Buff_Skills) script to cast healing skills, you need to uninstall it, because Auto Heal also casts healing skills, and these two scripts will conflict with each other. To uninstall a script:
1. Click [here](https://script.google.com/home) to see a list of your scripts. If you're not already signed into your Google account, click the "Start Scripting" button and sign in. Then click on "My Projects" in the main menu on the left.
2. Click on the script you want to uninstall.
3. Click the blue "Deploy" button near the top of the page, then click "Manage deployments".
4. Click the "Archive" button (looks like a box with a down arrow inside), then click the "Done" button. If the script has no deployments, there will be no archive button, and you will see the message "This project has not been deployed yet". In this case, just click "Cancel".
5. In the main menu on the left, click on "Triggers" (looks like an alarm clock).
6. Hover your mouse over each trigger in the list, click the three dots on the right, and click "Delete trigger".
7. If your script had no deployments, you can skip to the last step. If you clicked the "Archive" button, continue to the next step.
8. Click [here](https://habitica.com/user/settings/api) to open your API Settings. Highlight and copy your User ID (it looks something like this: `35c3fb6f-fb98-4bc3-b57a-ac01137d0847`).
9. Click [here](https://robwhitaker.com/habitica-webhook-editor/) to open the Habitica Webhook Editor. Paste your User ID in the "User ID" box.
10. On the same page where you copied your User ID, click the "Show API Token" button, and copy your API Token.
11. In the Habitica Webhook Editor, paste your API Token in the "API Token" box, then click "Login".
12. Click the "Delete" button next to every webhook that belongs to the script you are uninstalling. The webhook should have a large title that matches the name of the script.
13. Repeat the above steps for every script you need to uninstall.

## Setup Instructions
It is highly recommended that you use a desktop computer for this, as some of the steps don't work well on mobile. Make sure you read the [Before Installing](#before-installing) section above, and follow the instructions there if applicable!
1. Click [here](https://script.google.com/home/projects/1vJtM9OZy6zdSnrLTaHuE216WNwBcHwZYDQ5hUpthr151zMFeVwHGsVZH/) to go to the Auto Heal script. If you're not signed into your Google account, click on "Start Scripting", then sign in, then click on the script link again.
2. Click the "Make a copy" button (looks like two pages of paper).
3. At the top of your screen, click on "Copy of Auto Heal". Rename it "Auto Heal" and click the "Rename" button.
4. Click [here](https://habitica.com/user/settings/api) to open your API Settings. Highlight and copy your User ID (it looks something like this: `35c3fb6f-fb98-4bc3-b57a-ac01137d0847`). In the Auto Heal script, paste your User ID between the quotations where it says `const USER_ID = "";`. It should now look something like this: `const USER_ID = "35c3fb6f-fb98-4bc3-b57a-ac01137d0847";`
5. On the same page where you copied your User ID, click the "Show API Token" button, and copy your API Token. In the Auto Heal script, paste your API Token between the quotations where it says `const API_TOKEN = "";`. It should now look something like this: `const API_TOKEN = "35c3fb6f-fb98-4bc3-b57a-ac01137d0847";`
6. Click the "Save project" button near the top of the page (looks like a floppy disk).
7. Click the drop-down menu to the right of the "Debug" button, near the top of the page. Select "install" from the drop-down.
8. Click the "Run" button to the left of the "Debug" button.
9. (If this is your first time running the script) Click the "Review permissions" button and select your Google account. Click on "Advanced", then "Go to Auto Heal (unsafe)". (Don't worry, it is safe!) Then click "Continue", then "Allow".
10. Wait for the "Execution completed" message in the Execution Log.

You're all done! If you need to change the settings or uninstall the script at some point, follow the steps below.

## Uninstalling the Script
It is highly recommended that you use a desktop computer for this, as some of the steps don't work well on mobile.
1. [Click here](https://script.google.com/home) to see a list of your scripts. If you're not already signed into your Google account, click the "Start Scripting" button and sign in.  Then click on "My Projects" in the main menu on the left.
2. Click on "Auto Heal".
3. Click the drop-down menu to the right of the "Debug" button, near the top of the page. Select "uninstall" from the drop-down.
4. Click the "Run" button to the left of the "Debug" button. Wait for it to say "Execution completed".

## Updating the Script
It is highly recommended that you use a desktop computer for this, as some of the steps don't work well on mobile.
1. Follow the steps in [Uninstalling the Script](#uninstalling-the-script) above.
2. Copy & paste your settings (`const`s) into a text editor so you can reference them while setting up the new version.
3. In the main menu on the left, click on "Overview" (looks like a lowercase letter i inside a circle).
4. Click the "Remove project" button (looks like a trash can).
5. Follow the [Setup Instructions](#setup-instructions) above.

## Contact
❔ Questions: [https://github.com/bumbleshoot/auto-heal/discussions/categories/q-a](https://github.com/bumbleshoot/auto-heal/discussions/categories/q-a)  
💡 Suggestions: [https://github.com/bumbleshoot/auto-heal/discussions/categories/suggestions](https://github.com/bumbleshoot/auto-heal/discussions/categories/suggestions)  
🐞 Report a bug: [https://github.com/bumbleshoot/auto-heal/issues](https://github.com/bumbleshoot/auto-heal/issues)  
💗 Donate: [https://github.com/sponsors/bumbleshoot](https://github.com/sponsors/bumbleshoot)