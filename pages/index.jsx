import firebase from "firebase";
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from 'next/link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import SoccerBall from '@material-ui/icons/SportsSoccer';
import Icon from '@mdi/react'
import { mdiGoogle } from '@mdi/js'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(/index-image.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.background.secondary,
    width: theme.spacing(15),
    height: theme.spacing(15),
    color: theme.palette.primary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const GoogleIcon = () => {
  return (
    <Icon path={mdiGoogle} size={1} color="white"/>
  )
}

export default function SignInSide() {
  const classes = useStyles();
  const [userInfo, setInfo] = React.useState({
    username: '',
    password: ''
  })

  const handleUserInfo = (event) => {
    setInfo({...userInfo, [event.target.name]: event.target.value})
  }

  const handleLogin = (event) => {

    firebase.auth().signInWithEmailAndPassword(
        userInfo['username'],
        userInfo['password']
    ).then(
        (result) => {
          getUserToken();
        },
        (err) => {
          alert("Oops " + err.message);
        }
    );
  }

  const handleLoginGoogle = (event) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
          console.log(result);
          getUserToken();
      }).catch((error) => {
          console.log(error.message);
      });
  }

  const getUserToken = () => {
      firebase.auth().currentUser.getIdToken(true).then((result) => {
          console.log(result);
      });
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <SoccerBall className={classes.avatar}/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Futbol App
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleUserInfo}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleUserInfo}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleLogin}
            >
              Iniciar Sesión
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              startIcon={<GoogleIcon/>}
              onClick={handleLoginGoogle}
            >
              Iniciar Sesión con Google
            </Button>
            <Grid container>
              <Grid item>
                <Link href="register-user">
                  <a> {"¿No tienes cuenta? Regístrate"} </a>
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
