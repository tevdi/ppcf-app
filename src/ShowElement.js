import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ShowElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: {
        date: new Date().toLocaleDateString('en-GB'),
      },
    };
  }

  editElement() {
    window.location.href = `${process.env.BASENAME}/add-element/${this.props.match.params.id}`;
  }

  deleteElement() {
    if (confirm('Are you SURE you want to delete this item ?')) {
      fetch(process.env.API_REST_URL + '/rest/data/deleteElement/' + this.props.match.params.id, {})
        .then(this.handleErrors)
        .then((response) => {
          window.location.href = `${process.env.BASENAME}/`;
          alert('Element deleted SUCCESSFULLY.');
        })
        .catch((error) => alert('ERROR deleting the element: \n\n' + error));
    }
  }

  extractDate(date) {
    const dateYear = date.split('T');
    const dateYearToInvert = dateYear[0].split('-');
    return dateYearToInvert[2] + '-' + dateYearToInvert[1] + '-' + dateYearToInvert[0];
  }

  componentDidMount() {
    // fetch('./data.json')
    fetch(`${process.env.API_REST_URL}/rest/data/element/${this.props.match.params.id}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          element: data,
        });

        /*  const elementMatched = data.filter(obj => {
        return obj.id == this.props.match.params.id
      })
      elementMatched[0].date = this.extractDate(elementMatched[0].date)
      this.setState({
        element: elementMatched[0]        
      }) 
    */
      });
  }

  render() {
    return (
      <div className="container">
        <div id="element">
          <div className="breadcrumb">
            <Link to={`${process.env.BASENAME}`}>Home</Link>
          </div>
          <div className="title">
            <p>by User, {new Date(this.state.element.date).toLocaleDateString('en-GB')}</p>
            <input className="btn btn-info" onClick={this.editElement.bind(this)} type="submit" value="Edit element" />
            <input
              className="btn btn-info"
              onClick={this.deleteElement.bind(this)}
              type="submit"
              value="Delete element"
            />
          </div>
          <div className="text" dangerouslySetInnerHTML={{ __html: this.state.element.text }}></div>
        </div>
      </div>
    );
  }
}

export default ShowElement;
