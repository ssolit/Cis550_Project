import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/FindEmployees.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class FindEmployees extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the inputted search,
		// and the list of employees of that search.
		this.state = {
			e_id: "",
			name: "",
			foundEmployees: []
		}

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
	}

	// componentDidMount() {
	// 	getAllEmployees(null, null).then(res => {
	// 		this.setState({ foundEmployees: res.results })
	// 	  })
	// }

	handleSearchChange(e) {
		this.setState({
			name: e.target.value
		});
		console.log("e_id: " + this.state.e_id + ", name: " + this.state.name);
	}

	submitSearch() {
		/* ---- Part 2 (FindEmployees) ---- */
		// TODO: (4) - Complete the fetch for this function
		// Hint: Name of search submitted is contained in `this.state.search`.
		console.log("entered submitSearch")

		fetch(`http://localhost:8081/employees/${this.state.name}`,
			{
				method: "GET"
			}).then(res => {
				console.log("submitSearch fetch 1");
				return res.json();
			}, err => {
				console.log(err);
			}).then(employeesList => {
				console.log(employeesList); //displays your JSON object in the console
				let employeesDivs = employeesList.map((employee, i) =>
					/* ---- Part 2 (FindEmployees) ---- */
					// TODO: (6) - Complete the HTML for this map function
					<div key={i} className="employeeResults">
						<div className="name">{employee.employeeName}</div>
						<div className="name">{employee.CompanyName}</div>
						<div className="name">{employee.role}</div>
						{/* <button onClick={this.submitEmployeePage} id="myButton" >Employee Page</button> */}
					</div>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					foundEmployees: employeesDivs
				});
				
			});
	}




	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="FindEmployees" />

				<div className="container recommendations-container">
					<br></br>
					<div className="jumbotron findFriend-headspace">
						<div className="h5">Find Employees</div>
						<div className="input-container">
							<input type='text' placeholder="Employee Name" value={this.state.search} onChange={this.handleSearchChange} id="movieName" className="login-input" />
							{/* ---- Part 2 (FindEmployees) ---- */}
							{/* TODO: (5) - Edit button element below */}
							<button id="submitMovieBtn" className="submit-btn" onClick={this.submitSearch} >Submit</button>
						</div>
						<div className="header-container">
							<div className="headers">
								<div className="header"><strong>Employee Name</strong></div>
								<div className="header"><strong>Company Name</strong></div>
								<div className="header"><strong>Role</strong></div>
							</div>
						</div>

						<div className="results-container" id="results">
							{this.state.foundEmployees}
						</div>
					</div>
				</div>
			</div>
		);
	}
}