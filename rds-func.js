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


module.exports = {
  RDSFunc
}