import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import testDriveService from '../services/api/testDriveService';

const TestDriveForm = ({ carId }: { carId: string }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = { name, email, phone, carId };
    try {
      setLoading(true);
      await testDriveService.submitTestDriveRequest(requestData);
      alert('Test drive request submitted successfully!');
      setName('');
      setEmail('');
      setPhone('');
    } catch (error) {
      console.error('Failed to submit test drive request:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} p={2}>
      <TextField
        label="Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        disabled={loading}
      />
      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        disabled={loading}
      />
      <TextField
        label="Phone"
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        margin="normal"
        disabled={loading}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </Box>
  );
};

export default TestDriveForm;
