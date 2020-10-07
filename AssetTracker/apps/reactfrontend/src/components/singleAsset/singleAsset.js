import React, { Component } from "react";
import './singleAsset.css'

class SingleAsset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      details: null,
      asset: {
        assetTag: '',
        assetType: '',
        createdBy: '',
        assetStatus: '',
        serialNumber: '',
        assetCondition: ''
      }
    };
  }

  componentDidMount() {
    this.setState({
      assetTag: this.props.asset.assetTag,
      assetType: this.props.asset.assetType,
      createdBy: this.props.asset.createdBy,
      assetStatus: this.props.asset.assetStatus,
      assetCondition: this.props.asset.assetCondition,
      serialNumber: this.props.asset.serialNumber
    })
  }

  render() {
    let details = null
    let tab1 = 'white'
    let tab2 = 'white'
    let tab3 = 'white'
    if(this.state.details === 'history'){
      details = <h1>History component</h1>
      tab1 = 'gray'
    } else if(this.state.details === 'details'){
      details = 
        <div>
          <h3>Screen Size: {this.props.asset.screen_size}</h3>
          <h3>Ram: {this.props.asset.ram}</h3>
          <h3>Year: {this.props.asset.year}</h3>
          <h3>Hard Drive: {this.props.asset.hard_drive}</h3>
          <h3>Condition: {this.props.asset.asset_condition}</h3>
        </div>
      tab2 = 'gray'
    } else if(this.state.details === 'notes'){
      details = <h1>Notes component</h1>
      tab3 = 'gray'
    } 

    return(
      <div className='singleAsset'>
        <div className='SingleAssetHeader'>
          <div style={{ height: '40%'}}>
            <img className='SingleAssetPicture' alt='picture' src='../../../static/frontend/img/laptop.png'/>
            <div className='SingleAssetSummary'>
              <h3>{this.props.asset.asset_tag}</h3>
              <h3>{this.props.asset.serial_number}</h3>
              <div>
                <select defaultValue={this.props.asset_status} name="assetStatus" id="id_add_asset_status" className="" onChange={(event) => this.changeHandler(event, 'assetType')}>
                  <option value="In Repair">In Repair</option>
                  <option value="Locked at the office">Locked at the office</option>
                  <option value="On Loan">On Loan</option>
                  <option value="Needs Resetting">Needs Resetting</option>
                  <option value="Extended Loan">Extended Loan</option>
                  <option value="Unknown">Unknown</option>
                  <option value="Lost">Lost</option>
                  <option value="Stolen">Stolen</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Ready">Ready</option>
                </select>
              </div>
              <h3>{this.props.asset.device_type}</h3>
            </div>
          </div>
          <div style={{ height: '60%'}}>
            <div className='SingleAssetOptions'>
              <h3 onClick={() => this.setState({ details: 'details' })} style={{backgroundColor: tab2}} className='SingleAssetOptionsTab' id='details-tab'>Details</h3>
              <h3 onClick={() => this.setState({ details: 'history' })} style={{backgroundColor: tab1}} className='SingleAssetOptionsTab' id='history-tab'>History</h3>
              <h3 onClick={() => this.setState({ details: 'notes' })} style={{backgroundColor: tab3}} className='SingleAssetOptionsTab' id='notes-tab'>Notes</h3>
            </div>
            <div className='SingleAssetDetails'>
              {details}
            </div>
            <button className='SingleAssetButton' onClick={this.props.hide} id='single-asset-submit'>  ✔  </button>
          </div>
        </div>
      </div>
    )
  }
}

export default SingleAsset