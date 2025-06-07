const express = require("express");
const {
 getAllTables,createTable,getByIdTable,updateTable,deleteTable,updateTableStatus
} = require("../controllers/tableController");

const upload = require("../middleware/uploadImage");
const router = express.Router();

router.get('/', getAllTables);

router.get('/:id', getByIdTable);

router.post('/',upload.single("image"), createTable);

router.put('/:id',upload.single("image"), updateTable);

router.put('/:id/status', updateTableStatus);

router.delete('/:id', deleteTable);

module.exports = router;
