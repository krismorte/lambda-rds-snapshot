var AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.mainRegion

})

const { RDSFunc } = require('./rds-func')
const dateFunc = require('./date-func')
var rdsFunc = new RDSFunc(AWS)


module.exports.main = async (event) => {

  var daysBefore = process.env.keepLongDays;;
//RDS cluster
    var cluster = await rdsFunc.describeClusters();

    cluster.forEach(async (cluster)=>{
        var snaps = await rdsFunc.describeClustersManualSnapshot(cluster.DBClusterIdentifier)
        
        if(snaps){
          snaps.forEach(async (snap)=>{
            var copyDate = dateFunc.minusDaysFromToday(daysBefore);
            var snapshotDate = dateFunc.removeTimeFromDate(snap.SnapshotCreateTime);
            if (copyDate == snapshotDate) {
                var copy = await rdsFunc.deleteClusterSnapshot(snap.DBClusterSnapshotIdentifier)
                console.log(copy+" Rds cluster snapshot deleted")
            }
        })
        }        
    })

//RDS Instance
    var instances = await rdsFunc.describeInstances();
    instances.forEach(async (instance)=>{
      var snaps = await rdsFunc.describeInstanceManualSnapshot(instance.DBInstanceIdentifier)
      
      if(snaps){
        snaps.forEach(async (snap)=>{
          var copyDate = dateFunc.minusDaysFromToday(daysBefore);
          var snapshotDate = dateFunc.removeTimeFromDate(snap.SnapshotCreateTime);
          if (copyDate == snapshotDate) {
              var copy = await rdsFunc.deleteInstanceSnapshot(snap.DBSnapshotIdentifier)
              console.log(copy+" Rds instance snapshot deleted")
          }
        })
      }      
    })
  
    return { message: 'RDS Snapshots successfully cloned!', event };
  }