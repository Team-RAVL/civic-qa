import React, { useEffect, useState } from 'react';
import { Header } from '../Components/Header';
import { SubDashboard, SubDashboardData } from '../Components/SubDashboard';
import { SubHeaderLine } from '../Components/SubHeaderLine';
import { StatCardRow } from '../Components/StatCardRow';
import { Responses } from './Responses';
import * as Endpoints from '../Constants/Endpoints';

// currently using test data
function getInitialSubDashboardData(): Array<SubDashboardData> {
    var data = [];
    data.push({name: "Test", value: 123 + " inquiries"});
    return data as Array<SubDashboardData>;
}

export function General() {
    const testData = getInitialSubDashboardData();
    const [onSpecificView, setSpecificView] = useState(false);
    const [specificViewTitle, setSpecificViewTitle] = useState("");
    const [specificSubjectData, setSpecificSubjectData] = useState<SubDashboardData[]>([]);
    const [summaryToday, setSummaryToday] = useState(0);
    const [summaryWeek, setSummaryWeek] = useState(0);
    const [summaryTopics, setSummaryTopics] = useState(0);

    const getResponses = async() => {
        var authToken = localStorage.getItem("Authorization") || "";
        const response = await fetch(Endpoints.Testbase + Endpoints.Responses + "?" + Endpoints.ResponsesActiveGeneral, {
            method: "GET",
            headers: new Headers({
                "Authorization": authToken
            })
        });
        if (response.status >= 300) {
            console.log("Error retrieving form responses");
            return;
        }
        const responsesGeneral = await response.json();
        var formResponses: Array<SubDashboardData> = [];
        responsesGeneral.forEach(function(formResponse: any) {
            var d = new Date(formResponse.createdAt);
            var t = d.toLocaleString("en-US");
            formResponses.push({id: formResponse.id, name: formResponse.name + " / " + formResponse.subject, value: t, body: formResponse.body});
        });
        setSpecificSubjectData(formResponses);
    }

    const getResponsesToday = async() => {
        var authToken = localStorage.getItem("Authorization") || "";
        const response = await fetch(Endpoints.Testbase + Endpoints.Responses + "?" + Endpoints.ResponsesActiveGeneral + "&" + Endpoints.ResponsesTodayOnly, {
            method: "GET",
            headers: new Headers({
                "Authorization": authToken
            })
        });
        if (response.status >= 300) {
            console.log("Error retrieving form responses");
            return;
        }
        const responsesToday = await response.json();
        setSummaryToday(responsesToday.length);
    }

    function specificView(data: SubDashboardData) {
        setSpecificViewTitle(data.name);
        setSpecificView(true);
    }

    function initialView() {
        setSpecificView(false);
    }
    
    useEffect(() => {
        getResponses();
        getResponsesToday();
    }, []);

    let statCards = [
        {title: "New Today", stat: summaryToday},
        {title: "This Week", stat: summaryWeek},
        {title: "Topics", stat: summaryTopics}
    ];

    return (
        onSpecificView ? 
        <div> 
            <div className="dashboard sub-dashboard">
                <button className="exit-button" onClick={initialView}><img src="./assets/icons/back-arrow.png"></img></button>
            </div>
            <Responses header="General Inquiries" subjectTitle={specificViewTitle} data={specificSubjectData}></Responses>
        </div>
        : <div className="dashboard sub-dashboard">
            <div>
                <Header title="General Inquiries"></Header>
                <SubDashboard title="TOP SUBJECTS" data={testData} changeViewFunc={specificView} emailTemplates={false} fullPageView={false}></SubDashboard>
                <div className="sub-summary">
                    <SubHeaderLine title="SUMMARY"></SubHeaderLine>
                    <StatCardRow cards={statCards}></StatCardRow>
                </div>
            </div>
        </div>
    );
}