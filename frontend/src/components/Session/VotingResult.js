import React, { Component } from "react";

class VotingResult extends Component {
    
    constructor(props) {
        super(props);

        console.log(JSON.stringify(props.results))
        let grouped = VotingResult.groupByResult(props.results);

        console.log(JSON.stringify(grouped))
    }

    render(){
        return (
            <div className="animationScreen">
                <div className="animationScreenContent">
                    <h1>Voting result</h1>
                    {
                        Array.from(this.props.results.entries()).map((res, index) => {
                        return (<div key={index}><h1>{res[0]} : {res[1]}</h1></div>)
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