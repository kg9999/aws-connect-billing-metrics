const fs = require('fs');
const csv = require('csv');

const input = {
    fileName: 'ContactSearchResults.csv',
    contactDurationIndex: 8, // index of contact duration column
    contactinitiationMethodIndex: 9, // contact initiation method
    contactinitiationMethod: 'Inbound',
    minimumAmazonConnectSec: 60 // Connect charges a minimum of 60 sec
};
const response = {
    inboundSecondsNotInMetrics: 0, // total in sec
    inboundMinutesNotInMetrics: 0, // total in min
    code: 'Success', // Success/Error
    message: 'No error occured while processing the file contents'
}

const parser = csv.parse({ delimiter: ',', from_line: 2 /* ignore csv header */ });

function processRecord(ctr) {
    //Modify and filter as you wish i.e outbound. 
    if (ctr[input.contactinitiationMethodIndex] === input.contactinitiationMethod) {
        const ctrSeconds = durationToSeconds(ctr[input.contactDurationIndex]);
        // Add duration not in metrics as Connect billing charges a minimum of 60seconds
        if (ctrSeconds < input.minimumAmazonConnectSec) {
            response.inboundSecondsNotInMetrics += (input.minimumAmazonConnectSec - ctrSeconds);
        }
    }
}

function durationToSeconds(duration = '00:00:00') {
 const splitDuration = duration.split(':'); //HH:MM:SS
 return (+splitDuration[0]) * 60 * 60 + (+splitDuration[1]) * 60 + (+splitDuration[2]);
}

const calculateMissingDuration = () => {
    return new Promise(resolve => {
        parser.on('error', (err) => {
            console.error(err);
            response.code = 'Error';
            response.message = `An error occured while processing file contents. Results might be corrupted: ${err.message}`;
        }).on('data', (ctrRecord) => {
            processRecord(ctrRecord);
        }).on('end', function () {
            response.inboundMinutesNotInMetrics = Math.floor(response.inboundSecondsNotInMetrics / 60) + ":" + (response.inboundSecondsNotInMetrics % 60 ? response.inboundSecondsNotInMetrics % 60 : '00')
            return resolve(response);
        });
        fs.createReadStream(`${__dirname}/${input.fileName}`).pipe(parser);
    });
}

module.exports = {
    calculateMissingDuration
}




