const { app } = require('@azure/functions');
const { insertInCosmos, listenToChangeFeed } = require('../cosomsDBConnection');

app.eventHub('eventHubTrigger1', {
    connection: 'diaaeventtest_RootManageSharedAccessKey_EVENTHUB',
    eventHubName: 'createevent',
    cardinality: 'many',
    handler: (messages, context) => {
        console.log("the length of each event batch is = ", messages.length)
        if (Array.isArray(messages)) {
            context.log(`Event hub function processed ${messages.length} messages`);
            for (const message of messages) {
                context.log('Event hub message:', message);
            }

            const o = messages.reduce((acc, message) => {
                if(acc[message.id]){
                    acc[message.id] = {...acc[message.id], count: acc[message.id].count + 1}
                } else{
                    acc[message.id] = {...message, count: 1}
                }
                return acc
            }, {})
            console.log("messages", messages)
            console.log('====================================');
            console.log(o);
            console.log('====================================');
            insertInCosmos(o);
        } else {
            context.log('Event hub function processed message:', messages);
        }

        // listenToChangeFeed().catch((error) => {
        //   console.error("Error listening to Change Feed:", error);
        // });
    }
});

