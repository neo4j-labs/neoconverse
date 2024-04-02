import React, { useState } from 'react';
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type QAPair = {
  question: string;
  answer: string;
};

// Add these props to the QAPairsApp component
interface QAPairsProps {
  fewshot: QAPair[]; // The initial fewshot data
  onChange: (newFewshot: QAPair[]) => void; // Callback to notify parent component of changes
}

const QAPairs: React.FC<QAPairsProps> = ({ fewshot, onChange }) => {

  const [qaPairs, setQAPairs] = useState<QAPair[]>(fewshot);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // Update your add and delete functions to call onChange
  const addQAPair = (newPair: QAPair) => {
    const updatedQAPairs = [...qaPairs, newPair];
    setQAPairs(updatedQAPairs);
    onChange(updatedQAPairs); // Notify parent component
  };

  const deleteQAPair = (index: number) => {
    const updatedQAPairs = qaPairs.filter((_, idx) => idx !== index);
    setQAPairs(updatedQAPairs);
    onChange(updatedQAPairs); // Notify parent component
  };

    // Intermediate function to handle onClick and construct the QAPair
  const handleAddQAPairClick = () => {
    // Construct the newPair object from the current input values
    const newPair: QAPair = { question: newQuestion, answer: newAnswer };
    
    // Call addQAPair with the newPair
    addQAPair(newPair);
    
    // Optionally, clear the input fields after adding
    setNewQuestion('');
    setNewAnswer('');
  };

  return (
    <Container maxWidth="xl">
      <TextField
        label="Question"
        variant="outlined"
        fullWidth
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Answer"
        variant="outlined"
        fullWidth
        value={newAnswer}
        onChange={(e) => setNewAnswer(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={handleAddQAPairClick} style={{ marginBottom: 20 }}>
        Add QA Pair
      </Button>
      <List>
        {qaPairs.map((pair, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => deleteQAPair(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={pair.question} secondary={pair.answer} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default QAPairs;