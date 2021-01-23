import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import {useAppContext} from '../libs/contextLib';
import {onError} from '../libs/errorLib';
import {API} from 'aws-amplify';
import { LinkContainer } from 'react-router-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import './Home.css';

export default function Home() {
    const [notes, setNotes] = useState([]);
    const {isAuthenticated} = useAppContext();
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }
            try {
                const notes = await loadNotes();
                setNotes(notes);
            }
            catch(e) {
                onError(e);
            }
    
            setIsloading(false);
        }

        onLoad();        
    }, [isAuthenticated]);

    function loadNotes() {
        return API.get("notes", "/notes");
    }

    function renderNotesList(notes) {
        return (
            <>
                <LinkContainer to="/notes/new" >
                    <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                        <BsPencilSquare size={17} />
                        <span className="ml-2 font-weight-bold">Create a new note</span>
                    </ListGroup.Item>
                </LinkContainer>
                {notes.map(({ noteId, content, createAt }) => (
                    <LinkContainer key={noteId} to={`/notes/${noteId}`}>
                    <ListGroup.Item action>
                    <span>
                        {content.trim().split("\n")[0]}
                    </span>
                    <br />
                    <span>
                        Created: {new Date(createAt).toLocaleString()}
                    </span>
                    </ListGroup.Item>
                </LinkContainer>
                ))}
            </>
        );
    }

    function renderLander() {
        return (
            <div className="lander">
                <h1>Notes Taking</h1>
                <p className="text-muted" >Notes taking App</p>
            </div>
        );
    }

    function renderNotes() {
        return (
            <div>
                <h2>Your Notes</h2>
                <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
            </div>
        );
    }

    return (
        <div className="Home" >
            {isAuthenticated ? renderNotes() : renderLander()}
        </div>
    )
}