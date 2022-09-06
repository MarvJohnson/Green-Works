import React, { useState } from 'react';
import './styling.css';
import Flex from 'monday-ui-react-core/dist/Flex';
import Box from 'monday-ui-react-core/dist/Box';
import Checkbox from 'monday-ui-react-core/dist/Checkbox';
import Button from 'monday-ui-react-core/dist/Button';
import RadioButton from 'monday-ui-react-core/dist/RadioButton';
import Heading from 'monday-ui-react-core/dist/Heading';
import AdminSetupStep from '../AdminSetupStep/AdminSetupStep';
import mondayDefaultSettings from '../../data/mondayDefaultSettings';

export default function AdminSetupMenu({
  setMondaySettingsAndRemote,
  setConfiguringMondaySettings
}) {
  const [newConfiguration, setNewConfiguration] = useState(
    mondayDefaultSettings.value
  );

  /**
   * Updates a target setting to a new value.
   * @param {string} settingName - The name of the settings to update.
   * @param {any} newSettingValue - The new value for the target setting.
   */
  function updateNewConfiguration(settingName, newSettingValue) {
    const updatedConfiguration = {
      ...newConfiguration,
      [settingName]: newSettingValue
    };

    setNewConfiguration(updatedConfiguration);
  }

  function confirmNewConfiguration() {
    setMondaySettingsAndRemote(newConfiguration);
    setNewConfiguration(mondayDefaultSettings.value);
    setConfiguringMondaySettings(false);
  }

  return (
    <Box className="admin-setup-menu">
      <Heading
        className="main-header"
        value="Thanks for choosing Green Works!"
      />
      <div className="configuration-area">
        <Flex
          direction={Flex.directions.COLUMN}
          gap={Flex.gaps.LARGE + 60}
          align={Flex.align.START}
        >
          <AdminSetupStep
            title="Step 1"
            subTitle="What goal is your team working toward this month?"
            hintText="A four day work week? Company sponsored happy hour? Tickets to an event? Have some fun with this!"
            textFieldPlaceholder="Type here..."
            autoFocus={true}
            targetPropertyName="teamGoal"
            handleChange={updateNewConfiguration}
            value={newConfiguration.teamGoal.toString()}
          />
          <AdminSetupStep
            title="Step 2"
            subTitle="How many members make up your team?"
            hintText="Don't forget to include yourself!"
            textFieldPlaceholder="Enter value"
            targetPropertyName="teamMemberCount"
            handleChange={updateNewConfiguration}
            value={newConfiguration.teamMemberCount.toString()}
          />
          <AdminSetupStep
            title="Step 3"
            subTitle="What is your goal success rate for your team to meet each month?"
            hintText="We recommend starting at 60%"
            textFieldPlaceholder="Value"
            textFieldAfterIcon={<p>%</p>}
            targetPropertyName="teamSuccessRate"
            handleChange={updateNewConfiguration}
            value={newConfiguration.teamSuccessRate.toString()}
          />
        </Flex>
        <Flex
          className="side-config-area"
          direction={Flex.directions.COLUMN}
          justify={Flex.justify.SPACE_BETWEEN}
        >
          <Flex
            direction={Flex.directions.COLUMN}
            align={Flex.align.START}
            gap={Flex.gaps.LARGE}
          >
            <RadioButton
              className="card-lock-radio"
              name="card-lock"
              text="Lock all cards from all members"
              onSelect={() =>
                updateNewConfiguration('globalCardLockState', true)
              }
              checked={newConfiguration.globalCardLockState}
            />
            <RadioButton
              className="card-lock-radio"
              name="card-lock"
              text="Unlock all cards for members to edit"
              defaultChecked
              onSelect={() =>
                updateNewConfiguration('globalCardLockState', false)
              }
              checked={!newConfiguration.globalCardLockState}
            />
            <Checkbox
              className="checkbox"
              label="Send check-in reminder to your team"
              onChange={(event) =>
                updateNewConfiguration('checkInReminder', event.target.checked)
              }
              checked={newConfiguration.checkInReminder}
            />
          </Flex>
          <Flex gap={Flex.gaps.LARGE} align={Flex.align.STRETCH}>
            <Button className="reset-btn">Reset</Button>
            <Button className="submit" onClick={confirmNewConfiguration}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </div>
    </Box>
  );
}