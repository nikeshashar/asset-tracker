import React, { Component } from "react";
import './addAssetForm.css'

class AddAssetForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asset: {
        assetTag: '',
        assetType: 'Laptop',
        assetModel: '',
        createdBy: '',
        assetStatus: 'Ready',
        assetCondition: 'Good',
        serialNumber: '',
        year: '',
        hardDrive: '',
        screenSize: '',
        ram: '',
      },
      messageType: '',
      company: "",
      showMessage: false,
      companyusers: "",
    }
    this.submitHandler = this.submitHandler.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
    this.hideMessageHandler = this.hideMessageHandler.bind(this)

  }

  componentDidMount() {
    const newData = {...this.state.asset}
    let newDataUser = {...newData["createdBy"]}
    newDataUser = window.django.user.user_id
    newData["createdBy"] = newDataUser
    this.setState({asset: newData})
    this.getCompanyID()
  }

  getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  getCompanyID(){
    fetch('/companyusers/api/companyusers/'+ window.django.user.user_id)
    .then(response => {
      if (response.status > 400) {
        return this.setState(() => {
          return { placeholder: "Something went wrong!" };
        });
      }
    return response.json();
    })
    .then(data => {
      this.setState(() => {
        return {
          company: data.Company
        }
      });
    });
  }


  submitHandler(event) {
    event.preventDefault()
    console.log(this.state.asset)
    let csrfToken = this.getCookie('csrftoken')
    fetch('api/asset/', {
      method: 'POST',
      headers: {
        "X-CSRFToken": csrfToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "AssetTag": this.state.asset.assetTag,
        "DeviceType": this.state.asset.assetType,
        "DeviceModel": this.state.asset.assetModel,
        "CreatedBy": this.state.asset.createdBy,
        "AssetStatus": this.state.asset.assetStatus,
        "SerialNumber": this.state.asset.serialNumber,
        "AssetCondition": this.state.asset.assetCondition,
        "Ram": this.state.asset.ram,
        "Year": this.state.asset.year,
        "ScreenSize": this.state.asset.screenSize,
        "HardDrive": this.state.asset.hardDrive,
        "Company": this.state.company,
      }),
    })
    .then(response => {
      if (response.ok) {
        this.setState({ showMessage: true, messageType: "successMessage" })
        $('#id_add_asset')[0].reset(); 
        return response.json()
      } else {
        this.setState({ showMessage: true, messageType: "failMessage" })
        throw new Error('Something went wrong ...');
      }
      })
    .catch(error => (console.log(error)));
  }


  changeHandler(event, identifier) {
    event.preventDefault()
    const newData = {...this.state.asset}
    let newDataElement = {...newData[identifier]}
    if (identifier === 'assetTag') {
      newDataElement = 'MA' + event.target.value
    } else {
      newDataElement = event.target.value
    }
    newData[identifier] = newDataElement
    this.setState({asset: newData})
  }

  hideMessageHandler() {
    this.setState({showMessage: false})
  }

  assetTagIsUnique() {
    fetch('/companyusers/api/companyusers/')
    .then(response => {
      if (response.status > 400) {
        return this.setState(() => {
          return { placeholder: "Something went wrong!" };
        });
      }
    return response.json();
    })
    .then(data => {
      data = this.finalizeCompanyResponse(data)
      this.setState(() => {
        return {
          companyusers: data
        }
      });
      return fetch("api/asset")
    })
    .then(response => {
      if (response.status > 400) {
        return this.setState(() => {
          return { placeholder: "Something went wrong!" };
        });
      }
      return response.json();
    })
    .then(data => {
      data = this.finalizeResponse(data)
      if (data.includes(this.state.assetTag)){
        return false
        } else {
        return true
        }
    });
  };

	finalizeCompanyResponse(data) {
		var newArray = data.map(x => x.User)
		return newArray
	}

	finalizeResponse(data) {
		var length = data.length
		var newArray = []
		for(var i=0; i < length; i++) {
      if ( this.state.companyusers.includes(data[i].CreatedBy) ) {
          newArray.push(data[i])
      }
		}
		return newArray
	}

  render() {
    let message = null
    if(this.state.messageType == "successMessage" && this.state.showMessage == true) {
      message =
        <div>
          <div className='backdrop' onClick={() => this.hideMessageHandler()}></div>
          <div className='showMessage' onClick={() => this.hideMessageHandler()}>
            <h3>Successfully added</h3>
          </div>
        </div>
    } else if(this.state.messageType == "failMessage" && this.state.showMessage == true){
      message =
        <div>
          <div className='backdrop' onClick={() => this.hideMessageHandler()}></div>
          <div className='showMessage' onClick={() => this.hideMessageHandler()}>
            <h3>Failed to Add Asset - Asset Tag or Serial Number Not Unique</h3>
          </div>
        </div>
    }

    return(
      <div>
        {message}
        <div className="add_asset_container">
          <form id='id_add_asset' onSubmit={this.submitHandler}>
          <h1>Add an Asset</h1>
          <label className="asset_add_title" for="id_add_asset_tag">Asset Tag:</label>
          <input className="add_asset_input" inputtype='input' required type="text" onChange={(event) => this.changeHandler(event, 'assetTag')} name="assetTag" id="id_add_asset_tag"></input>
          <label className="asset_add_title" for="id_add_serial_number">Serial Number:</label>
          <input className="add_asset_input" inputtype='input' required type="text" onChange={(event) => this.changeHandler(event,'serialNumber')} name="serialNumber" id="id_add_serial_number"></input>
          <label className="asset_add_title" for="id_add_asset_type" >Asset Type:</label>
          <select defaultValue='Laptop' name="assetType" id="id_add_asset_type" className="add_asset_input" onChange={(event) => this.changeHandler(event, 'assetType')}>
            <option value="Laptop">Laptop</option>
            <option value="Mobile">Mobile</option>
          </select>
          <label className="asset_add_title" for="id_add_asset_model">Asset Model:</label>
          <input className="add_asset_input" inputtype='input' required type="text" onChange={(event) => this.changeHandler(event,'assetModel')} name="assetModel" id="id_add_asset_model"></input>
          <label className="asset_add_title" for="id_add_asset_condition" >Asset Condition:</label>
          <select defaultValue='Good' name="assetCondition" id="id_add_asset_condition" className="add_asset_input" onChange={(event) => this.changeHandler(event, 'assetCondition')}>
            <option value="Good">Good</option>
            <option value="Bad">Broken</option>
          </select>
          <label className="asset_add_title" for="id_add_asset_status" >Asset Status:</label>
          <select defaultValue='Ready' name="assetStatus" id="id_add_asset_status" className="add_asset_input" onChange={(event) => this.changeHandler(event, 'assetStatus')}>
            <option value="Ready">Ready</option>
            <option value="In Repair">In Repair</option>
            <option value="Locked at the office">Locked at the office</option>
            <option value="On Loan">On Loan</option>
            <option value="Needs Resetting">Needs Resetting</option>
            <option value="Extended Loan">Extended Loan</option>
            <option value="Unknown">Unknown</option>
            <option value="Lost">Lost</option>
            <option value="Stolen">Stolen</option>
            <option value="Unavailable">Unavailable</option>
          </select>
            <label className="asset_add_title" for="id_add_year">Year:</label>
            <input className="add_asset_input" inputtype='input' maxLength='4' required type="number" onChange={(event) => this.changeHandler(event, 'year')} name="year" id="id_add_year"></input>
            <label className="asset_add_title" for="id_add_ram">Ram (GB):</label>
            <input className="add_asset_input" inputtype='input' required type="number" onChange={(event) => this.changeHandler(event, 'ram')} name="ram" id="id_add_ram"></input>
            <label className="asset_add_title" for="id_add_hard_drive">Hard Drive (GB):</label>
            <input className="add_asset_input" inputtype='input' required type="number" onChange={(event) => this.changeHandler(event, 'hardDrive')} name="hardDrive" id="id_add_hard_drive"></input>
            <label className="asset_add_title" for="id_add_screen_size">Screen Size (Inches):</label>
            <input className="add_asset_input" inputtype='input' maxLength='2' required type="number" onChange={(event) => this.changeHandler(event, 'screenSize')} name="screeSize" id="id_add_screen_size"></input>
          <button className='btn btn-primary' id="id_add_asset_submit" style={{marginTop:"14px", clear:'both'}} type="submit" value="submit">Add Asset</button>
          </form>
        </div> 
      </div>
    )
  }
}

export default AddAssetForm;