import React, { Component } from "react";

class VotingResult extends Component {
    
    constructor(props) {
        super(props);

        console.log(JSON.stringify(props.results))
        let grouped = VotingResult.groupByResult(props.results);
        this.state ={
            groupedByResult : grouped
        };

        console.log(JSON.stringify(grouped))
    }

    render(){

        console.log(this.state)
        return (
            <div>
                <div>
                    <h1>Voting result</h1>
                    {
                        Array.from(this.state.groupedByResult).map((res, index) => {
                            return (
                            <div className="row" key={index}>
                                <div className="column" style={{width:"10%"}}></div>
                                <div className="column" style={{width:"20%"}}><h1>{res[0]}</h1></div>
                                <div className="column" style={{width:"50%"}}>
                                    {
                                        res[1].map((userId, i2) => {
                                            return (<span key={i2}><h1>{userId}</h1></span>)
                                        })
                                    }
                                </div>
                                <div className="column" style={{width:"10%"}}></div>
                            </div>)
                        })
                    }
                </div>
            </div>
        )
    }

    static groupByResult(userIdToResult) {

        const groupedByResult = new Map();

        for (let kvp of userIdToResult) {
            var userName = kvp[0];
            var result = kvp[1];

            if(!groupedByResult.has(result)){
                groupedByResult.set(result, []);
            }

            console.log(result);
            var resultValues = groupedByResult.get(result);
            resultValues.push(userName);
        }

        return groupedByResult;
    }
}

export default VotingResult;