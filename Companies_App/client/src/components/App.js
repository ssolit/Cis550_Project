import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import FindCompanies from './FindCompanies';
import CompanyPage from './CompanyPage';
import FindJobs from './FindJobs';
export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							exact
							path="/companies"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							exact
							path="/FindCompanies"
							render={() => (
								<FindCompanies />
							)}
						/>
						<Route
							exact
							path="/companypage"
							render={() => (
								<CompanyPage />
							)}
						/>
						<Route
							exact
							path="/FindJobs"
							render={() => (
								<FindJobs />
							)}
						/>
						<Route
							exact
							path="/FindEmployees"
							render={() => (
								<FindEmployees />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}