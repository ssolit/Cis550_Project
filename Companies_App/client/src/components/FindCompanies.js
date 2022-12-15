import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/FindCompanies.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "shards-ui/dist/css/shards.min.css";
import { getCompany } from '../fetcher'

import { Form, FormInput, FormGroup, Card, CardBody } from "shards-react";

import { Container, Row, Col } from 'react-bootstrap';

import { useState } from 'react';

import { Link } from "react-router-dom";

// import Table from '@mui/material/Table';
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";

import {
    Table,
    Pagination,
    Select,
    Divider,
    Slider,
    Rate 
} from 'antd'

const dataSource = [
	{
	  key: '1',
	  name: 'Mike',
	  age: 32,
	  address: '10 Downing Street',
	},
	{
	  key: '2',
	  name: 'John',
	  age: 42,
	  address: '10 Downing Street',
	},
  ];

  const columns = [
	{
	  title: 'Name',
	  dataIndex: 'name',
	  key: 'name',
	},
	{
	  title: 'Age',
	  dataIndex: 'age',
	  key: 'age',
	},
	{
	  title: 'Address',
	  dataIndex: 'address',
	  key: 'address',
	},
  ];
  

const companyColumns = [
    {
        title: 'Name',
        dataIndex: 'CName',
        key: 'CName',
        render: (text, row) => <a href={`/FindCompanies?id=${row.CId}`}>{text}</a>
    }
]

