import React, { useState, useEffect } from "react";
import UploadForm from './components/form.js'

const Header = () => (
  <div style={{height: 46, borderBottom: '1px solid #e3e3e3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <input style={{padding: 4}} type='text' disabled placeholder='TextBox'/>
  </div>
)

const App = () => {
  
  return (
    <div>
      <Header/>
    </div>
  )
}

export default App;
