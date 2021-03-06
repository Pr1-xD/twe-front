import React from 'react'
import Input from '../form/Input'
import Button from '../form/Button'
import axios from 'axios'
import qs from 'qs'
import Cookie from 'js-cookie'

function NewEdition() {
    const finalEdition = {
        enumber: "",
        enname: "",
    }
    const [editionTitle, setTitle] = React.useState();
    const [editionNumber, setNumber] = React.useState();
    const [ready, setReady] = React.useState(false);


    function handleChange(event) {
        const title = event.target.name;
        const value = event.target.value;
        title === "title" ? setTitle(value) : setNumber(value);

    }

    finalEdition.ename = editionTitle;
    finalEdition.enumber = editionNumber;

    function handleClick() {
        console.log(finalEdition);
        setReady(previous => !previous)
    }

    React.useEffect(() => {
        axios.post('http://thepc.herokuapp.com/api/edition/create/', qs.stringify(finalEdition), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + Cookie.get("auth")
            }
        })
            .then(response => {
                console.log(response)
                Cookie.set("enum", finalEdition.enumber)

            })
            .catch(error => {
                console.log(error.response)
            });
    }, [ready])


    return (
        <div>
            <Input type="text-area" name="title" placeholder="Title" rows="1" onChange={handleChange} />
            <Input type="text-area" name="edno" placeholder="Edition Number" rows="1" onChange={handleChange} />
            <Button classAdd={"btn-solid"} name={"Submit"} handleClick={handleClick} />

        </div>


    )

}

export default NewEdition