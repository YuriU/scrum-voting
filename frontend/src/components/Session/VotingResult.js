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
                        return (<div key={index}><h1>{res[0]} : {res[1].map((userId, index) => {
                            return (<div>{userId}</div>)
                        })}</h1></div>)
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