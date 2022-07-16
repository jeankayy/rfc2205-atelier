import React, {useState} from 'react'
import Rating from '@mui/material/Rating';
import axios from 'axios'

class AddReviewForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stars: 0,
      summary: '',
      review: '',
      username: '',
      recommend: '',
      email: '',
      alert: false
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = event.target.value;
    const name = target.name;
    this.setState({
      [name] : value
    })
  }

  handleAddReview = (event) => {
    event.preventDefault()
    var characteristicsToSend = this.translateCharacteristics(this.props.characteristics);
    var review = {
        "product_id": Number(this.props.currentProduct),
        "rating": Number(this.state.stars),
        "summary": this.state.summary,
        "body": this.state.review,
        "recommend": this.state.recommend === 'true',
        "name" : this.state.username,
        "email": this.state.email,
        "characteristics": characteristicsToSend
      }
      if(this.checkFormat(review)){
        axios.post('/reviews', review)
        .then(() => {this.props.handleAddModal()})
        .catch((err) => {
          this.setState({
            alert: true
          })
        })
      } else {
        this.setState({
          alert: true
        })
      }
    }

  checkFormat = (review) => {
    if(!review['rating']){
      return false
    }
    if(review['body'].length < 50 || review['body'].length > 1000 ){
      return false
    }
    if(review['recommend'] === ''){
      return false
    }
    if(review['name'] === ''){
      return false
    }
    if(review['email'] === '' || !review['email'].includes('@') || !review['email'].includes('.com')){
      return false
    }
    if(Object.values(review['characteristics']).includes(NaN)){
      return false
    }
    return true;

  }

  translateCharacteristics = (characteristicsObj) => {
    var translated = {};
    for(var key in characteristicsObj){
      var id = characteristicsObj[key]['id']
      var rating = Number(this.state[key])
      var strId = id.toString();
      translated[strId] = rating
    }

    return translated;

    }

  starLabels = () => {
    const starLabels = ['Poor', 'Fair', 'Average', 'Good', 'Great']
    if(this.state.stars > 0) {
      return <React.Fragment>{starLabels[this.state.stars - 1]}</React.Fragment>
    } else {
      return <React.Fragment/>
    }
  }

  showRatings = (characteristic) => {

    var ratings = {
      Size: ['A size too small', '1/2 a size too small', 'Perfect', '1/2 a size too big', 'A size too wide'],
      Width: ['Too narrow', 'Slightly narrow', 'Perfect', 'Slightly wide', 'Too wide'],
      Comfort: ['Uncomfortable', 'Slightly uncomfortable', 'Ok', 'Comfortable', 'Perfect'],
      Quality: ['Poor', 'Below Average', 'What I expected', 'Pretty great', 'Perfect'],
      Length: ['Runs short', 'Runs slightly short', 'Perfect', 'Runs slightly long', 'Runs long'],
      Fit: ['Runs tight', 'Runs slightly tight', 'Perfect', 'Runs slightly long', 'Runs Long']
    }

    var ratings = ratings[characteristic] || []
      return (
          <table>
        <tbody>
          <tr>
          <td><b>{characteristic} * : </b></td>
        {ratings.map(rating => {
          return <td><center><input key = {rating + ratings.indexOf(rating)} type = 'radio' value = {ratings.indexOf(rating) + 1} name = {characteristic} onClick = {this.handleInputChange}/><br/><label>{rating}</label></center></td>
        })}
          </tr>
       </tbody>
       </table>
      )

  }

  closeAlert = (event) =>{
    this.setState({
      alert: false
    })
  }

  render(){

    if(this.props.characteristics) {
      var characteristics = Object.keys(this.props.characteristics)
    }

    if(this.state.review.length < 50 ){
      var counter = `Minimum required characters left: [${50 - this.state.review.length}]`
    } else if (this.state.review.length <= 1000 ){
      var counter = `Minimum reached`
    } else {
      var counter = 'Over maximum characters'
    }

    if(this.state.alert){
      var alert = <dialog open>
      <h3>You must enter the following </h3>
      <h5>
      This error will occur if:
      Any mandatory fields are blank
      The review body is less than 50 characters
      The email address provided is not in correct email format
      The images selected are invalid or unable to be uploaded.
      </h5><button onClick = {this.closeAlert}>close</button></dialog>
    } else {
      var alert = <React.Fragment/>
    }

    return(
      <div>
        <form>

          {alert}

          <h4>Write Your Review</h4>
          <h5>About the {this.props.productName}</h5>

          Overall Rating * :<Rating name = 'stars' value = {Number(this.state.stars)} onClick = {this.handleInputChange} getLabelText= {this.starLabels}/> {this.starLabels()}
          <br/>

          Do you recommend this product?* :
          <input type = 'radio' value = {'true'} name = "recommend" onClick = {this.handleInputChange}/> Yes
          <input type = 'radio' value = {'false'} name = "recommend" onClick = {this.handleInputChange}/> No
          <br/>

          {characteristics.map(characteristic => {return this.showRatings(characteristic)})}
          <br/>

          Review Summary (optional): <input type = 'text' value = {this.state.summary} placeholder = 'Best purchase ever!' name = 'summary' onChange = {this.handleInputChange} maxLength = '60'/>
          <br/>

          Full Review* : <input type = 'text' value = {this.state.review} placeholder = 'Why did you like the product or not?' name = 'review' onChange = {this.handleInputChange} minLength = '50' maxLength = '1000'/>
          {counter}
          <br/>

          <label for="file">Upload photos</label>
          <input type="file" id="file" name="file" multiple></input>
          <br/>

          Email*: <input type = 'text' value = {this.state.email} placeholder = 'Example: jackson11@email.com' name = 'email' onChange = {this.handleInputChange} maxLength = '60'/>
          <br/>
          For authentication reasons, you will not be emailed.
          <br/>

          Username*: <input type = 'text' value = {this.state.username} placeholder = 'Example: jackson11!' name = 'username' onChange = {this.handleInputChange} maxLength = '60'/>
          <br/>
          For privacy reasons, do not use your full name or email address



          <input type = "submit" value = "Submit Review" onClick = {this.handleAddReview}/>

        </form>
      <button onClick = {this.props.handleAddModal}> Close </button>
      </div>
    )
  }

}

export default AddReviewForm;
