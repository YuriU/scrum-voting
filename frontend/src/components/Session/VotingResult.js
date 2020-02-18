import React, { Component } from "react";

class VotingResult extends Component {
    
    constructor(props) {
        super(props);

        console.log(JSON.stringify(props.results))
    }

    render(){




        return (
            

            <div className="animationScreen">
                <div className="animationScreenContent">
                    <h1>Voting result</h1>
                    {
                        Array.from(this.props.results.entries()).map((res, index) => {
                                return (<div key={index}><h1>Result</h1></div>)
                        })
                    }
                </div>
            </div>
        )
    }
}

export default VotingResult;