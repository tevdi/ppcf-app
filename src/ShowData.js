import React from 'react'
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate'

class ShowData extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      partialElementsList: [],
      offset: 0,
      perPage: 10,
      currentPage: 0,
      filter: '',
      categories: [],
      checkedCategories: [],
      filterDiv: '',
      searchMinLength: 3
    }
    this.handlePageClick = this.handlePageClick.bind(this)
      console.log(process.env)

  }

  extractDate(date){
    const dateYear = date.split('T')
    const dateYearToInvert = dateYear[0].split('-')
    return dateYearToInvert[2] + '-' + dateYearToInvert[1] + '-' + dateYearToInvert[0]
  }  
  
  typeIsChecked(id){
    return this.state.checkedCategories.includes(id)
  }

  stringFound(element){
    if (this.state.filter === ''){
      return false 
    } else {
    return !(element.title.toLowerCase().indexOf(this.state.filter) === -1 && element.type.toLowerCase().indexOf(this.state.filter) === -1)
    }
  }

  arraySortByObjProp(arr, propName, order){
    return arr.sort(function (a, b) {
      if (a[propName] < b[propName]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[propName] > b[propName]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  fetchData(){
    // fetch('./data.json')
    fetch(`${process.env.API_REST_URL}/rest/data`)    
    .then(response => {
      return response.json()
    })
    .then(data => {      
      console.log(data)
      if ((this.state.filter != '') || ((this.state.checkedCategories.length != 0))){     
        const filteredElementsList = []
        data.filter(element => {         
          if ((this.typeIsChecked(element.typeid) && (this.state.filter === '')) || ((this.typeIsChecked(element.typeid)) && this.stringFound(element)) || ((this.state.checkedCategories.length == 0) && this.stringFound(element))){
            filteredElementsList.push(element)
          }
        })

        data = filteredElementsList
      }
      fetch('./categories.json')
      .then(response => {
        return response.json()
      })
      .then(categories => {            
        this.setState({      
          totalElements: data.length,
          pageCount: Math.ceil(data.length / this.state.perPage),
          partialElementsList: this.sliceElements(this.arraySortByObjProp(data, "date", "desc")),
          offset: 0,
          currentPage: 0,
          categories
        })
      })
    })
  }

  sliceElements(data){
    return data.slice(this.state.offset, this.state.offset + this.state.perPage)
  }

  onChangeSearch(evt){
    const filterText = evt.target.value.length >= this.state.searchMinLength ? evt.target.value : ''
    this.setState({
      filter: filterText
    }, () => {
      this.fetchData()
    })
  }

  handlePageClick(e){
    const selectedPage = e.selected
    const offset = selectedPage * this.state.perPage
    this.setState({
        currentPage: selectedPage,
        offset: offset
    }, () => {
        this.fetchData()
    })
  }

  handleInputChange(e){
    const arrayCategories = this.state.checkedCategories
    if (arrayCategories.includes(Number(e.target.value))){
      const index = arrayCategories.indexOf(Number(e.target.value))
      if (index > -1) {
        arrayCategories.splice(index, 1)
      }
    } else {
      arrayCategories.push(Number(e.target.value))
    }
    this.setState({
      checkedCategories: arrayCategories
    }, () => {
      this.fetchData()
    })
  }

  handleFilterDiv(){
    let display
    if (this.state.filterDiv === 'block'){
      display = 'none'
    } else {
      display = 'block'
    }
    this.setState({
      filterDiv: display
    })
  }
  
  componentDidMount(){
    this.fetchData()
  }

  render() {
    return (
    <React.Fragment>
      <div className="container">
        <div className="input-group inputSearch">
          <input
            type="text"
            className="form-control"
            value={this.state.filterText}
            placeholder="Search for ..."
            onChange={this.onChangeSearch.bind(this)}
          />
        </div>
        <div id="mainData">
          <div id="show-data" className="col-lg-10">
            <Link to="/add-element" className="btn btn-info">Add element</Link>
            <div> Total elements: <b>{ this.state.totalElements }</b></div>
            <div className="elementsRows">
              { this.state.partialElementsList.map((element, idx) => (
                  <div key={idx} className="container-fluid">           
                    <div className="row">           
                      <div className="col-lg-2">
                        { this.extractDate(element.date) }            
                      </div>
                      <div className="col-lg-3">
                        { element.type }                  
                      </div>
                      <div className="col-lg-7 desc">
                        <Link to={`/element/${element.id}`}>{element.title}</Link>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
            <ReactPaginate
              previousLabel={'prev'}
              nextLabel={'next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}/>
          </div>
          <aside className="col-lg-2">
            <button className="btn btn-primary btnToggleFilterDiv" onClick={this.handleFilterDiv.bind(this)}>Filter</button>
            <div className="filterDiv" style={{ display: this.state.filterDiv }}>
              <div className="title">
                Filter by:
              </div>
              { this.state.categories.map((category, idx) => (
                <div key={idx} className="row">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      checked={this.state.isGoing}
                      onChange={this.handleInputChange.bind(this)}
                      value={category.id}
                    />
                    <label>{category.type}</label>
                  </div>
                </div>
                ))
              }
            </div>
          </aside>
        </div>
      </div>
    </React.Fragment>
    )
  }
}

export default ShowData
