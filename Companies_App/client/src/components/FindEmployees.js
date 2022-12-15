import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/FindEmployees.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Rate 
} from 'antd'



const employeeColumns = [
    {
        title: 'Employee Name',
        dataIndex: 'employeeName',
        key: 'employeeName',
        // sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
        render: (text, row) => <a href={`/EmployeePage?id=${row.employee_id}`}>{text}</a>
    },
	{
        title: 'Company Name',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        // sorter: (a, b) => a.CompanyName.localeCompare(b.CompanyName),
    },
	{
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        // sorter: (a, b) => a.role.localeCompare(b.role),
    }
]

export default class FindEmployees extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the inputted search,
		// and the list of employees of that search.
		this.state = {
			e_id: "",
			name: "",
			foundEmployees: [],
			rawfoundEmployees: [],
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
	}

	getRawSearchResults() {
		fetch(`http://localhost:8081/employees/${this.state.name}`,
			{
				method: "GET"
			}).then(res => {
				console.log("submitSearch then 1");
				return res.json();
			}, err => {
				console.log(err);
			})
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
				console.log("submitSearch then 1");
				return res.json();
			}, err => {
				console.log(err);
			}).then(employeesList => {
				console.log("submitSearch then 2");
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
					rawfoundEmployees: employeesList,
					foundEmployees: employeesDivs
				});
				// console.log(this.state.rawfoundEmployees);
			});
	}




	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="FindEmployees" />

				<div className="container recommendations-container">
					<br></br>
					<div className="jumbotron findFriend-headspace"> {/* FindEmployees) big grey container */}
						<div className="h5">Find Employees</div>
						<div className="input-container">
							<input type='text' placeholder="Employee Name" value={this.state.search} onChange={this.handleSearchChange} id="movieName" className="login-input" />
							{/* ---- Part 2 (FindEmployees) ---- */}
							{/* TODO: (5) - Edit button element below */}
							<button id="submitMovieBtn" className="submit-btn" onClick={this.submitSearch} >Submit</button>
						</div>

						{/* hyperlinks */}
						<div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
							<h3>hypertable</h3>
							<Table dataSource={this.state.rawfoundEmployees} columns={employeeColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
						</div>

					</div>
				</div>
			</div>
		);
	}
}












