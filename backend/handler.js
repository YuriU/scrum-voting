module.exports.connectHandler = async (event, context) => {
  
    console.log('Websocket connect')
    console.log(JSON.stringify(event));

    return {
      statusCode: 200,
    };
  };


module.exports.disconnectHandler = async (event, context) => {
  
    console.log('Websocket disconnect')
    console.log(JSON.stringify(event));

    return {
      statusCode: 200,
    };
  };


module.exports.defaultHandler = async (event, context) => {
  
    console.log('Websocket default action')
    console.log(JSON.stringify(event));

    return {
      statusCode: 200,
    };
  };
