import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import NavigateNext from '@material-ui/icons/NavigateNext'
import NavigateBefore from '@material-ui/icons/NavigateBefore'
import AddBox from '@material-ui/icons/AddBox'
import { forwardRef, useImperativeHandle } from 'react'

const Timeline = forwardRef((props, ref) => {

  const [eventsList, setEvents] = React.useState([])
  const [currentEvents, setCurrentEvents] = React.useState([])
  const [needData, setNeedData] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [lowerIndex, setLower] = React.useState(0)
  const [upperIndex, setUpper] = React.useState(-1)
  const [newEvent, setNewEvent] = React.useState({
    Name: '',
    Place: '',
    Date: '',
    Hour: '',
    timeDuration: '',
    TeamID: props.user.TeamID,
    Description: ''
  })

  React.useEffect(() => {
    let url = ''
    if (props.user.role == 2){
      url = `${process.env.API_URL}/events/${props.user.TeamID}?Page=${page}&NumberToBring=5`
    }
    else{
      url = `${process.env.API_URL}/events/${props.user.children[0].TeamID}?Page=${page}&NumberToBring=5`
    }
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${props.user.token}`,
        'Content-Type': 'application/json'
      }
      
    }).then((res) => {
      if (res.status == 200){
        return res.json()
      }
      else {
        console.log('No new events')
        return null
      }
      
    }).then((res) => {
      if (res != null){
        setEvents(eventsList.concat(res.Events))
        if (res.Events.length == 5){
          setCurrentEvents(res.Events)
          if (upperIndex + 5 != 4){
            setLower(lowerIndex + 5)
          }
          setUpper(upperIndex + 5)
        }
        else{
          let leftover = currentEvents.length - res.Events.length
          let aux = []
          for (let i = 0; i < leftover; i++) {
            aux.push(currentEvents[res.Events.length + i])
          }
          console.log('aux: ', aux.concat(res.Events))
          setCurrentEvents(aux.concat(res.Events))
          setUpper(upperIndex + res.Events.length)
          setLower(lowerIndex + res.Events.length)
        }
        setSelectedIndex(-1);
        props.handler(-1);
        console.log('Se consiguieron eventos')
      }
    })
  }, [needData])
  // checar con eventlist si no se detiene

  // Handling the loading of event details
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    props.handler(index);
  };

  // Handling the new event dialog
  const [openNewEvent, setOpen] = React.useState(false)
  const handleNewEventOpen = () => setOpen(true)
  const handleNewEventClose = () => setOpen(false)

  // Handling navigation
  const handleBack = () => {
    if (lowerIndex == 0){
      console.log('No newer events')
      return 
    }
    if (lowerIndex - 5 >= 0){
      let upper = upperIndex - 5
      let lower = lowerIndex - 5
      let aux = []
      setUpper(upper)
      setLower(lower)
      for(let i = lower; i <= upper; i++){
        aux.push(eventsList[i])
      }
      setCurrentEvents(aux)
      setSelectedIndex(-1);
      props.handler(-1);
      
    }
    else{
      let leftover = (lowerIndex - 5 + 1) * -1
      let aux = []
      for (let i = 0; i < leftover; i++) {
        aux.push(eventsList[i])
      }
      for (let i = leftover; i < 5 && i < eventsList.length; i++) {
        aux.push(eventsList[i])
      }
      setSelectedIndex(-1);
      props.handler(-1);
      setCurrentEvents(aux)
      setLower(0)
      setUpper(4)
    }
  }
  const handleNext = () => {
    if (upperIndex == eventsList.length - 1){
      setPage(page + 1)
      setNeedData(page)
    }
    else if(upperIndex + 5 <= eventsList.length - 1){
      let upper = upperIndex + 5
      let lower = lowerIndex + 5
      let aux = []
      setUpper(upper)
      setLower(lower)
      for(let i = lower; i <= upper; i++){
        aux.push(eventsList[i])
      }
      setCurrentEvents(aux)
      setSelectedIndex(-1);
      props.handler(-1);
    }
    else{
      // load from eventsList
      let leftover = eventsList.length - upperIndex - 1
      let aux = []
      for (let i = lowerIndex + leftover; i <= upperIndex; i++){
        aux.push(eventsList[i])
      }
      for (let i = upperIndex + 1; i < eventsList.length; i++) {
        aux.push(eventsList[i])
      }
      setSelectedIndex(-1);
      props.handler(-1);
      setCurrentEvents(aux)
      setUpper(eventsList.length - 1)
      setLower(eventsList. length - 5)
    }
  }

  const handleFieldChange = (event) => {
    console.log(event.target.id)
    setNewEvent({...newEvent, [event.target.id]: event.target.value})
  }

  const validateFields = () =>{

    let counter = 0

    for (var key in newEvent){
      var attrName = key;
      if (attrName != 'Description'){
        var attrValue = newEvent[key];
        if(attrValue.trim() == ''){
          console.log(attrName + ' is missing')
          counter++
        }
      }
    }

    if (counter > 0){
      return false
    }
    else{
      return true
    }

  }

  const handleSaveClick = (event) => {
    if (validateFields()) {
      let dateTimeFormat = newEvent.Date + 'T' + newEvent.Hour
      console.log(newEvent)
      fetch(`${process.env.API_URL}/events/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${props.user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Name: newEvent.Name,
          Place: newEvent.Place,
          Date: dateTimeFormat,
          timeDuration: newEvent.timeDuration,
          TeamID: newEvent.TeamID
        })
      }).then((res) => {
        let amount = 0
        if (eventsList.length % 5 == 0){
          amount = eventsList.length
        }
        else{
          amount = eventsList.length + 1
        }
        fetch(`${process.env.API_URL}/events/${props.user.TeamID}?Page=1&NumberToBring=${amount}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${props.user.token}`,
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          return res.json()
        }).then((res) => {
          let aux = []
          setEvents(res.Events)
          for (let i = lowerIndex; i <= upperIndex; i++){
            aux.push(res.Events[i])
          }
          console.log(aux)
          setCurrentEvents(aux)
          handleNewEventClose()
          setSelectedIndex(-1);
          props.handler(-1);
        })
      }).catch((err) =>{
        console.log('error: ', err)
      })
    }
  }

  function convertDate(date){
    let aux = new Date()
    aux.setTime(date._seconds * 1000)
    return aux.toDateString()
  }

  useImperativeHandle(ref, () => {
    return currentEvents
  })

  return (
    <Card className={props.className}>
      <CardHeader title="Timeline"/>
      <CardContent style={{flexGrow: 1}}>
        <List>
          {currentEvents.map((e) => (
            <ListItem
              key={e.id}
              button
              selected={selectedIndex === currentEvents.indexOf(e)}
              onClick={(event) => handleListItemClick(event, currentEvents.indexOf(e))}
            >
              <ListItemText primary={e.Name}
                            secondary={convertDate(e.Date)}/>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleBack}>
          <NavigateBefore/>
        </IconButton>
        <IconButton onClick={handleNext}>
          <NavigateNext/>
        </IconButton>
        {props.user.role == 3 ? null :
            <IconButton onClick={handleNewEventOpen}>
              <AddBox/>
            </IconButton>
        }
      </CardActions>
      <Dialog
        open={openNewEvent}
        onClose={handleNewEventClose}
      >
        <DialogTitle>Crear nuevo evento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Introduce la información del nuevo evento. Haz click en guardar para crear
            el evento, o presiona en cualquier área fuera del cuadro para cancelar.
          </DialogContentText>
          <TextField
            margin="normal"
            id="Name"
            label="Nombre del evento"
            type="name"
            /* defaultValue={currentEvent.name} */
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            margin="normal"
            id="Place"
            label="Lugar del evento"
            type="name"
            /* defaultValue={currentEvent.name} */
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            margin="normal"
            id="Date"
            type="date"
            label="Fecha del evento"
            InputLabelProps={{shrink: true}}
            /* defaultValue={currentEvent.name} */
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            margin="normal"
            id="Hour"
            label="Hora del evento"
            type="time"
            InputLabelProps={{shrink: true}}
            /* defaultValue={currentEvent.name} */
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            margin="normal"
            id="timeDuration"
            label="Duración del evento"
            type="time"
            InputLabelProps={{shrink: true}}
            /* defaultValue={currentEvent.name} */
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            margin="normal"
            id="comments"
            label="Comentarios"
            type="name"
            /* defaultValue={currentEvent.name} */
            /* onChange={handleFieldChange} */
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveClick}
          >
            Listo
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
})

export default Timeline;
