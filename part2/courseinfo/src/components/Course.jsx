const Total = (props) => {
  const total = props.parts.reduce((sum,part) => sum + part.exercises, 0)
  return (
    <p>total of {total} exercises </p>
  )
}

const Part = (props) => {
  //empfange props so: props = {
  //  part: { name: 'Fundamentals...', exercises: 10, id: 1 }
  // }
  return (
    <p>{props.part.name} {props.part.exercises}
    {/*greife auf die einzelnen Bestandteile zu */}
    </p>
  ) 
}

const Content = (props) => {
  //Content empfängt das parts Array als props, welches ein Objekt ist
  return (
    <div>
       {/*greife auf parts in dem props Objekt zu. part sind die einzelnen Bestandteile des parts Arrays, auf die jeweils zugegriffen wird. */} 
       { props.parts.map(part => <Part key={part.id} part={part} />) }
      {/*ich übergebe an die Komponente Part die einzelnen Bestandteile des parts Arrays (part) als props. Da part ein Objekt ist, übergebe ich es als ganzes Objekt.    */}
   </div>
  )
}


const Header = (props) => {
  //empfange das ganze course Objekt als props
  return (
    <h1>{props.course.name}</h1>
  )
}


const Course = (props) => {
  //Course empfängt das ganze Objekt course als props.   
  return (
    <div>
      <Header course={props.course} />
      {/*das ganze course Objekt wird an Header weitergegeben */}
      <Content parts={props.course.parts} />
      {/*nur das parts Array wird als props an Content weitergegeben  */}
      <Total parts={props.course.parts} />
    </div>
  )
}

export default Course
