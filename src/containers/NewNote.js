import Form  from "react-bootstrap/Form";
import React, {useState, useRef, createContext} from 'react';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import {useHistory} from 'react-router-dom';
import {onError} from '../libs/errorLib';
import './NewNote.css';
import {API} from 'aws-amplify';
import {s3Upload} from '../libs/awsLib';

export default function NewNote() {
    const [content, setContent] = useState("");
    const file = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    function validateForm() {
        return content.length > 0;
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Attachment should not larger than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }
        setIsLoading(true);
        try {
            const attachment = file.current ? await s3Upload(file.current) : null;

            await createNote({content, attachment});
            history.push("/");
        }
        catch(e){
            onError(e);
            setIsLoading(false);
        }
    }

    function createNote(note) {
        return API.post("notes", "/notes", {
            body: note
        });
    }


    return (
        <div>
            <Form onSubmit={handleSubmit} >
                <Form.Group controlId="content" >
                    <Form.Control value={content} as="textarea" onChange={(e)=> setContent(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="file" >
                    <Form.Label>Attachment</Form.Label>
                    <Form.Control onChange={handleFileChange} type="file" />
                </Form.Group>
                <LoaderButton block type="submit" size="lg" variant="primary" isLoading={isLoading} disabled={!validateForm()}>
                    Create
                </LoaderButton>
            </Form>
        </div>
    );
}

