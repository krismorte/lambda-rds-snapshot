var AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.mainRegion
})

const { RDSFunc } = require('./rds-func')
const dateFunc = require('./date-func')
var rdsFunc = new RDSFunc(AWS)


module.exports.main = async (event) => {
  var daysBefore = process.env.daysBefore;
//RDS cluster
    var cluster = await rdsFunc.describeClusters();

    cluster.forEach(async (cluster)=>{
        var snaps = await rdsFunc.describeClustersAutomatedSnapshot(cluster.DBClusterIdentifier)
        if(snaps){
          snaps.forEach(async (snap)=>{
            var copyDate = dateFunc.minusDaysFromToday(daysBefore);
            var snapshotDate = dateFunc.removeTimeFromDate(snap.SnapshotCreateTime);
            if (copyDate == snapshotDate) {
                var copy = await rdsFunc.copyClusterSnapshot(snap.DBClusterSnapshotIdentifier)
                console.log(copy+" Rds cluster snapshot cloned")
            }
        })
        }        
    })

//RDS Instance
    var instances = await rdsFunc.describeInstances();
    instances.forEach(async (instance)=>{
      var snaps = await rdsFunc.describeInstanceAutomatedSnapshot(instance.DBInstanceIdentifier)
      if(snaps){
        snaps.forEach(async (snap)=>{
          var copyDate = dateFunc.minusDaysFromToday(daysBefore);
          var snapshotDate = dateFunc.removeTimeFromDate(snap.SnapshotCreateTime);
          if (copyDate == snapshotDate) {
              var copy = await rdsFunc.copyInstanceSnapshot(snap.DBSnapshotIdentifier)
              console.log(copy+" Rds instance snapshot cloned")
          }
        })
      }      
    })
  
    return { message: 'RDS Snapshots successfully cloned!', event };
  }