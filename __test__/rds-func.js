var AWS = require('aws-sdk');
const rdsFunc = require('../rds-func')

AWS.config.update({
  region: 'us-east-2'
})

var rds = new AWS.RDS();

test('get postgres snapshots', () => {

    const params = {
        DBClusterIdentifier: 'postgre-prod-cluster',
        SnapshotType: "automated",
        MaxRecords: 50
      }

    rds.describeDBClusterSnapshots(params, (err, data) => {

        if (err) {
          return err;
        }
    
        var snap = rdsFunc.getRdsSnapshots(data)
        expect(snap).not.toBe(null);
    });
    

});

test('get mysql snapshots', () => {

    const params = {
        DBClusterIdentifier: 'mysql-cluster-prod',
        SnapshotType: "automated",
        MaxRecords: 50
      }
    rds.describeDBClusterSnapshots(params, (err, data) => {

        if (err) {
          return err;
        }
    
        var snap = rdsFunc.getRdsSnapshots(data)
        expect(snap).not.toBe(null);
    });
    

});