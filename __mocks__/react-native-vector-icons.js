const React = require('react');
const { Text } = require('react-native');

const MockIcon = (props) => <Text {...props}>Icon</Text>;

module.exports = {
  default: MockIcon,
  Zocial: MockIcon,  // If you're using specific icon sets like Zocial
};
