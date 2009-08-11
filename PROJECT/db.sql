CREATE TABLE `citybikes` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY(ID),
  `IPAddress` varchar(30) default NULL,
  `Timestamp` TIMESTAMP,
  `Address` varchar(100) default NULL,
  `Lat` varchar(30) default NULL,
  `Lng` varchar(30) default NULL
) 
