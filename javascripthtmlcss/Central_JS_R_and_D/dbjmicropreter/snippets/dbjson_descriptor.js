
DBJSON = {
      dbjson : {
          selector       : {},
          descriptor     : {},
          declarator     : {},
          updater        : {},
          terminator     : {},
          transactor     : {},
          connector      : {},
          rezult         : {}
} }

DB = {
      dbjson : {
descriptor     : 
{ table : 
{ name: 'category.dbo', 
columns : 
[ 
{name: "id", type: "integer", fk: true }, 
{ name: "name", type: "varchar"}
]
 
}
}
} 
}

DB.dbjson.descriptor.table.columns[0].type