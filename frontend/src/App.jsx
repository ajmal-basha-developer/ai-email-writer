import { useState } from 'react';
import { Box, Container, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress } from '@mui/material';
import './App.css';

function App() {
  const [emailCont, setEmailCont] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setGeneratedReply('');

    try {
      const response = await fetch('http://localhost:8080/api/email/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ✅ Corrected: match backend field names
        body: JSON.stringify({ emailContent: emailCont, tone }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate reply. Please try again.');
      }

      // Read response as text
      const text = await response.text();

      // Try parsing JSON; fallback to plain text
      let replyText;
      try {
        const data = JSON.parse(text);
        replyText = data.reply ?? text;
      } catch {
        replyText = text;
      }

      setGeneratedReply(replyText);

    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailCont}
          onChange={(e) => setEmailCont(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailCont || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : "Generate Reply"}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Generated Reply
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={generatedReply}
            InputProps={{ readOnly: true }}
          />
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigator.clipboard.writeText(generatedReply)}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;
