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
		title: 'Page Employee Name',
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
		title: 'Page Role',
		dataIndex: 'role',
		key: 'role',
		// sorter: (a, b) => a.role.localeCompare(b.role),
	}
]

const specificEmployeeColumns = employeeColumns.concat([
	{
		title: 'Remote',
		dataIndex: 'remote',
		key: 'remote',
		// sorter: (a, b) => a.role.localeCompare(b.role),
	}
]);

export default class EmployeePage extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the inputted search,
		// and the list of employees of that search.
		this.state = {
			e_id: window.location.search ? window.location.search.substring(1).split('=')[1] : 1,
			name: "",
			// foundEmployees: [],
			// rawfoundEmployees: [],
			similarEmployees: [],
			employeeDetails: [{ "description": "Unavailable" }],
			openJobs: []
		}

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
		console.log("e_id: " + this.state.e_id)
		console.log(this.state.employeeDetails[0]["description"])
	}

	componentDidMount() {
		console.log("in EmployeePage componentDidMount. wait 5 sec")
		fetch(`http://localhost:8081/employeeFromId/${this.state.e_id}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(emplDetails => {
				this.setState({
					employeeDetails: emplDetails,
				})
				// console.log(this.state.employeeDetails[0]["description"])
			}
			);
		fetch(`http://localhost:8081/employeesSimilar/${this.state.e_id}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(simEmplList => {
				this.setState({
					similarEmployees: simEmplList,
				})
			}
			);
		fetch(`http://localhost:8081/openJobSameTitle/${this.state.e_id}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(openJobList => {
				this.setState({
					openJobs: openJobList,
				})
			}
			);



	}

	handleSearchChange(e) {
		this.setState({
			name: e.target.value
		});
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
					rawfoundEmployees: employeesList,
					foundEmployees: employeesDivs
				});
				// console.log(this.state.rawfoundEmployees);
			});
	}




	render() {
		// console.log(this.state.employeeDetails[0]["description"])

		return (
			<div className="Recommendations">
				<PageNavbar active="FindEmployees" />

				<div className="container recommendations-container">
					<br></br>
					<div className="jumbotron findFriend-headspace"> {/* EmployeePage) big grey container ---- this.state.employeeDetails[0]["description"] */}
						<div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
							<h3>Employee Details</h3>
							<Table dataSource={this.state.employeeDetails} columns={specificEmployeeColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
						</div>
						<p>{this.state.employeeDetails[0]["description"]} </p>

					</div>


					{/* hyperlinks */}
					<div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
						<h3>Similar Employees</h3>
						<Table dataSource={this.state.similarEmployees} columns={employeeColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
					</div>

					<div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
						<h3>Job Openings for this Role</h3>
						<Table dataSource={this.state.openJobs} columns={employeeColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
					</div>



				</div>

			</div>
		);
	}
}












