import React, {useState} from 'react';
import Base from '../core/Base';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated, signin, authenticate } from '../auth/helper';
const Signin = () => {
    const [value, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        didRedirect: false,
    });
    const {email, password, error, loading, didRedirect} = value;
    const { user } = isAuthenticated();
    const valueChange = val => event => {
        setValues({...value, error: false, [val]: event.target.value});
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({...value, error:false, loading: true});
        signin({ email, password})
        .then(data =>{
            if (data.error) {
                setValues({...value, error: data.error, loading: false})
            } else {
                authenticate(data, () => {
                    setValues({...value, didRedirect: true})
                })
            }
        })
        .catch(console.log('error in signin'))
    }

    const performRedirect = () => {
        if (didRedirect) {
            if (user && user.role === 1) {
                return <p>redirect to admin</p>
            } else {
               return <p>redirect to user</p>
            }
        }
        if (isAuthenticated()) {
            return <Redirect to = '/'></Redirect>
        }
    }
    const signIn = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label className="text-light">Email</label>
                            <input onChange = {valueChange('email')} type="email" value = {email} className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label className="text-light">Password</label>
                            <input onChange = {valueChange('password')} type="password" value = {password} className="form-control"/>
                        </div>
                        <button onClick = {onSubmit} className="btn btn-success btn-block">Submit</button>
                    </form>
                </div>
                
            </div>
        )
    }

    return(
        <div>
            <Base title = "signin page" description = 'this page is for user to sign In'>
                {signIn()}
            </Base>
        </div>
    )
}

export default Signin