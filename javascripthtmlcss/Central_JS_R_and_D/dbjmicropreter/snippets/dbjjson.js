
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
          selector       : { statement : "id from category where name = 'ALFKI'" },
          descriptor     : { table : { name: 'category.dbo', columns : {} }},
          rezult         : { set : [ { id: 1 }, { id:2 } ] }
} }

DB.dbjson.rezult.set[0].id
/*
1
*/