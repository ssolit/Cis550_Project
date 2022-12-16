import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/FindCompanies.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "shards-ui/dist/css/shards.min.css";

import { Form, FormInput, FormGroup } from "shards-react";

import { Container, Row, Col } from 'react-bootstrap';

export default class FindCompanies extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the inputted search,
		// and the list of companies of that search.
		this.state = {
			name: "",
			foundCompanies: [],
			roleQuery: "",
			openingQuery: "",
			locationQuery:"",
			salaryQuery:""
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
						<div className="name">{}</div>
						<div className="name">{}</div>
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
						<div className="name">{}</div>
						<div className="name">{}</div>
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
						<div className="name">{company.CCity}</div>
						<div className="name">{}</div>
					</div>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					foundCompanies: companiesDivs
				});
			});
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

	// maybe just make 3 separate search buttons, one for each query


	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="FindCompanies" />
				<div className="container recommendations-container">
					<br></br>
					<div className="jumbotron findFriend-headspace">
					<div className="h5">Find Companies</div>
						<Row>
						<FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Role</label>
                            <FormInput placeholder="Role" value={this.state.roleQuery} onChange={this.handleRoleQueryChange} />
							<br></br>
							<button type="submit" class="btn btn-primary" style={{ width: '10vw', margin: '0 auto' }} onClick={this.submitRoleQuery}>Submit</button>
                        </FormGroup>
						<FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Opening</label>
                            <FormInput placeholder="Opening" value={this.state.openingQuery} onChange={this.handleOpeningQueryChange} />
							<br></br>
							<button type="submit" class="btn btn-primary" style={{ width: '10vw', margin: '0 auto' }} onClick={this.submitOpeningQuery}>Submit</button>
                        </FormGroup>
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
						

						<div className="header-container">
							<div className="headers">
								<div className="header"><strong>Company</strong></div>
								<div className="header"><strong>City</strong></div>
								<div className="header"><strong>State</strong></div>
							</div>
						</div>

						<div className="results-container" id="results">
							{this.state.foundCompanies}
						</div>
					</div>
				</div>
			</div>
		);
	}
}