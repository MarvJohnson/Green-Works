import React from 'react';
import './styling.css';
import Flex from 'monday-ui-react-core/dist/Flex';
import Box from 'monday-ui-react-core/dist/Box';
import ProgressCard from '../ProgressCard/ProgressCard';

export default function ProgressCardList({
  users = [],
  updateGoalProgressBar
}) {
  /**
   * Gets the first two users, ignoring all the rest.
   * @returns The first two users.
   */
  function getFirstTwoUsers() {
    const cards = [];

    if (users[0]) cards.push(users[0]);
    if (users[1]) cards.push(users[1]);

    return cards;
  }

  /**
   * Gets all of the users, except the first two.
   * @returns An array containing all the users, except the first two.
   */
  function getUsersOffsetByTwo() {
    const [, , ...theRest] = users;

    return theRest;
  }

  return (
    <>
      <Flex
        className="top-row"
        gap={Flex.gaps.LARGE + 10}
        justify={Flex.justify.END}
      >
        {getFirstTwoUsers().map((user, idx) => (
          <ProgressCard
            key={idx}
            user={user}
            updateGoalProgressBar={updateGoalProgressBar}
          />
        ))}
      </Flex>
      <Box className="bottom-row">
        {getUsersOffsetByTwo().map((user, idx) => (
          <ProgressCard
            key={idx}
            user={user}
            updateGoalProgressBar={updateGoalProgressBar}
          />
        ))}
      </Box>
      <Box className="all-row">
        {users.map((user, idx) => (
          <ProgressCard
            key={idx}
            user={user}
            updateGoalProgressBar={updateGoalProgressBar}
          />
        ))}
      </Box>
    </>
  );
}
