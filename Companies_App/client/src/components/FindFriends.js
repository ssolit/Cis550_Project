import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/FindFriends.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class FindFriends extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the inputted login,
		// and the list of friends of that login.
		this.state = {
			login: "",
			foundFriends: []
		}

		this.handleLoginChange = this.handleLoginChange.bind(this);
		this.submitLogin = this.submitLogin.bind(this);
	}

	handleLoginChange(e) {
		this.setState({
			login: e.target.value
		});
	}

	submitLogin() {
		/* ---- Part 2 (FindFriends) ---- */
		// TODO: (4) - Complete the fetch for this function
		// Hint: Name of login submitted is contained in `this.state.login`.

		fetch(`http://localhost:8081/friends/${this.state.login}`,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(friendsList => {
				console.log(friendsList); //displays your JSON object in the console
				let friendsDivs = friendsList.map((friend, i) =>
					/* ---- Part 2 (FindFriends) ---- */
					// TODO: (6) - Complete the HTML for this map function
					<div key={i} className="friendResults">
						<div className="login">{friend.login}</div>
						<div className="name">{friend.name}</div>
					</div>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					foundFriends: friendsDivs
				});
			});
	}


	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="FindFriends" />

				<div className="container recommendations-container">
					<br></br>
					<div className="jumbotron findFriend-headspace">
						<div className="h5">Find Friends</div>
						<div className="input-container">
							<input type='text' placeholder="awest@gmail.com" value={this.state.login} onChange={this.handleLoginChange} id="movieName" className="login-input" />
							{/* ---- Part 2 (FindFriends) ---- */}
							{/* TODO: (5) - Edit button element below */}
							<button id="submitMovieBtn" className="submit-btn" onClick={this.submitLogin} >Submit</button>
						</div>
						<div className="header-container">
							<div className="headers">
								<div className="header"><strong>Login</strong></div>
								<div className="header"><strong>Name</strong></div>
							</div>
						</div>

						<div className="results-container" id="results">
							{this.state.foundFriends}
						</div>
					</div>
				</div>
			</div>
		);
	}
}