import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/FindCompanies.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class FindJobs extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the inputted search,
		// and the list of companies of that search.
		this.state = {
			companyName: "",
			foundJobs: []
		}

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
	}

	handleSearchChange(e) {
		this.setState({
			companyName: e.target.value
		});
	}

	submitSearch() {
		/* ---- Part 2 (FindCompanies) ---- */
		// TODO: (4) - Complete the fetch for this function
		// Hint: Name of search submitted is contained in `this.state.search`.

		fetch(`http://localhost:8081/jobs/${this.state.companyName}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(jobsList => {
				console.log(jobsList); //displays your JSON object in the console
				let jobsDivs = jobsList.map((job, i) =>
					/* ---- Part 2 (FindCompanies) ---- */
					// TODO: (6) - Complete the HTML for this map function
					<div key={i} className="companyResults">
						<div className="name">{job.id}</div>
						<div className="name">{job.Company}</div>
						<div className="name">{job.JobName}</div>
						{/* <button onClick={this.submitJobPage} id="myButton" >Job Page</button> */}
					</div>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					foundJobs: jobsDivs
				});
			});
	}

	submitJobPage() {
		document.getElementById("myButton").onclick = function () {
			window.location.href = `http://localhost:3000/jobpage/${this.state.jobID}`
		};
	}


	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="FindJobs" />

				<div className="container recommendations-container">
					<br></br>
					<div className="jumbotron findFriend-headspace">
						<div className="h5">Find Jobs</div>
						<div className="input-container">
							<input type='text' placeholder="Company Name" value={this.state.search} onChange={this.handleSearchChange} id="movieName" className="login-input" />
							{/* ---- Part 2 (FindCompanies) ---- */}
							{/* TODO: (5) - Edit button element below */}
							<button id="submitMovieBtn" className="submit-btn" onClick={this.submitSearch} >Submit</button>
						</div>
						<div className="header-container">
							<div className="headers">
								<div className="header"><strong>Job ID</strong></div>
								<div className="header"><strong>Company</strong></div>
								<div className="header"><strong>Job Title</strong></div>
							</div>
						</div>

						<div className="results-container" id="results">
							{this.state.foundJobs}
						</div>
					</div>
				</div>
			</div>
		);
	}
}