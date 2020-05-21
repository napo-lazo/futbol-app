import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import firebase from "firebase";
import Router from "next/router"
import Cookies from '../node_modules/js-cookie'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
    '& .MuiFormLabel-root, & .MuiSelect-icon': {
      color: theme.palette.background.default
    },
  },
  input: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    color: theme.palette.background.default,
  },
  title: {
    flexGrow: 1,
    textAlign: 'center'
  }
}));

const handleLogout = (event) => {
  firebase.auth().signOut()
  Cookies.remove('user')
  Router.push('/')
}

const Header = (props) => {
  const classes = useStyles();
  const [team, setTeam] = React.useState('');

  const handleChange = (event) => {
    setTeam(event.target.value);
  };

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        {props.user ?
          <TextField
            select
            label="Equipo"
            SelectProps={{className: classes.input, disableUnderline: true}}
          >
          <MenuItem>Team 1</MenuItem>
          <MenuItem>Team 2</MenuItem>
          <MenuItem>Team 3</MenuItem>
        </TextField>
         :
         null}
        {props.component ? props.component : null}
        <Typography variant="h5" className={classes.title}>
          Futbol App
        </Typography>
        <Button color="inherit" size="large" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
