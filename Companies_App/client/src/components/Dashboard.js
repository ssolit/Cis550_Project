import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

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

const companyColumns = [
  {
      title: 'Company Name',
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
  }
]

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. 
    // This component maintains the list of companies.
    this.state = {
      CId: "",
			CName: "",
      companies: [],
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
    return (
      <div className="Dashboard">
				<PageNavbar active="Companies" />

				<div className="container recommendations-container">
					<br></br>
					<div className="jumbotron findFriend-headspace">
						<div className="h5">Companies</div>
						<div className="input-container">
							<input type='text' placeholder="Name" value={this.state.search} onChange={this.handleSearchChange} id="movieName" className="login-input" />
							{/* ---- Part 2 (FindEmployees) ---- */}
							{/* TODO: (5) - Edit button element below */}
							<button id="submitMovieBtn" className="submit-btn" onClick={this.submitSearch} >Submit</button>
						</div>

						{/* hyperlinks */}
						<div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
							<Table dataSource={this.state.companies} columns={companyColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
						</div>

					</div>
				</div>
			</div>
      // <div className="Dashboard">
      //   <PageNavbar active="Companies" />

      //   <div className="container Company-container">
      //     <br></br>
      //     <div className="jumbotron findFriend-headspace">
      //       <div className="company-container">
      //         <div className="company-header">
      //           <div className="header"><strong>Company Name</strong></div>
      //           <div className="header"><strong>City</strong></div>
      //           <div className="header"><strong>State</strong></div>
      //         </div>
      //       <div className="results-container" id="results">
      //         {this.state.Companies}
      //       </div>
      //     </div>
      //   </div>
      //   </div>
      // </div>
      );
    }
}