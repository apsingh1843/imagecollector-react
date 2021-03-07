import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardBody, CardTitle, CardText, CardImg, Form, FormGroup, Label, Input, Col } from 'reactstrap';
import './index.css'

class ContentFeed extends Component {
  constructor() {
    super();
    this.state = {
      'items' : []
    }
    this.getItems = this.getItems.bind(this)
  }
  componentDidMount() {
    this.getItems();
  }

  getItems() {
    fetch('https://imagecollector-aps.herokuapp.com/api-list/')
    .then(res => res.json())
    .then(res => this.setState({'items': res}) );
  }
  render() {
    return (
           <div className="container">
              <div className="row">
                <div className="col-12 col-md-6 offset-md-3">
                  <ImageForm Items={this.getItems} />
                </div>
              </div>

              <div className="row mt-5">
                <h4 className="text-center heading alert col-sm-6 offset-sm-3">Our Image Gallery</h4>
                <hr />
                  {this.state.items.map(function(item, index){
                    return (
                          <ContentItem item={item} key={index} />
                    );
                   }
                  )}
              </div>
           </div>
    );
  }
}

class ImageForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      title: '',
      image: '',
      description: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.Items = this.Items.bind(this)
  }

  handleChange(e) {
    var target = e.target;
    var name = target.name;
    var value = target.value;

    this.setState({
      [name]: value
    });
  }
  Items(){
    this.props.Items()
  }
  handleSubmit(e) {
    e.preventDefault();
    var url = 'https://imagecollector-aps.herokuapp.com/api-create/'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state)
    })
    .then((res) => {
      console.log(this.state)
      this.Items()
      this.setState({
        name: '',
        title: '',
        image: '',
        description: '',
      })
    })
  }

  render(){
    return (
      <Card className="cardback">
        <CardTitle className="cardhead">
          <h3 className="text-center">Upload your Image here</h3>
        </CardTitle>
        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup row>
                <Label htmlFor="name" md={2}>Name</Label>
                <Col md={10}>
                  <Input onChange={this.handleChange} type="text" id="name" name="name" />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label htmlFor="title" md={2}>Title</Label>
                <Col md={10}>
                  <Input onChange={this.handleChange} type="text" id="title" name="title"/>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label htmlFor="image" md={2}>Choose Image</Label>
                <Col md={10}>
                  <Input onChange={this.handleChange} type="file" id="image" name="image" />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label htmlFor="description" md={2}>Description</Label>
                <Col md={10}>
                  <Input onChange={this.handleChange} type="textarea" id="description" name="description" />
                </Col>
            </FormGroup>
            <FormGroup row>
              <Col md={{size:10, offset:2}}>
                 <input type="submit" className="btn btn-primary" value="Upload Image" color="primary" />
              </Col>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

class ContentItem extends Component {
  constructor() {
    super();
    this.state = {
      'url' : []
    }
    this.getlink = this.getlink.bind(this)
  }
  componentDidMount() {
    this.getlink();
  }
  getlink(){
    var link = 'https://imagecollector-aps.herokuapp.com' + this.props.item.photo;
    this.setState({'url':link});
  }

  render() {
    return (
          <div className="col-md-6 col-lg-4 mt-3">
            <Card className="cardmar">
              <CardImg top width="100%" src={this.state.url} height="250px" alt={this.props.item.title} />
              <CardBody>
                <CardTitle>
                  <h5>{this.props.item.title}</h5>
                </CardTitle>
                <CardText>
                    {this.props.item.description}<br />
                    <b>Uploaded by : {this.props.item.name}</b><br />
                    {this.props.item.date}
                </CardText>
              </CardBody>
            </Card>
          </div>
    );
  }
}


ReactDOM.render(
  <ContentFeed />,
  document.getElementById('root')
);
