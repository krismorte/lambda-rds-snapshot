'use strict';


var AWS = require('aws-sdk');
var cred = new AWS.Credentials("<KEY>", "<SECRET>",null);
var cred = new AWS.SharedIniFileCredentials({profile: 'pessoal'});

AWS.config.update({
  region: 'us-east-1',
  credentials: cred
})

const { RDSFunc } = require('../rds-func')
var rdsFunc = new RDSFunc(AWS)



test('get instances', async () => {

  var cluster = await rdsFunc.describeClusters();
  var instances = await rdsFunc.describeInstances();

  expect(cluster.length).toBe(0);
  expect(instances.length).toBe(1);

});

test('get snapshots', async () => {

  var instances = await rdsFunc.describeInstances();
  var snaps = await rdsFunc.describeInstanceAutomatedSnapshot(instances[0].DBInstanceIdentifier)
  expect(snaps.length>1).toBeTruthy();

});

// async function main(event) {

//     var cluster = await rdsFunc.describeClusters();
//     console.log(cluster)

//     cluster.forEach(async (cluster)=>{
//       var snaps = await rdsFunc.describeClustersAutomatedSnapshot(cluster.DBClusterIdentifier)
//       console.log(snaps)
//       snaps.forEach(async (snap)=>{
//         var copy = await rdsFunc.copyClusterSnapshot(snap.DBClusterSnapshotIdentifier)
//       console.log(copy)
//       await rdsFunc.deleteClusterSnapshot(copy);
//       })
      
//     })


//     var instances = await rdsFunc.describeInstances();
//     console.log(instances)
//     instances.forEach(async (instance)=>{
//       var snaps = await rdsFunc.describeInstanceAutomatedSnapshot(instance.DBInstanceIdentifier)
//       console.log(snaps)
//       snaps.forEach(async (snap)=>{
//         var copy = await rdsFunc.copyInstanceSnapshot(snap.DBSnapshotIdentifier)
//         console.log(copy)
//         await rdsFunc.deleteInstanceSnapshot(copy);
//       })
      
