import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default class CompanyPage extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. 
    // This component maintains the list of companies.
    this.state = {
      companies: []
    }
  }

  // React function that is called when the page load.
  componentDidMount(res, req) {
    // Send an HTTP request to the server.
    // 1 fetch for 1 query
    fetch(`http://localhost:8081/companypage/`,
      {
        method: 'GET' // The type of HTTP request.
      }).then(res => {
        // Convert the response data to a JSON.
        return res.json();
      }, err => {
        // Print the error if there is one.
        console.log(err);
      }).then(companiesList => {

        // Map each attribute of a company in this.state.people to an HTML element
        let companiesDivs = companiesList.map((company, i) =>
          <div key={i} className="company">
            <div className="name">{company.CompanyName}</div>
            <div className="city">{company.city}</div>
            <div className="state">{company.state}</div>
          </div>);

        // Set the state of the company list to the value returned by the HTTP response from the server.
        this.setState({
          companies: companiesDivs
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });

      // another query
      fetch(`http://localhost:8081/companypage/`,
      {
        method: 'GET' // The type of HTTP request.
      }).then(res => {
        // Convert the response data to a JSON.
        return res.json();
      }, err => {
        // Print the error if there is one.
        console.log(err);
      }).then(companiesList => {

        // Map each attribute of a company in this.state.people to an HTML element
        let companiesDivs = companiesList.map((company, i) =>
          <div key={i} className="company">
            <div className="name">{company.CompanyName}</div>
            <div className="city">{company.city}</div>
            <div className="state">{company.state}</div>
          </div>);

        // Set the state of the company list to the value returned by the HTTP response from the server.
        this.setState({
          companies: companiesDivs
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });

      // yet another query
      fetch(`http://localhost:8081/companypage/`,
      {
        method: 'GET' // The type of HTTP request.
      }).then(res => {
        // Convert the response data to a JSON.
        return res.json();
      }, err => {
        // Print the error if there is one.
        console.log(err);
      }).then(companiesList => {

        // Map each attribute of a company in this.state.people to an HTML element
        let companiesDivs = companiesList.map((company, i) =>
          <div key={i} className="company">
            <div className="name">{company.CompanyName}</div>
            <div className="city">{company.city}</div>
            <div className="state">{company.state}</div>
          </div>);

        // Set the state of the company list to the value returned by the HTTP response from the server.
        this.setState({
          companies: companiesDivs
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });
  }

  render() {
    return (
      <div className="CompanyPage">
        <PageNavbar active="companies" />
        <div className="container Company-container">
          <br></br>
          <div className="jumbotron less-headspace">
            <div className="company-container">
              <div className="company-header">
                <div className="header"><strong>Company Name</strong></div>
                <div className="header"><strong>City</strong></div>
                <div className="header"><strong>State</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.companies}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}