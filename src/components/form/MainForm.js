import React from 'react'
import Input from './Input'
import Button from './Button'
import axios from 'axios'
import qs from 'qs'
import md5 from 'md5'

function Form(props) {
    const status = props.status;

    const [regform, setRegform] = React.useState({
        name: "",
        email: "",
        password: "",
        confirm: ""
    });

    const [logform, setLogform] = React.useState({
        email: "",
        password: ""
    })
    const [register, setRegister] = React.useState(false)
    const [login, setLogin] = React.useState(false)

    function handleClick(event) {
        props.handleClick(event)
    }
    function redirect() {
        status === "Register" && props.setStatus("Login")
        status === "Login" && props.setStatus("Register")
    }
    function handleChange(event) {
        const name = event.target.name
        const value = event.target.value

        if (status === "Register") {
            setRegform(
                previous => {
                    switch (name) {
                        case "fullName": return { name: value, email: previous.email, password: previous.password, confirm: previous.confirm };
                        case "email": return { name: previous.name, email: value, password: previous.password, confirm: previous.confirm };
                        case "pass": return { name: previous.name, email: previous.email, password: value, confirm: previous.confirm };
                        case "cnfPass": return { name: previous.name, email: previous.email, password: previous.password, confirm: value };
                        default: return (null)
                    }

                }
            )
        } else if (status === "Login") {
            setLogform(
                previous => {
                    switch (name) {
                        case "emailLogin": return { email: value, password: previous.password };
                        case "passLogin": return { email: previous.email, password: value };
                        default: return (null)
                    }
                }
            )
        }
    }
    function hashPass(obj) {
        var pass = obj.password
        obj.password = md5(pass)
        if (obj.confirm) {
            var cnf = obj.confirm
            obj.confirm = md5(cnf)
        }
    }
    var rForm = regform;
    var lForm = logform;
    function handleSubmit() {
        if (status === "Register") {
            hashPass(rForm)
            setRegister(previous => !previous)
        } else if (status === "Login") {
            hashPass(lForm)
            setLogin(previous => !previous)
        }
    }
    function handleRedirect(status, value, auth) {
        props.setAuth(status, value, auth)
    }
  
    React.useEffect(() => {
        axios.post('http://thepc.herokuapp.com/api/users/signup', qs.stringify(rForm), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => {
                response.status === 200 && handleRedirect(true, response.data.userFound.name, response.data.token)

            })
            .catch(error => {
                console.log(error.response)
            });
    }, [register])

    React.useEffect(() => {
        axios.post('http://thepc.herokuapp.com/api/users/login', qs.stringify(lForm), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => {
                response.status === 200 && handleRedirect(true, response.data.userFound.name, response.data.token)
            })
            
    }, [login])

    return (
        <div className="col-sm-4 col-md-6 responsive">
            <h1 className="form-header">{status}</h1>
            {status === "Welcome" ?
                <div>
                    <Button classAdd={"btn-outline"} name="Register" handleClick={handleClick} />
                    <Button classAdd={"btn-solid"} name="Login" handleClick={handleClick} />
                </div>
                :
                status === "Register" ?
                    <div>
                        <Input type="input" name="fullName" placeholder="First name" onChange={handleChange} />
                        <Input type="input" name="email" placeholder="Email address" onChange={handleChange} />
                        <Input type="password" name="pass" placeholder="Password" onChange={handleChange} />
                        <Input type="password" name="cnfPass" placeholder="Confirm Password" onChange={handleChange} />
                        <Button classAdd={"btn-solid"} name={status} handleClick={handleSubmit} />
                        <p className="small" onClick={redirect}> Have an account? </p>
                    </div>
                    :
                    <div>
                        <Input type="input" name="emailLogin" placeholder="Email address" onChange={handleChange} />
                        <Input type="password" name="passLogin" placeholder="Password" onChange={handleChange} />
                        <Button classAdd={"btn-solid"} name={status} handleClick={handleSubmit} />
                        <p className="small" onClick={redirect}> Don't have an account? </p>
                    </div>
            }
        </div>

    )
}

export default Form