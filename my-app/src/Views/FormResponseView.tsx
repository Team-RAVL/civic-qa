import { useState } from 'react';
import { Header } from '../Components/Header';
import { SubHeaderLine } from '../Components/SubHeaderLine';
import { Tag } from '../Components/Tag';
import { TagAdd } from '../Components/TagAdd';
import * as Endpoints from '../Constants/Endpoints';
import "./FormResponseView.css";

export type FormResponseViewProps = {
    responseId: string;
    title: string;
    subject: string;
    body: string;
    setSpecificView: Function;
};

export function FormResponseView(props: FormResponseViewProps) {
    const [isResolved, setIsResolved] = useState(true);
    const [mailto, setMailto] = useState("mailto:");
    const [messageResponse, setMessageResponse] = useState("");

    const getTags = async(id: string) => {
        var authToken = localStorage.getItem("Authorization") || "";
        const response = await fetch(Endpoints.Testbase + Endpoints.Responses + "/" + id + Endpoints.ResponsesTags, {
            method: "GET",
            headers: new Headers({
                "Authorization": authToken
            })
        });
        if (response.status >= 300) {
            console.log("Error retreiving response tags");
            return;
        }
        const tags = await response.json();
        
    }

    async function removeTag(responseId: string) {
        var authToken = localStorage.getItem("Authorization") || "";
        const response = await fetch(Endpoints.Testbase + Endpoints.Responses + "/" + responseId + Endpoints.ResponsesTags, {

        });
    }

    async function addTag(responseId: string) {
        var authToken = localStorage.getItem("Authorization") || "";
        const response = await fetch(Endpoints.Testbase + Endpoints.Responses + "/" + responseId + Endpoints.ResponsesTags, {

        });
    }

    const resolveResponse = async(id: string, isResolved: boolean) => {
        var authToken = localStorage.getItem("Authorization") || "";
        var patchActive = JSON.stringify({active: !isResolved});
        const response = await fetch(Endpoints.Testbase + Endpoints.Responses + "/" + id, {
            method: "PATCH",
            body: patchActive,
            headers: new Headers({
                "Authorization": authToken
            })
        });
        if (response.status >= 300) {
            console.log("Error marking form response as resolved");
            return;
        }
    }

    async function clickCheckbox() {
        setIsResolved(isResolved => !isResolved);
        resolveResponse(props.responseId, isResolved);
    }

    return(
        <div>
            <button className="exit-button" onClick={() => props.setSpecificView()}><img src="./assets/icons/back-arrow.png"></img></button>
            <Header title={props.title}></Header>
            <SubHeaderLine title={props.subject}></SubHeaderLine>
            <div className="tags-container">
                    <Tag tagId={"1"} name="COVID"></Tag>
                    <Tag tagId={"2"} name="stimulus"></Tag>
                    <Tag tagId={"3"} name="taxes"></Tag>
                    <TagAdd></TagAdd>
            </div>
            <div className="form-response-container">
                <div className="form-response">
                    <p className="form-response-body">{props.body}</p>
                    <textarea className="form-response-message"></textarea>
                    <div className="resolved-send-container">
                        <label className="resolved-label" >
                            <input id="resolved-check-box" className="resolved-check-box" type="checkbox" onClick={() => clickCheckbox()}></input>
                            Resolved
                        </label>
                        <a className="send-btn mailto-link" href={mailto}><button className="send-btn" placeholder="Message">Send</button></a>
                    </div>
                </div>
            </div>
        </div>
    );
}