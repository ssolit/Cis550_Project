import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/FindEmployees.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    Table
} from 'antd'


// columns for Employees table
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
			name: "",
			rawfoundEmployees: [],
		}

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
	}

	// updates input for serach bar on typing
	handleSearchChange(e) {
		this.setState({
			name: e.target.value
		});
	}

	// runs when Sumbit search button is clicked
	submitSearch() {
		fetch(`http://localhost:8081/employees/${this.state.name}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(employeesList => {
				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					rawfoundEmployees: employeesList,
				});
			});
	}



	// HTML for rendering page
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
							<button id="submitMovieBtn" className="submit-btn" onClick={this.submitSearch} >Submit</button>
						</div>

						{/* Results table with hyperlinks */}
						<div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
							<h3>Employees</h3>
							<Table dataSource={this.state.rawfoundEmployees} columns={employeeColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
						</div>

					</div>
				</div>
			</div>
		);
	}
}












