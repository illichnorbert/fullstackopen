const Notification = (props) => {
  if (props.message === null) {
    return null  // nichts anzeigen wenn keine Nachricht
  }
  
  const color = props.type === 'error' ? 'red' : 'green'
  
  return (
    <div style={{
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      color: color,
      borderColor: color
    }}>
      {props.message}
    </div>
  )
}

export default Notification