import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/FindJobs.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
	Table
} from 'antd'



const jobColumns = [
	{
		title: 'Page Job ID',
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
	},
	{
		title: 'Remote',
		dataIndex: 'remote',
		key: 'remote',
	}

]

export default class JobPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			j_id: window.location.search ? window.location.search.substring(1).split('=')[1] : 1,
			name: "",
			similarJobs: [],
			jobDetails: [{ "text_description": "Unavailable" }],
			estimateSal: [{ "estimatedSalary": null }]
		}

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
		console.log("j_id: " + this.state.j_id)
		console.log(this.state.jobDetails[0]["text_description"])
	}

	componentDidMount() {
		fetch(`http://localhost:8081/jobFromId/${this.state.j_id}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(jDetails => {
				this.setState({
					jobDetails: jDetails,
				})
			}
			);
		fetch(`http://localhost:8081/jobsSimilar/${this.state.j_id}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(simJList => {
				this.setState({
					similarJobs: simJList,
				})
			}
			);
		fetch(`http://localhost:8081/estimatedSalary/${this.state.j_id}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(estSal => {
				this.setState({
					estimateSal: estSal,
				})
			}
			);
		console.log(this.state.estimateSal);


	}

	handleSearchChange(e) {
		this.setState({
			name: e.target.value
		});
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
			});
	}




	render() {
		let es = this.state.estimateSal[0]["estimatedSalary"] ? "$" + this.state.estimateSal[0]["estimatedSalary"] : "Unavailable"
		return (
			<div className="Recommendations">
				<PageNavbar active="FindJobs" />

				<div className="container recommendations-container">
					<br></br>
					<div className="jumbotron findFriend-headspace">
						<div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
							<h3>Job Details</h3>
							<Table dataSource={this.state.jobDetails} columns={jobColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
						</div>
						<h5>Estimated Salary</h5>
						<p> {es} </p>
						<h5>Job Description</h5>
						<p>{this.state.jobDetails[0]["text_description"]} </p>

					</div>


					{/* hyperlinks */}
					<div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
						<h3>Similar Jobs</h3>
						<Table dataSource={this.state.similarJobs} columns={jobColumns} pagination={{ pageSizeOptions: [5, 10], defaultPageSize: 5, showQuickJumper: true }} />
					</div>



				</div>

			</div>
		);
	}
}












