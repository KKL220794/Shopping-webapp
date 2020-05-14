import React, {useState} from 'react';
import Base from '../core/Base';
import { Link } from 'react-router-dom';
import { signup } from '../auth/helper';
const Signup = () => {
    
    const [value, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    })

    const {name, email, password, error , success} = value;

    const onValueChanges = name => event => {
        setValues({...value, error: false, [name]: event.target.value})
    }
    const onSubmit = (event) => {
        event.preventDefault();
        setValues({...value, error:false});
        signup({name, email, password})
        .then(data =>{
            if (data.error) {
                setValues({...value, error: data.error, success: false})
            } else {
                setValues({...value, name: '', email: '', password: '', error: '', success: true})
            }
        })
        .catch(console.log('error in signup'))
    }

    const signupForm = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label className="text-light">Name</label>
                            <input onChange = {onValueChanges('name')} type="text" className="form-control" value = {name}/>
                        </div>
                        <div className="form-group">
                            <label className="text-light">Email</label>
                            <input onChange = {onValueChanges('email')} type="email" value = {email} className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label className="text-light">Password</label>
                            <input onChange = {onValueChanges('password')} value={password} type="password" className="form-control"/>
                        </div>
                        <button onClick = {onSubmit} className="btn btn-success btn-block">Submit</button>
                    </form>
                </div>
                
            </div>
        )
    }
    return(
        <div>
            <Base title = "signup page" description = 'this page is for user to sign up'>
                {signupForm()}
    <p className="text-white text-center">{JSON.stringify(value)}</p>
            </Base>
            
        </div>
    )
}

export default Signup