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

    for (i=0;i<cluster.length;i++){
        var snaps = await rdsFunc.describeClustersAutomatedSnapshot(cluster[i].DBClusterIdentifier)
        if(snaps){
          snaps.forEach(async (snap)=>{
            AWS.config.update({
              region: process.env.copyRegion
            })
            var rdsFuncOtherRegion = new RDSFunc(AWS)
              var copyDate = dateFunc.minusDaysFromToday(daysBefore);
              var snapshotDate = dateFunc.removeTimeFromDate(snap.SnapshotCreateTime);
              if (copyDate == snapshotDate) {
                  var copy = await rdsFuncOtherRegion.copyClusterSnapshot(snap.DBClusterSnapshotArn,process.env.mainRegion)
                  console.log(copy+" Rds cluster snapshot cloned")
              }
          })
        }        
    }
    AWS.config.update({
      region: process.env.mainRegion
    })

//RDS Instance
    var instances = await rdsFunc.describeInstances();
    for (i=0;i<instances.length;i++){
      var snaps = await rdsFunc.describeInstanceAutomatedSnapshot(instances[i].DBInstanceIdentifier)
      if(snaps){
        snaps.forEach(async (snap)=>{
          AWS.config.update({
            region: process.env.copyRegion
          })
          var rdsFuncOtherRegion = new RDSFunc(AWS)
          var copyDate = dateFunc.minusDaysFromToday(daysBefore);
          var snapshotDate = dateFunc.removeTimeFromDate(snap.SnapshotCreateTime);
          if (copyDate == snapshotDate) {
              var copy = await rdsFuncOtherRegion.copyInstanceSnapshot(snap.DBSnapshotArn,process.env.mainRegion)
              console.log(copy+" Rds instance snapshot cloned")
          }
        })
      }      
    }
  
    return { message: 'RDS Snapshots successfully cloned!', event };
  }
