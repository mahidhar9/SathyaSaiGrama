import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MyApprovals } from '../screens/MyApprovals'; // Replace with your actual component
import { RejectedApplicationsContext } from '../context/RejectedApplicationsContext'; // Replace with your context
import { NavigationContainer } from '@react-navigation/native';

describe('Rejected Applications Tab', () => {
  it('should display all L1 and L2 rejected applications in the Rejected tab', () => {
    // Mock rejected applications data
    const mockRejectedApplications = [
      { id: 1, level: 'L1', applicant: 'John Doe', status: 'Rejected' },
      { id: 2, level: 'L2', applicant: 'Jane Smith', status: 'Rejected' },
    ];

    // Mock RejectedApplicationsContext value
    const mockContextValue = {
      rejectedApplications: mockRejectedApplications,
      fetchRejectedApplications: jest.fn(),
    };

    // Render component with context and navigation
    const { getByText, getAllByText } = render(
      <RejectedApplicationsContext.Provider value={mockContextValue}>
        <NavigationContainer>
          <MyApprovals />
        </NavigationContainer>
      </RejectedApplicationsContext.Provider>
    );

    // Navigate to the "Rejected" tab
    const rejectedTabButton = getByText('Rejected'); // Adjust button text to match your UI
    fireEvent.press(rejectedTabButton);

    // Verify L1 and L2 rejected applications are displayed
    expect(getByText('John Doe')).toBeTruthy(); // L1 Rejected application
    expect(getByText('Jane Smith')).toBeTruthy(); // L2 Rejected application
    expect(getAllByText('Rejected')).toHaveLength(2); // Verify both applications are rejected
  });
});
