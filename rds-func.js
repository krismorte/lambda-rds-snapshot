const defaultTag = {
    Key: 'ClonedBy',
    Value: 'Lambda'
  }
const regionTag = { Key: 'SourceRegion',Value: ''}

class RDSFunc{
  constructor(AWS) {
    this.rds = new AWS.RDS();
  }

  describeClusters(){
    var clusters = this.rds.describeDBClusters({}).promise()
    .then((data)=>{
      return data.DBClusters;           // successful response
    })    
    return clusters;
  }

  describeInstances(){
    var instances = this.rds.describeDBInstances({}).promise()
    .then((data)=>{
      return data.DBInstances
    })
    return instances;
  }

  describeClustersAutomatedSnapshot(cluster){

    const params = {
      DBClusterIdentifier: cluster,
      SnapshotType: "automated",
      MaxRecords: 50
    }

    var snaps = this.rds.describeDBClusterSnapshots(params).promise()
    .then((data)=>{
      return data.DBClusterSnapshots;           // successful response
    })    
    return snaps;
  }

  describeClustersManualSnapshot(cluster){

    const params = {
      DBClusterIdentifier: cluster,
      SnapshotType: "manual",
      MaxRecords: 50
    }

    var snaps = this.rds.describeDBClusterSnapshots(params).promise()
    .then((data)=>{
      return data.DBClusterSnapshots;           // successful response
    })    
    return snaps;
  }

  describeInstanceAutomatedSnapshot(instance){

    const params = {
      DBInstanceIdentifier: instance,
      SnapshotType: "automated",
      MaxRecords: 50
    }

    var snaps = this.rds.describeDBSnapshots(params).promise()
    .then((data)=>{
      return data.DBSnapshots;           // successful response
    })    
    return snaps;
  }

  describeInstanceManualSnapshot(instance){

    const params = {
      DBInstanceIdentifier: instance,
      SnapshotType: "manual",
      MaxRecords: 50
    }

    var snaps = this.rds.describeDBSnapshots(params).promise()
    .then((data)=>{
      return data.DBSnapshots;           // successful response
    })    
    return snaps;
  }

  copyClusterSnapshot(snap,region){
    
    var paramClone = {
      SourceDBClusterSnapshotIdentifier: snap,
      TargetDBClusterSnapshotIdentifier: this.renameSnapshot(snap),
      Tags: [
        defaultTag,
      ]
    };
    if(region){
      paramClone.SourceRegion=region
      regionTag.Value = region
      paramClone.Tags.push(regionTag)
    }

    var newSnapName = this.rds.copyDBClusterSnapshot(paramClone).promise()
    .then((data)=>{
      return paramClone.TargetDBClusterSnapshotIdentifier
    });
    return newSnapName
  }

  copyInstanceSnapshot(snap,region){
    
    var paramClone = {
      SourceDBSnapshotIdentifier: snap,
      TargetDBSnapshotIdentifier: this.renameSnapshot(snap),
      Tags: [
        defaultTag,
      ]
    };
    if(region){
      paramClone.SourceRegion=region
      regionTag.Value = region
      paramClone.Tags.push(regionTag)
    }
    console.log(paramClone)

    var newSnapName = this.rds.copyDBSnapshot(paramClone).promise()
    .then((data)=>{
      return paramClone.TargetDBSnapshotIdentifier
    });
    return newSnapName
  }

  deleteClusterSnapshot(snap){
    this.rds.deleteDBClusterSnapshot({DBClusterSnapshotIdentifier:snap}).promise()
    .then((data)=>{
    });
  }

  deleteInstanceSnapshot(snap){
    this.rds.deleteDBSnapshot({DBSnapshotIdentifier:snap}).promise()
    .then((data)=>{
    });
  }

  renameSnapshot(snapName){
    if(snapName.includes('arn:')){
      var i = snapName.indexOf("snapshot:rds");
      var tmpName = snapName.substring(i, snapName.length)
      return tmpName.replace('snapshot:','').replace("rds:", "manual-");
    }else{
      return snapName.replace("rds:", "manual-")
    }
  }

}


// var cred = new AWS.Credentials("AKIATQI2KOSVANINUSPV", "4LvEEdtxmciD7TWl9Szikqu/2oIVlkgM5LFjY9xr",null);
  
//   AWS.config.update({
//     region: 'us-east-1',
//     credentials: cred
//   })

//   var rds = new AWS.RDS();





// function describeSnapshots(instance){
  


//   const params = getSearhParams(instance);

// }

// function getRdsSnapshots(data){

//     var copyDate = dateFunc.minusDaysFromToday(10);

//    // var snap = data.DBClusterSnapshots.find((snapshot) => {
//     var snap = data.DBSnapshots.find((snapshot) => {
//         var snapshotDate = dateFunc.removeTimeFromDate(snapshot.SnapshotCreateTime);
  
//         //if (copyDate == snapshotDate) {
//           console.log(snapshot.DBSnapshotIdentifier  )
//           return snapshot.DBClusterSnapshotIdentifier  
//         //}
//       })

//       return snap;
// }

// function getSearhParams(instance){
//   if(instance.cluster){
//     return {
//       DBClusterIdentifier: instance.name,
//         SnapshotType: "automated",
//         MaxRecords: 50
//       }
//   }else{
//     return {
//       DBInstanceIdentifier: instance.name,
//         SnapshotType: "automated",
//         MaxRecords: 50
//       }
//   }  
// }

module.exports = {
  RDSFunc
}