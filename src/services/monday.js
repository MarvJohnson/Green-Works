import mondaySdk from 'monday-sdk-js';
const monday = mondaySdk();

/**
 * Makes a call to the monday api to grab and return the active user's id and admin status.
 * @returns An object containing the number that uniquely identifies the monday user as well as a boolean representing their admin status.
 */
export async function getCurrentMondayUser() {
  try {
    const res = await monday.api(`query { me { id, is_admin } }`);

    const currentMondayUser = res.data.me;

    return currentMondayUser;
  } catch (err) {
    console.log("Couldn't find the current monday user! Returned: null\n", err);
    return null;
  }
}

/**
 * Makes a call to the monday api to grab and return all of the users belonging to the active workspace.
 * @returns An array of all users belonging to the active workspace, or an empty array if they couldn't be found.
 */
export async function getMondayUsers() {
  try {
    const res = await monday.api(
      `query { users { id, name, photo_thumb_small } }`
    );

    const mondayUsers = res.data.users;

    return mondayUsers;
  } catch (err) {
    console.log("Couldn't find monday users! Returned: []\n", err);
    return [];
  }
}

/**
 * Makes a call to the monday api to grab Green Works save data belonging to a specific user from the storage database.
 * @param {number} userID - A number that uniquely identifies a monday user.
 * @returns - The Green Works save data belonging to the user with the assigned userID, or null if the user couldn't be found.
 */
export async function getMondayUserSaveData(userID) {
  try {
    const res = await monday.storage.instance.getItem(userID);

    const userSaveData = JSON.parse(res.data.value);

    return userSaveData;
  } catch (err) {
    console.log("Couldn't find user save data! Returned: null\n", err);
    return null;
  }
}

/**
 * Makes a call to the monday api to store the user's information using the storage database.
 * @param {object} user - The user who's information is being saved.
 * @param {number} user.id - The unique identifier assigned to the user by monday.
 * @param {string} user.name - The user's full name.
 * @param {string} user.photo_thumb_small - A link to the user's avatar photo, as seen on monday.
 * @param {object[]} user.tasks - An array of all the tasks assigned to the user.
 * @param {object[]} user.settings - An array of the locally configured Green Works settings belonging to the user.
 */
export async function saveMondayUserData(user) {
  const userID = user.id;

  try {
    const userData = JSON.stringify(user);

    monday.storage.instance.setItem(userID, userData);
  } catch (err) {
    console.log(`Failed to save user(${userID})'s information!\n`, err);
  }
}

/**
 * Makes a call to the monday api to get the app's current context.
 * @returns - An object containing "information about where this app is currently displayed, depending on the type of feature".
 */
export async function getMondayContext() {
  try {
    const res = await monday.get('context');

    const mondayContext = res.data;

    return mondayContext;
  } catch (err) {
    console.log("Couldn't get monday context! Returned null", err);

    return null;
  }
}

/**
 * Makes a call to the monday api to fetch the settings for Green Works.
 * @returns - The settings for Green Works on monday.
 */
export async function getMondaySettings() {
  try {
    const res = await monday.get('settings');

    const mondaySettings = res.data;

    return mondaySettings;
  } catch (err) {
    console.log("Couldn't get monday settings! Returned empty object", err);

    return {};
  }
}

/**
 * Makes an api call to monday, updating Green Work's settings based on the 'settings' passed in.
 * @param {object} newSettings - An object containing the most up-to-date settings for Green Works on monday.
 * @return An object containing the updated settings, or null if the api call failed.
 */
export async function setMondaySettings(newSettings) {
  try {
    const res = await monday.set('settings', newSettings);

    const newMondaySettings = res.data.configuration.settings;

    return newMondaySettings;
  } catch (err) {
    console.log('Failed to set the monday settings!', err);

    return null;
  }
}

/**
 * Makes an api call to monday, getting the user's current filter.
 * @returns A string containing the user's filter on monday, or an empty string if the api call failed.
 */
export async function getMondayFilter() {
  try {
    const res = await monday.get('filter');

    const mondayFilter = res.data.term;

    return mondayFilter;
  } catch (err) {
    console.log("Couldn't get monday settings! Returned empty string", err);

    return '';
  }
}

/**
 * Uses the monday api to set up a listener for whenever settings change.
 * @param {function} callback - The function to invoke whenever this listener is updated.
 */
export function listenForMondaySettingsChange(callback) {
  try {
    monday.listen('settings', (res) => callback(res.data));
  } catch (err) {
    console.log('Failed setting up the monday listener for settings!', err);
  }
}

/**
 * Uses the monday api to set up a listener for whenever settings change.
 * @param {function} callback - The function to invoke whenever this listener is updated.
 */
export function listenForMondayContextChange(callback) {
  try {
    monday.listen('context', (res) => callback(res.data));
  } catch (err) {
    console.log('Failed setting up the monday listener for context!', err);
  }
}

/**
 * Uses the monday api to set up a listener for whenever settings change.
 * @param {function} callback - The function to invoke whenever this listener is updated.
 */
export function listenForMondayFilterChange(callback) {
  try {
    monday.listen('filter', (res) => callback(res.data.term));
  } catch (err) {
    console.log('Failed setting up the monday listener for filter!', err);
  }
}

/**
 * Requests monday display a confirmation popup.
 * @param {string} message - The text that will be displayed in the popup.
 * @param {string} confirmButton - The text displayed for the 'confirm' button.
 * @param {string} cancelButton - The text displayed for the 'cancel' button.
 * @param {boolean} excludeCancelButton - Whether the cancel button should be displayed.
 * @returns True if the user selected the 'confirm' button and false otherwise.
 */
export async function displayMondayConfirmation(
  message = 'Are you sure?',
  confirmButton = 'yes',
  cancelButton = 'no',
  excludeCancelButton = false
) {
  try {
    const res = await monday.execute('confirm', {
      message,
      confirmButton,
      cancelButton,
      excludeCancelButton
    });

    const confirmation = res.data.confirm;

    return confirmation;
  } catch (err) {
    console.log('Failed to display monday confirmation! Returned false', err);

    return false;
  }
}

/**
 * Makes a call to the monday api in order to send a notification (and potentially an email) to a specified user.
 * @param {string} message - The text that will be shown to the target user.
 * @param {string} userId - The unique monday idenfitier for the user.
 * @param {string} targetId - The Green Works board id.
 */
export async function sendMondayNotification(message, userId, targetId) {
  try {
    monday.api(`
      mutation {
        create_notification(
          text: "${message}",
          user_id: ${userId},
          target_id: ${targetId},
          target_type: Project,
        ) { 
          text
        }
      }
    `);
  } catch (err) {
    console.log('Failed to send monday notification!', err);
  }
}
