import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/FindJobs.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
	Table
} from 'antd'



const jobColumns = [
	{
		title: 'Job ID',
		dataIndex: 'id',
		key: 'id',
		render: (text, row) => <a href={`/JobPage?id=${row.id}`}>{text}</a>
	},
	{
		title: 'Company Name',
		dataIndex: 'employer_name',
		key: 'employer_name',
	},
	{
		title: 'Title',
		dataIndex: 'title',
		key: 'title',
	}
]

export default class FindJobs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			j_id: "",
			name: "",
			foundJobs: [],
			rawfoundJobs: [],
		}

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
	}

	handleSearchChange(e) {
		this.setState({
			name: e.target.value
		});
	}

	getRawSearchResults() {
		fetch(`http://localhost:8081/jobs/${this.state.name}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			})
	}

	submitSearch() {

		fetch(`http://localhost:8081/jobs/${this.state.name}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(jobsList => {
				console.log(jobsList); //displays your JSON object in the console
				console.log(jobsList[0].employer_name);
				console.log(jobsList[0].title);
				let jobsDivs = jobsList.map((job, i) =>
					<div key={i} className="jobResults">
						<div className="name">{job.id}</div>
						<div className="name">{job.employer_name}</div>
						<div className="name">{job.title}</div>
					</div>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					rawfoundJobs: jobsList,
					foundJobs: jobsDivs
				});
				console.log(this.state.rawfoundEmployees);
				console.log(this.state.jobsDivs);
			});
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
							<button id="submitMovieBtn" className="submit-btn" onClick={this.submitSearch} >Submit</button>
						</div>

						{/* hyperlinks */}
						<div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
							<h3>Jobs</h3>
							<Table dataSource={this.state.rawfoundJobs} columns={jobColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
						</div>

					</div>
				</div>
			</div>
		);
	}
}












