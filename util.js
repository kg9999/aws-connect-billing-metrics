const fs = require('fs');
const csv = require('csv');

const input = {
    fileName: 'ContactSearchResults.csv',
    contactDurationIndex: 8, // index of contact duration column
    minimumAmazonConnectMinutes: 60
};
const response = {
    inboundSecondsNotInMetrics: 0,
    inboundMinutesNotInMetrics: 0,
    code: 'Success', // Success/Error
    message: 'No error occured while processing the file contents'
}

const parser = csv.parse({ delimiter: ',', from_line: 2 /* ignore csv header */ });

function processRecord(ctr) {
    const ctrSeconds = durationToSeconds(ctr[input.contactDurationIndex]);
    // Add duration not in metrics as Connect billing charges a minimum of 60seconds
    if (ctrSeconds < input.minimumAmazonConnectMinutes) {
        response.inboundSecondsNotInMetrics += (input.minimumAmazonConnectMinutes - ctrSeconds);
    }
}

function durationToSeconds(duration = 60) {
 const splitDuration = duration.split(':'); //HH:MM:SS
 return (+splitDuration[0]) * 60 * 60 + (+splitDuration[1]) * 60 + (+splitDuration[2]);
}

const calculateMissingDuration = () => {
    return new Promise(resolve => {
        parser.on('error', (err) => {
            console.error(err);
            response.code = 'Error';
            response.message = `An error occured while processing file contents. Results might be corrupted: ${err.message}`;
        }).on('data', (row) => {
            processRecord(row);
        }).on('end', function () {
            const sec = response.inboundSecondsNotInMetrics;
            response.inboundMinutesNotInMetrics = Math.floor(response.inboundSecondsNotInMetrics / 60) + ":" + (response.inboundSecondsNotInMetrics % 60 ? response.inboundSecondsNotInMetrics % 60 : '00')
            return resolve(response);
        });
        fs.createReadStream(`${__dirname}/${input.fileName}`).pipe(parser);
    });
}

module.exports = {
    calculateMissingDuration
}




