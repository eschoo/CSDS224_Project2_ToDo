import React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import DatePicker from '@mui/lab/DatePicker';
import moment from 'moment';

export default function ResponsiveDialog(props) {
  let titles = props.dataFromParent.titles;
  let edit = props.dataFromParent.edit;
  let data = props.dataFromParent.data;
  let [deadline, setDeadline] = React.useState(
    edit ? data.deadline : props.dataFromParent.deadline
  );
  let [emptyDesc, setEmptyDesc] = React.useState(false);
  let [emptyTitle, setEmptyTitle] = React.useState(false);
  let [usedTitle, setUsedTitle] = React.useState(false);
  let [priority, changePriority] = React.useState(edit ? data.priority : 'Low');
  let title = React.createRef();
  let description = React.createRef();
  let priorityChange = (e) => changePriority(e.target.value);

  let cancel = () => {
    props.parentCallback({
      action: 'cancel',
      data: {},
    });
  };

  let setVals = () => {
    if (!edit) {
      setEmptyTitle(title.current.value.length === 0, () => {
        console.log(emptyTitle);
      });
      if (!emptyTitle) {
        setUsedTitle(titles.includes(title.current.value));
      }
    }
    setEmptyDesc(description.current.value.length === 0);
    edit ? sendEdit() : submit();
  };

  let submit = () => {
    if (
      title.current.value.length !== 0 &&
      description.current.value.length !== 0 &&
      !titles.includes(title.current.value)
    ) {
      props.parentCallback({
        action: 'submit',
        data: {
          task: {
            title: title.current.value,
            description: description.current.value,
            priority,
            deadline,
          },
        },
      });
    }
  };

  let sendEdit = () => {
    if (description.current.value.length !== 0) {
      props.parentCallback({
        action: 'edit',
        data: {
          task: {
            description: description.current.value,
            priority,
            deadline,
          },
        },
      });
    }
  };

  let updateDeadline = (newData) => {
    setDeadline(newData.deadline);
    console.log(newData);
  };

  let [date, setDate] = React.useState('');
  let setNewDate = (e) => {
    setDate(e);
    props.dataToParent({
      deadline: moment(e),
    });
  };

  return (
    <>
      <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
        {edit ? (
          <div>
            <i className="fa fa-pencil-square-o"></i>Edit Task
          </div>
        ) : (
          <div>
            <i className="fa fa-fw fa-plus-circle"></i>Add Task
          </div>
        )}
      </DialogTitle>
      {!edit ? (
        <DialogContent>
          <br />
          <br />
          <TextField
            error={emptyTitle || usedTitle}
            helperText={
              emptyTitle
                ? 'Title is Required!'
                : usedTitle
                ? 'Title already Used!'
                : null
            }
            fullWidth={true}
            inputRef={title}
            id="title"
            placeholder="Title"
          />
        </DialogContent>
      ) : (
        <br></br>
      )}
      <DialogContent>
        <TextField
          defaultValue={edit ? data.description : ''}
          inputRef={description}
          error={emptyDesc}
          helperText={emptyDesc ? 'Description is Required!' : ''}
          id="description"
          fullWidth={true}
          placeholder="Description"
        />
      </DialogContent>
      <DialogContent>
        <TextField
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          label="Deadline"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogContent>
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">
            Priority
          </FormLabel>
          <RadioGroup
            onChange={priorityChange}
            value={priority}
            row
            defaultValue="Low"
            name="row-radio-buttons-group"
          >
            <FormControlLabel value="Low" control={<Radio />} label="Low" />
            <FormControlLabel value="Med" control={<Radio />} label="Med" />
            <FormControlLabel value="High" control={<Radio />} label="High" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ bgcolor: 'white' }}>
        {edit ? (
          <Button onClick={setVals} variant="contained" sx={{ width: 100 }}>
            <i className="fa fa-pencil-square-o"></i>&nbsp;EDIT
          </Button>
        ) : (
          <Button onClick={setVals} variant="contained" sx={{ width: 100 }}>
            <i className="fa fa-fw fa-plus-circle"></i>&nbsp;ADD
          </Button>
        )}
        <Button
          onClick={cancel}
          variant="contained"
          color="error"
          sx={{ bgcolor: '#f44336', width: 100 }}
        >
          <i className="fa fa-fw fa-ban"></i>&nbsp;CANCEL
        </Button>
      </DialogActions>
    </>
  );
}
