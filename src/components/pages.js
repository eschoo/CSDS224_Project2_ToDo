import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import DiaWrap from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Dialog from './modalInput';
import moment from 'moment';
import toastr from 'toastr';

export default class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: {
        deadline: moment(),
      },
      rows: [],
      open: false,
      edit: false,
      index: -1,
      data: {},
    };
  }
  addTask() {
    this.setState({
      open: true,
      edit: false,
    });
  }

  editTask(index) {
    this.setState({
      open: true,
      edit: true,
      index: index,
      data: this.state.rows[index],
    });
  }

  delete(title) {
    this.setState({
      rows: this.state.rows.filter((r) => r.title !== title),
    });
    toastr.success(`Task was deleted successfully!`, '', {
      closeButton: true,
      positionClass: 'toast-bottom-right',
    });
  }

  addRow(data) {
    this.state.rows.push({
      ...data.task,
      checked: false,
    });
  }

  editRow(data) {
    this.state.rows[this.state.index] = {
      ...this.state.rows[this.state.index],
      ...data.task,
      deadline: data.task.deadline,
    };
    this.setState({
      rows: this.state.rows,
    });
    toastr.success(`Task was updated successfully!`, '', {
      closeButton: true,
      positionClass: 'toast-bottom-right',
    });
  }

  modalState = (data) => {
    if (data.action === `submit`) {
      this.setState({ open: false });
      this.addRow(data.data);
      toastr.success(`Task was added successfully!`, ``, {
        closeButton: true,
        positionClass: 'toast-bottom-right',
      });
    } else if (data.action === `cancel`) {
      this.setState({ open: false });
    } else if (data.action === 'edit') {
      this.setState({ open: false });
      this.editRow(data.data);
    }
  };

  render() {
    return (
      <>
        <DiaWrap open={this.state.open} onClose={() => this.modalState()}>
          <Dialog
            parentCallback={this.modalState}
            dataFromParent={{
              ...this.state.task,
              titles: this.state.rows.map((r) => r.title),
              edit: this.state.edit,
              index: this.state.index,
              data: this.state.rows[this.state.index],
            }}
          ></Dialog>
        </DiaWrap>

        <Card sx={{ margin: '20px' }}>
          <CardHeader
            sx={{ bgcolor: 'primary.dark', color: 'white' }}
            title={
              <>
                <small>
                  <i className="fa fa-fw fa-bars"></i>FRAMEWORKS
                </small>
              </>
            }
            style={{ textAlign: 'center' }}
            action={
              <>
                <Button
                  variant="contained"
                  onClick={() => this.addTask()}
                  sx={{ width: 100, marginRight: '7px' }}
                >
                  <i className="fa fa-fw fa-plus-circle"></i>Add
                </Button>
              </>
            }
          />

          <CardContent sx={{ bgcolor: 'white', marginBottom: -1 }}>
            <TableContainer>
              <Table sx={{ bgcolor: 'white' }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{ width: 0.1, color: 'gray' }}
                    >
                      Title
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ width: 0.1, color: 'gray' }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ width: 0.1, color: 'gray' }}
                    >
                      Deadline
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ width: 0.1, color: 'gray' }}
                    >
                      Priority
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ width: 0.1, color: 'gray' }}
                    >
                      Is Complete
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ width: 0.1, color: 'gray' }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {this.state.rows.map((row, index) => (
                    <TableRow key={row.title}>
                      <TableCell align="center">{row.title}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell align="center">
                        {moment(row.deadline).format('M/D/YY')}
                      </TableCell>
                      <TableCell align="center">{row.priority}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={this.state.rows[index].checked}
                          onClick={() => {
                            this.state.rows[index].checked =
                              !this.state.rows[index].checked;
                            this.setState({ rows: this.state.rows });
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {!this.state.rows[index].checked && (
                          <Button
                            variant="contained"
                            onClick={() => this.editTask(index)}
                            sx={{ width: 100 }}
                          >
                            <i className="fa fa-pencil-square-o"></i>
                            &nbsp;UPDATE
                          </Button>
                        )}
                        <Button
                          onClick={() => this.delete(row.title)}
                          variant="contained"
                          color="error"
                          sx={{ bgcolor: '#f44336', width: 100 }}
                        >
                          <i className="fa fa-times-circle"></i>&nbsp;DELETE
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </>
    );
  }
}
