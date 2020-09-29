import React, { Component } from "react";
import { render } from "react-dom";
import * as ReactBootStrap from 'react-bootstrap'

class UnauthorizedUsersDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unauthorizedusers: [],
      company: "",
      loaded: false,
      placeholder: "loading",
    };
  }

  componentDidMount() {
    fetch('/unauthorizedusers/api/unauthorizedusers')
      .then(response => {
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong..." };
          });
        }
      return response.json();
      })
      .then(data => {
        const newdata = data.map(user => {
          this.setState({company: user.Company})
          const extendUser = {...user.User, unauth_id: user.id}
          return extendUser
        })
        this.setState(() => {
          return {
            unauthorizedusers: newdata
          }
        });
      })
  }

  getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  handleApprove(user_object) {
    fetch(`/approveuser/api/approveuser/${user_object.id}/`, {
			method: 'PATCH',
			headers: {
					"X-CSRFToken": this.getCookie('csrftoken'),
					'Content-Type': 'application/json',
			},
		})
		.then(() => {
      fetch(`/companyusers/api/companyusers/all`, {
        method: 'POST',
        headers: {
            "X-CSRFToken": this.getCookie('csrftoken'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "User": user_object.id,
            "Company": this.state.company
        }),
      })
		})
		.then(() => {
      fetch(`/unauthorizedusers/api/unauthorizedusers/${user_object.unauth_id}/`, {
        method: 'DELETE',
        headers: {
            "X-CSRFToken": this.getCookie('csrftoken'),
            'Content-Type': 'application/json',
        },
      })
		})
		.then(() => {
			this.setState({unauthorizedusers: this.state.unauthorizedusers.filter(unauthorizedusers => user_object.id !== unauthorizedusers.id)})
		});
  }

  handleDeny(user_object){
    fetch(`/unauthorizedusers/api/unauthorizedusers/${user_object.unauth_id}/`, {
      method: 'DELETE',
      headers: {
        "X-CSRFToken": this.getCookie('csrftoken'),
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      fetch(`/approveuser/api/approveuser/${user_object.id}/`,{
        method: 'DELETE',
        headers: {
          "X-CSRFToken": this.getCookie('csrftoken'),
          'Content-Type': 'application/json',
        },
      })
    })
    .then(() => {
      this.setState({unauthorizedusers: this.state.unauthorizedusers.filter(unauthorizedusers => user_object.id !== unauthorizedusers.id)})
    });
  }

  render() {
      return (
      <div className="table_container">
        <h1>Unauthorized Users</h1>
        <ReactBootStrap.Table>
          <thead>
            <tr>
              <th scope="col">User ID</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            {this.state.unauthorizedusers.map(user => {
              return (
                <tr key={user.id} className="user_row">
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td><button class="btn btn-success" id={"id_user_approve_button_" + user.id } onClick={() => this.handleApprove(user)}>Approve</button>
                  <button class="btn btn-danger" id={"id_user_deny_button_" + user.id } onClick={() => this.handleDeny(user)}>Deny</button></td>
                </tr>
              );
            })}
          </tbody>
        </ReactBootStrap.Table>
      </div>
      );
    }
}

export default UnauthorizedUsersDisplay;
