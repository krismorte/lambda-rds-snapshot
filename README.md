# lambda-rds-snapshot #

This is a Backup/Disaster recovery strategy to work with AWS RDS instances

# How To Use

`git clone https://github.com/krismorte/lambda-rds-snapshot.git`

`cd lambda-rds-snapshot`

`npm install serverless -g`

`npm install`

* Deploy na AWS

Replace you aws local profile on this line on serverless.yml

`profile: <YOUR-AWS-PROFILE>`

right below you will see the `environment` tag replace all your configuration and you can deploy your first version

`sls deploy`

## RDS Snapshot Retention

AWS just keep automation shapshos for 35 days so to keep longer you need to create a new one or just copy an automation that will turn the result copy in manual, this last one is the stratey used here. But a manual snapshot is kept in the same region so if the region goes down? A second stratey is to copy some snapshots in other region. This project has 4 lambdas one to do backups daily and other to copy manual snapshot to another region the other 2 are to remove this snapshots in a certain date (couting in days).
AWS Info [link](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html)

`You can set the backup retention period to between 0 and 35 days.`

` You can have up to 100 manual snapshots per region.`

Aws also create a new solution called AWS BAckups thats pretty much do all this, was released in JAN/2020 and has some limitations to use as code.

## Serverless

THis project was builded with [Serverless](https://serverless.com/).