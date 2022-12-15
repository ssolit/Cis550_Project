import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/FindCompanies.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class FindCompanies extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the inputted search,
		// and the list of companies of that search.
		this.state = {
			name: "",
			foundCompanies: []
		}

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
	}

	handleSearchChange(e) {
		this.setState({
			name: e.target.value
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


	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="FindCompanies" />

				<div className="container recommendations-container">
					<br></br>
					<div className="jumbotron findFriend-headspace">
						<div className="h5">Find Companies</div>
						<div className="input-container">
							<input type='text' placeholder="Company Name" value={this.state.search} onChange={this.handleSearchChange} id="movieName" className="login-input" />
							{/* ---- Part 2 (FindCompanies) ---- */}
							{/* TODO: (5) - Edit button element below */}
							<button id="submitMovieBtn" className="submit-btn" onClick={this.submitSearch} >Submit</button>
						</div>
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