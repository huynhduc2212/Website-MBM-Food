const express = require("express");
const {
 getAllTables,createTable,getByIdTable,updateTable,deleteTable,updateTableStatus
} = require("../controllers/tableController");


const router = express.Router();

router.get('/', getAllTables);

router.get('/:id', getByIdTable);

router.post('/', createTable);

router.put('/:id', updateTable);

router.put('/:id/status', updateTableStatus);

router.delete('/:id', deleteTable);

module.exports = router;
