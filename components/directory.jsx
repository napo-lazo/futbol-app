import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress'
import ErrorDialog from '../components/error-dialog'

export default function Directory(props) {
  const [directory, setDirectory] = React.useState([]);
  const [loading, setLoading] = React.useState(true)
  const [isError, setError] = React.useState(false)

  React.useEffect(() => {
    setLoading(true)
    fetch(`${process.env.API_URL}/teams/${props.teamId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${props.token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if(res.ok)
          return res.json()
        else
          return []
      })
      .then(
        (result) => {
          setDirectory(result)
          setLoading(false)
        },
        (error) => {
          setError(true)
          setLoading(false)
        }
      )
  }, [props.teamId])

  if(isError) {
    return <ErrorDialog/>
  }
  else if(directory.length == 0 && !loading) {
    return (
     <Typography variant="h4">No hay contactos</Typography>
    )
  }
  else {
    return loading ?
      <TableContainer component={Paper} className={props.className}>
        <LinearProgress/>
      </TableContainer>
    :
      (
      <TableContainer component={Paper} className={props.className}>
        <Table aria-label="phone directory">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Celular</TableCell>
              {
                props.admin ?
                <TableCell>User ID</TableCell>
                : null
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {directory.map((row) => (
              <TableRow key={row.UserID}>
                <TableCell component="th" scope="row">
                  {row.isCoach ? `${row.FirstName} (Coach)` : row.FirstName}
                </TableCell>
                <TableCell>{row.LastName}</TableCell>
                <TableCell>{row.Email}</TableCell>
                <TableCell>{row.Phone ? row.Phone : null}</TableCell>
                {props.admin ? <TableCell>{row.UserID}</TableCell> : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