export default class FindCompanies extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the inputted search,
		// and the list of companies of that search.
		this.state = {
			name: "",
			//foundCompanies: [],
			// queries are working, but they're not populating the table, so testing
			foundCompanies: [{"CId":5,"CName":"THE CHEMICO GROUP","CCity":"Southfield","CState":"Michigan","CCountry":"United States","Size":"200-500","CDescription":"The Chemico Group is a chemical company providing single integrated solution for the chemical lifecycle."}],
			roleQuery: "",
			openingQuery: "",
			locationQuery: "",
			salaryQuery: "",
			companyInfoQuery: "",
			selectedCompanyId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            selectedCompanyDetails: null,
		}

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);

		this.handleRoleQueryChange = this.handleRoleQueryChange.bind(this);
		this.submitRoleQuery = this.submitRoleQuery.bind(this);

		this.handleOpeningQueryChange = this.handleOpeningQueryChange.bind(this);
		this.submitOpeningQuery = this.submitOpeningQuery.bind(this);

		this.handleLocationQueryChange = this.handleLocationQueryChange.bind(this);
		this.handleSalaryQueryChange = this.handleSalaryQueryChange.bind(this);
		this.submitJobQuery = this.submitJobQuery.bind(this);
	}

	handleSearchChange(e) {
		this.setState({
			name: e.target.value
		});
	}

	handleRoleQueryChange(event) {
        this.setState({ roleQuery: event.target.value })
    }

	submitRoleQuery() {
		fetch(`http://localhost:8081/companypos/${this.state.roleQuery}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(companiesList => {
				console.log(companiesList); //displays your JSON object in the console
				let companiesDivs = companiesList.map((company, i) =>
					/* ---- Part 2 (FindCompanies) ---- */
					<div key={i} className="companyResults">
						<div className="name">{company.CName}</div>
					</div>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					foundCompanies: companiesDivs
				});
			});
	}

	handleOpeningQueryChange(event) {
        this.setState({ openingQuery: event.target.value })
    }

	submitOpeningQuery() {
		fetch(`http://localhost:8081/companyopening/${this.state.openingQuery}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(companiesList => {
				console.log(companiesList); //displays your JSON object in the console
				let companiesDivs = companiesList.map((company, i) =>
					/* ---- Part 2 (FindCompanies) ---- */
					<div key={i} className="companyResults">
						<div className="name">{company.CName}</div>
					</div>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					foundCompanies: companiesDivs
				});
			});
	}

	handleLocationQueryChange(event) {
        this.setState({ locationQuery: event.target.value })
    }

	handleSalaryQueryChange(event) {
        this.setState({ salaryQuery: event.target.value })
    }

	submitJobQuery() {
		fetch(`http://localhost:8081/jobopenings?Location=${this.state.locationQuery}&Salary=${this.state.salaryQuery}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(companiesList => {
				console.log(companiesList); //displays your JSON object in the console
				let companiesDivs = companiesList.map((company, i) =>
					/* ---- Part 2 (FindCompanies) ---- */
					<div key={i} className="companyResults">
						<div className="name">{company.CName}</div>
					</div>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					foundCompanies: companiesDivs
				});
			});
    }

	// for individual companies when you click on the hyperlink
	// SubmitCompanyInfoQuery(res, req) {
	// 	// Send an HTTP request to the server.
	// 	// 1 fetch for 1 query
	// 	fetch(`http://localhost:8081/company/${this.state.companyInfoQuery}`,
	// 	  {
	// 		method: 'GET' // The type of HTTP request.
	// 	  }).then(res => {
	// 		// Convert the response data to a JSON.
	// 		return res.json();
	// 	  }, err => {
	// 		// Print the error if there is one.
	// 		console.log(err);
	// 	  }).then(companiesList => {
	
	// 		// Map each attribute of a company in this.state.people to an HTML element
	// 		let companiesDivs = companiesList.map((company, i) =>
	// 		  <div key={i} className="company">
	// 			<div className="id">{company.CId}</div>
	// 			<div className="name">{company.CName}</div>
	// 			<div className="city">{company.CCity}</div>
	// 		  </div>);
	
	// 		// Set the state of the company list to the value returned by the HTTP response from the server.
	// 		this.setState({
	// 		  companies: companiesDivs
	// 		});
	// 	  }, err => {
	// 		// Print the error if there is one.
	// 		console.log(err);
	// 	  });
	// }

	componentDidMount() {
        getCompany(this.state.selectedCompanyId).then(res => {
            this.setState({ selectedCompanyDetails: res.results })
        })
    }









	submitSearch() {
		/* ---- Part 2 (FindCompanies) ---- */
		// TODO: (4) - Complete the fetch for this function
		// Hint: Name of search submitted is contained in `this.state.search`.

		fetch(`http://localhost:8081/companies/${this.state.name}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(companiesList => {
				console.log(companiesList); //displays your JSON object in the console
				let companiesDivs = companiesList.map((company, i) =>
					/* ---- Part 2 (FindCompanies) ---- */
					// TODO: (6) - Complete the HTML for this map function
					<div key={i} className="companyResults">
						<div className="name">{company.CompanyName}</div>
						<div className="name">{company.city}</div>
						<div className="name">{company.state}</div>
						{/* <button onClick={this.submitCompanyPage} id="myButton" >Company Page</button> */}
					</div>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					foundCompanies: companiesDivs
				});
			});
	}

	submitCompanyPage() {
		document.getElementById("myButton").onclick = function () {
			window.location.href = `http://localhost:3000/companypage/${this.state.name}`
		};
	}

	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="FindCompanies" />
				<div className="container recommendations-container">
					<br></br>
					<div className="jumbotron findFriend-headspace">
					<div className="h5">Find Companies</div>
						<Row>
						{/* role query */}
						<FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Role</label>
                            <FormInput placeholder="Role" value={this.state.roleQuery} onChange={this.handleRoleQueryChange} />
							<br></br>
							<button type="submit" class="btn btn-primary" style={{ width: '10vw', margin: '0 auto' }} onClick={this.submitRoleQuery}>Submit</button>
                        </FormGroup>
						{/* opening query */}
						<FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Opening</label>
                            <FormInput placeholder="Opening" value={this.state.openingQuery} onChange={this.handleOpeningQueryChange} />
							<br></br>
							<button type="submit" class="btn btn-primary" style={{ width: '10vw', margin: '0 auto' }} onClick={this.submitOpeningQuery}>Submit</button>
                        </FormGroup>
						{/* salary & city query */}
						<FormGroup style={{ width: '20vw', margin: '0 auto' }}>
							<Row>
							<Col>
                            <label>Salary</label>
                            <FormInput placeholder="Salary" value={this.state.salaryQuery} onChange={this.handleSalaryQueryChange} />
							</Col>
							<Col>
							<label>City</label>
                            <FormInput placeholder="City" value={this.state.locationQuery} onChange={this.handleLocationQueryChange} />
							</Col>
							</Row>
							<br></br>
							<button type="submit" class="btn btn-primary" style={{ width: '10vw', margin: '0 auto' }} onClick={this.submitJobQuery}>Submit</button>
                        </FormGroup>
						</Row>
						<br></br>
						{/* <div className="input-container">
							<input type='text' placeholder="Company Name" value={this.state.search} onChange={this.handleSearchChange} id="movieName" className="login-input" />
							<button id="submitMovieBtn" className="submit-btn" onClick={this.submitSearch} >Submit</button>
						</div> */}

						{/* <div className="header-container">
							<div className="headers">
								<div className="header"><strong>Company</strong></div>
								<div className="header"><strong>City</strong></div>
								<div className="header"><strong>State</strong></div>
							</div>
						</div> */}

						{/* <div className="results-container" id="results">
							{this.state.foundCompanies}
						</div> */}

						<div style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
							<Table dataSource={this.state.foundCompanies} columns={companyColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
							
							{/* <Table dataSource={dataSource} columns={columns} />; */}
						</div>

						<div>
							<Card>
								<CardBody>
									<h5>HELLO</h5>
								</CardBody>
							</Card>
						</div>

						{this.state.selectedCompanyDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
						<Card>
							<CardBody>
								<Row gutter='30' align='middle' justify='left'>
									<Col>
									<h5>{this.state.selectedCompanyDetails.CId}</h5>
									</Col>
									<Col>
									<h5>{this.state.selectedCompanyDetails.CName}</h5>
									</Col>
									<Col>
									<h5>{this.state.selectedCompanyDetails.CDescription}</h5>
									</Col>
									<Col>
									<h5>HI!!!</h5>
									</Col>
								</Row>
							</CardBody>
						</Card>
					</div> : null}

					</div>
				</div>
			</div>
		);
	}
}