import { useState } from 'react'

const StatisticLine = (props) =>  {
  return (
    <tr>
      <td> {props.text} </td>
      <td> {props.value} </td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <p>No feedback given</p>
    )
  }
  return (
    <div>
      <h2>statistics</h2>
      <table>
      <tbody>
     <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={props.total} />
      <StatisticLine text="average" value={props.average} />
      <StatisticLine text="positive" value={props.positive + " %"} /> 
      </tbody>
      </table>
    </div>  
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}> {props.text} </button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad
  let average  
  let positive

  if (total ==0) {
    average = 0
    positive = 0
  } else {
    average = (good * 1 + neutral * 0 + bad * -1) / total
    positive = (good / total) * 100
  } 

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick ={ () => setGood(good+1)} text ="good" />
      <Button onClick= { () => setNeutral(neutral+1)} text ="neutral" />
      <Button onClick= { () => setBad(bad+1)} text="bad" />

      <Statistics
      good = {good}
      neutral = {neutral}
      bad = {bad}
      total = {total}
      average = {average}
      positive = {positive}
      />    
    </div>
  )
}

export default App