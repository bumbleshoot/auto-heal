/**
 * Auto Heal v0.1.0 (beta) by @bumbleshoot
 * 
 * See GitHub page for info & setup instructions:
 * https://github.com/bumbleshoot/auto-heal
 */

 const USER_ID = "";
 const API_TOKEN = "";
 
/*************************************\
 *  DO NOT EDIT ANYTHING BELOW HERE  *
\*************************************/ 
 
const PARAMS = {
  "headers": {
    "x-api-user": USER_ID, 
    "x-api-key": API_TOKEN,
    "x-client": "35c3fb6f-fb98-4bc3-b57a-ac01137d0847-AutoHeal"
  },
  "muteHttpExceptions": true
};
const GET_PARAMS = Object.assign({ "method": "get" }, PARAMS);
const POST_PARAMS = Object.assign({ "method": "post" }, PARAMS);
 
function install() {
  if (validateConstants()) {
    ScriptApp.newTrigger("healParty")
      .timeBased()
      .everyMinutes(15)
      .create();
  }
}
 
function uninstall() {
  for (trigger of ScriptApp.getProjectTriggers()) {
    ScriptApp.deleteTrigger(trigger);
  }
}

function validateConstants() {

  let valid = true;

  if (typeof USER_ID !== "string" || USER_ID == "") {
    console.log("ERROR: USER_ID must equal your Habitica User ID.\n\neg. const USER_ID = \"abcd1234-ef56-gh78-ij90-abcdef123456\";\n\nYour Habitica User ID can be found at https://habitica.com/user/settings/api");
    valid = false;
  }

  if (typeof API_TOKEN !== "string" || API_TOKEN == "") {
    console.log("ERROR: API_TOKEN must equal your Habitica API Token.\n\neg. const API_TOKEN = \"abcd1234-ef56-gh78-ij90-abcdef123456\";\n\nYour Habitica API Token can be found at https://habitica.com/user/settings/api");
    valid = false;
  }

  if (valid) {
    try {
      let user = JSON.parse(fetch("https://habitica.com/api/v3/user", GET_PARAMS)).data;
      if (user.stats.class != "healer") {
        console.log("ERROR: This script only works for healers. Learn more about classes (including how to change your class) here: https://habitica.fandom.com/wiki/Class_System");
        valid = false;
      }
    } catch (e) {
      if (e.stack.includes("There is no account that uses those credentials")) {
        console.log("ERROR: Your USER_ID and/or API_TOKEN is incorrect. Both of these can be found at https://habitica.com/user/settings/api");
        valid = false;
      }
    }
  }

  return valid;
}

 /**
 * fetch(url, params)
 * 
 * Wrapper for Google Apps Script's UrlFetchApp.fetch(url, params):
 * https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#fetchurl,-params
 * 
 * Retries failed API calls up to 2 times & handles Habitica's rate 
 * limiting.
 */
function fetch(url, params) {

  // try up to 3 times
  for (let i=0; i<3; i++) {

    // if rate limit reached
    let rateLimitRemaining = scriptProperties.getProperty("X-RateLimit-Remaining");
    let rateLimitReset = scriptProperties.getProperty("X-RateLimit-Reset");
    if (rateLimitRemaining != null && Number(rateLimitRemaining) < 1) {

      // wait until rate limit reset
      let waitUntil = new Date(rateLimitReset);
      waitUntil.setSeconds(waitUntil.getSeconds() + 1);
      let now = new Date();
      Utilities.sleep(Math.max(waitUntil.getTime() - now.getTime(), 0));
    }

    // call API
    let response = UrlFetchApp.fetch(url, params);

    // store rate limiting data
    scriptProperties.setProperties({
      "X-RateLimit-Reset": response.getHeaders()["x-ratelimit-reset"],
      "X-RateLimit-Remaining": response.getHeaders()["x-ratelimit-remaining"]
    });

    // if success, return response
    if (response.getResponseCode() < 300) {
      return response;

    // if 3xx or 4xx or failed 3 times, throw exception
    } else if (response.getResponseCode() < 500 || i >= 2) {
      throw new Error("Request failed for https://habitica.com returned code " + response.getResponseCode() + ". Truncated server response: " + response.getContentText());
    }
  }
}

