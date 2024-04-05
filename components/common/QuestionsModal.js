import React from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';

// import './QuestionsModal.css';

export default function QuestionsModal({ visible, questions, 
  setQuestion, setQuestionsModalVisible, ...props 
}) {

  const style = { 
    position: "absolute", 
    top: "50%", 
    left: "50%", 
    transform: "translate(-50%, -50%)", 
    width: 400, 
    bgcolor: "background.paper", 
    border: "2px solid #000", 
    boxShadow: 24, 
    p: 4, 
  }; 

  const sortQuestions = (q1, q2) => {
    if (q1.priority === q2.priority) {
      return 0;
    } else if (q1.priority < q2.priority) {
      return -1;
    } else {
      return 1;
    }
  }

  const handleSampleQuestionClick = (question) => {
    setQuestion(question);
    setQuestionsModalVisible(false);
  }

  return (
    <Dialog
      open={visible} 
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xl"
    >
      <DialogTitle id="alert-dialog-title">
      {"Sample Questions"}
      </DialogTitle>
      <DialogContent>
        <List style={{color: "#181414", fontSize: "1rem"}} dense={true}>
        {/* display: "flex", flexFlow: "row" */}
            {(questions && questions.length > 0) ?
              questions.sort(sortQuestions).map((question, index) => {
                return (
                  <ListItem key={index}
                    secondaryAction={
                      <Tooltip title="Use this question">
                        <IconButton edge="end" aria-label="useThisQuestion"
                          onClick={() => handleSampleQuestionClick(question.question)}
                        >
                          <KeyboardReturnOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemText
                      onClick={() => handleSampleQuestionClick(question.question)}
                      style={{cursor: "pointer"}}
                      primary={
                        <div style={{ color: "#181414", fontSize: "16px"}}>
                          {/* <div className="questionNumber" style = {{width: "40px"}} >{`${index+1}.`}</div> */}
                          <div style = {{width: "80%"}} >{`${index+1}.`} {" "+question.question}</div>
                          {/* <div>{question.question}</div> */}
                        </div>
                      }
                    />
                  </ListItem>
                )
              })
              :
              <span>No sample questions have been provided</span>
            }
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {setQuestionsModalVisible(false)}} autoFocus>Close</Button>
      </DialogActions>
    </Dialog>

  );
}