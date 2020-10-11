import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class ShowElement extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      element: []
    }
  }

  editElement(){
    window.location.href = process.env.ROUTER_BASENAME + 'add-element/' + this.props.match.params.id
  }

  deleteElement(){
    alert('Element deleted SUCCESSFULLY.')
    window.location.href = '/'
  }

  extractDate(date){
    const dateYear = date.split('T')
    const dateYearToInvert = dateYear[0].split('-')
    return dateYearToInvert[2] + '-' + dateYearToInvert[1] + '-' + dateYearToInvert[0]          
  } 

  componentDidMount(){    
    fetch('./data.json')
    .then(response => {
      return response.json()
    })
    .then(data => {
      const elementMatched = data.filter(obj => {
        return obj.id == this.props.match.params.id
      })
      elementMatched[0].date = this.extractDate(elementMatched[0].date)
      this.setState({
        element: elementMatched[0]        
      })
    })
  }

  render() {
    return (
    <div className="container">
      <div id="element"> 
        <div className="breadcrumb">
          <Link to="/">Home</Link>
        </div>
        <div className="title">
          <p>by User, { this.state.element.date }</p>
          <input className="btn btn-info" onClick={this.editElement.bind(this)} type="submit" value="Edit element"/>
          <input className="btn btn-info" onClick={this.deleteElement.bind(this)} type="submit" value="Delete element"/>
        </div>
        <div className="text" dangerouslySetInnerHTML={{ __html: this.state.element.text }}></div>
      </div>
    </div>
  )
  }
}

export default ShowElement