/**
 * getUser()
 * 
 * Fetches user data from the Habitica API if it hasn't already 
 * been fetched during this execution.
 */
 let user;
 function getUser() {
   if (typeof user === "undefined") {
     user = JSON.parse(fetch("https://habitica.com/api/v3/user", GET_PARAMS)).data;
   }
   return user;
 }

 /**
 * getMembers()
 * 
 * Fetches party member data from the Habitica API if it hasn't 
 * already been fetched during this execution.
 */
let members;
function getMembers() {
  if (typeof members === "undefined") {
    members = JSON.parse(fetch("https://habitica.com/api/v3/groups/party/members?includeAllPublicFields=true", GET_PARAMS)).data;
  }
  return members;
}

 /**
 * getContent()
 * 
 * Fetches content data from the Habitica API if it hasn't already 
 * been fetched during this execution.
 */
let content;
function getContent() {
  if (typeof content === "undefined") {
    content = JSON.parse(fetch("https://habitica.com/api/v3/content", GET_PARAMS)).data;
  }
  return content;
}

 /**
 * getTotalStat(stat)
 * 
 * Returns the total value of a stat, including level, buffs, allocated,
 * & equipment. Pass the name of the stat you want calculated to the 
 * function: "int", "con", "per", or "str".
 */
function getTotalStat(stat) {

  // INT is easy to calculate with a simple formula
  if (stat == "int") {
    return (getUser().stats.maxMP - 30) / 2;
  }

  // calculate stat from level, buffs, allocated
  let levelStat = Math.min(Math.floor(getUser().stats.lvl / 2), 50);
  let equipmentStat = 0;
  let buffsStat = user.stats.buffs[stat];
  let allocatedStat = user.stats[stat];

  // calculate stat from equipment
  for (equipped of Object.values(user.items.gear.equipped)) {
    let equipment = getContent().gear.flat[equipped];
    if (equipment != undefined) { 
      equipmentStat += equipment[stat];
      if (equipment.klass == user.stats.class || ((equipment.klass == "special") && (equipment.specialClass == user.stats.class))) {
        equipmentStat += equipment[stat] / 2;
      }
    }
  }

  // add all stat together and return
  return levelStat + equipmentStat + allocatedStat + buffsStat;
}

/**
 * healParty()
 * 
 * Casts Blessing enough times to heal all other party members,
 * then casts Healing Light enough times to finish healing the
 * player.
 */
function healParty() {

  // if lvl < 11, cannot cast healing spells
  if (getUser().stats.lvl < 11) {
    console.log("Player level " + user.stats.lvl + ", cannot cast healing skills");
    return;
  }

  let con = getTotalStat("con");
  let int = getTotalStat("int");

  // if lvl >= 14, cast blessing
  if (user.stats.lvl >= 14) {

    // get lowest party member health (excluding player)
    let lowestMemberHealth = 50;
    for (member of getMembers()) {
      if (member._id !== USER_ID && member.stats.hp < lowestMemberHealth) {
        lowestMemberHealth = member.stats.hp;
      }
    }

    // calculate number of blessings to cast
    let healthPerBlessing = (con + int + 5) * 0.04;
    let numBlessings = Math.min(Math.ceil((50 - lowestMemberHealth) / healthPerBlessing), Math.floor(user.stats.mp / 25));

    // cast blessing
    if (numBlessings > 0) {

      console.log("Lowest party member health: " + lowestMemberHealth);
      console.log("Casting Blessing " + numBlessings + " time(s)");
      
      for (let i=0; i<numBlessings; i++) {
        fetch("https://habitica.com/api/v3/user/class/cast/healAll", POST_PARAMS);
        user.stats.mp -= 25;
        user.stats.hp += healthPerBlessing;
      }
      user.stats.hp = Math.min(user.stats.hp, 50);
    }
  
  // if lvl < 14, cannot cast blessing
  } else {
    console.log("Player level " + user.stats.lvl + ", cannot cast Blessing");
  }

  // calculate number of healing lights to cast
  let numLights = Math.min(Math.max(Math.ceil((50 - user.stats.hp) / ((con + int + 5) * 0.075)), 0), Math.floor(user.stats.mp / 15));

  // cast healing light
  if (numLights > 0) {

    console.log("Player health: " + user.stats.hp);
    console.log("Casting Healing Light " + numLights + " time(s)");

    for (let i=0; i<numLights; i++) {
      fetch("https://habitica.com/api/v3/user/class/cast/heal", POST_PARAMS);
    }
  }
}