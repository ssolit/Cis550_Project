import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import FindFriends from './FindFriends';
import FindCompanies from './FindCompanies';
import CompanyPage from './CompanyPage';
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
						{/* ---- Part 2 (FindFriends) ---- */}
						<Route
							exact
							path="/FindFriends"
							render={() => (
								<FindFriends />
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
					</Switch>
				</Router>
			</div>
		);
	}
}