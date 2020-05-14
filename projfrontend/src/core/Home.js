import React, { Component } from "react"; 
import Base from "./Base";
class Home extends Component {
  render() {
    return (
     <Base title="my homepage" description = "testing homepage">
       <h1>Hello Frontend</h1>
     </Base>
    );
  }
}

export default Home;