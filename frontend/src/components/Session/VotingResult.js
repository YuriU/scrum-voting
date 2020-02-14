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
                        this.props.results.values.map((res, index) => {
                            <div key={index}>res</div>
                        })
                    }
                </div>
            </div>
        )
    }
}

export default VotingResult;