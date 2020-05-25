var AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.mainRegion
})


const { RDSFunc } = require('./rds-func')
const dateFunc = require('./date-func')
var rdsFunc = new RDSFunc(AWS)


module.exports.main = async (event) => {  
  
  var daysBefore = process.env.keepDays;
//RDS cluster
    var cluster = await rdsFunc.describeClusters();
    
    for (i=0;i<cluster.length;i++){
      AWS.config.update({
        region: process.env.copyRegion
      })
      var rdsFuncOtherRegion = new RDSFunc(AWS)
        var snaps = await rdsFuncOtherRegion.describeClustersManualSnapshot(cluster[i].DBClusterIdentifier)
        if(snaps){
          snaps.forEach(async (snap)=>{
            
              var copyDate = dateFunc.minusDaysFromToday(daysBefore);
              var snapshotDate = dateFunc.removeTimeFromDate(snap.SnapshotCreateTime);
              if (copyDate == snapshotDate) {
                  var copy = await rdsFuncOtherRegion.deleteClusterSnapshot(snap.DBClusterSnapshotIdentifier)
                console.log(copy+" Rds cluster snapshot deleted")
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
      AWS.config.update({
        region: process.env.copyRegion
      })
      var rdsFuncOtherRegion = new RDSFunc(AWS)
      var snaps = await rdsFuncOtherRegion.describeInstanceManualSnapshot(instances[i].DBInstanceIdentifier)
      if(snaps){
        snaps.forEach(async (snap)=>{
          
          var copyDate = dateFunc.minusDaysFromToday(daysBefore);
          var snapshotDate = dateFunc.removeTimeFromDate(snap.SnapshotCreateTime);
          if (copyDate == snapshotDate) {
              var copy = await rdsFuncOtherRegion.deleteInstanceSnapshot(snap.DBSnapshotIdentifier)
              console.log(copy+" Rds instance snapshot deleted")
          }
        })
      }      
    }
  
    return { message: 'RDS Snapshots successfully cloned!', event };
  }
