import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
	Table
} from 'antd'

const companyColumns = [
	{
		title: 'Name',
		dataIndex: 'CName',
		key: 'CName',
		render: (text, row) => <a href={`/CompanyPage?id=${row.CId}`}>{text}</a>
	},
	{
		title: 'City',
		dataIndex: 'CCity',
		key: 'CCity'
	},
	{
		title: 'State',
		dataIndex: 'CState',
		key: 'CState'
	},
	{
		title: 'Size',
		dataIndex: 'Size',
		key: 'Size'
	},
	{
		title: 'Description',
		dataIndex: 'CDescription',
		key: 'CDescription'
	}
];

const leadershipColumns = [
	{
		title: 'Name',
		dataIndex: 'Name',
		key: 'Name',
		render: (text, row) => <a href={`/EmployeePage?id=${row.EId}`}>{text}</a>
	},
	{
		title: 'Role',
		dataIndex: 'Role',
		key: 'Role'
	},
	{
		title: 'Description',
		dataIndex: 'Description',
		key: 'Description'
	}
];

export default class CompanyPage extends React.Component {
	constructor(props) {
		super(props);

		// The state maintained by this React Component. 
		// This component maintains the list of companies.
		this.state = {
			//companies: []
			CId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
			name: "",
			companyCEO: [],
			companyDetails: [{ "CDescription": "Unavailable" }],
		}

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
	}

	// React function that is called when the page load.
	componentDidMount() {
		fetch(`http://localhost:8081/companyInfo/${this.state.CId}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(coDetails => {
				this.setState({
					companyDetails: coDetails,
				})
			}
			);
		fetch(`http://localhost:8081/companyceo/${this.state.CId}`,
			{
				method: "GET"
			}).then(res => {
				console.log("CompanyPage.js companyceo here 1")
				return res.json();
			}, err => {
				console.log(err);
			}).then(ceoList => {
				this.setState({
					companyCEO: ceoList,
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
		console.log("entered submitSearch")
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
						<div className="name">{company.CName}</div>
						<div className="name">{company.CCity}</div>
						<div className="name">{company.CState}</div>
					</div>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					companies: companiesList,
					foundCompanies: companiesDivs
				});
			});
	}


	render() {
		console.log(this.state.companyCEO)
		return (
			<div className="Recommendations">
				<PageNavbar active="Companies" />

				<div className="container recommendations-container">
					<br></br>
					<div className="jumbotron findFriend-headspace">
						<div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
							<h3>Company Details</h3>
							<Table dataSource={this.state.companyDetails} columns={companyColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
						</div>
						{/* <p>{this.state.companyDetails[0]["CDescription"]} </p> */}
					</div>

					{/* hyperlinks */}
					<div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
						<h3>Company Leadership</h3>
						<Table dataSource={this.state.companyCEO} columns={leadershipColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
					</div>

				</div>
			</div>
		);
	}
}