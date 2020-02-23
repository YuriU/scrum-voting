import React, { Component } from "react";

class VotingResult extends Component {
    
    constructor(props) {
        super(props);

        console.log(JSON.stringify(props.results))
        let grouped = VotingResult.groupByResult(props.results);
        this.state ={
            groupedByResult : grouped
        };
    }

    render(){

        console.log(this.state)
        return (
            <div style={{width:"100%"}}>
                <div style={{width:"100%"}}>
                    <h1>Voting result</h1>
                    {
                        this.state.groupedByResult.map((res, index) => {
                            return (
                            <div className="row" style={{width:"100%"}} key={index}>
                                <div className="column" style={{width:"40%"}}><h1>{res[0]}</h1></div>
                                <div className="column" style={{width:"40%"}}>
                                    {

                                        res[1].map((userId, i2) => {
                                        return (<span key={i2}><h1 className="resultUsers">{i2 > 0 ? "," : ""}{userId}</h1></span>)
                                        })
                                    }
                                </div>
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

            var resultValues = groupedByResult.get(result);
            resultValues.push(userName);
        }

        const array = Array.from(groupedByResult);
        array.sort((first, second) => {

            if(second[0] == 'N/A'){
                return 1;
            }
            else {
                return first[1].length - second[1].length
            }
        })

        return array;
    }
}

export default VotingResult;