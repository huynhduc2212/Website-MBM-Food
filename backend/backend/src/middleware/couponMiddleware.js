
const updatedStatus = function (next) {
  const currentDate = new Date();
  
  // Kiểm tra ngày hết hạn
  if (currentDate > this.end_date && this.status === "Active") {
    this.status = "Expired";
  }

  // Kiểm tra số lượng
  if (this.quantity <= 0 && this.status === "Active") {
    this.status = "Used_up";
  }
  
  next();
};

const typeUpdate = function (next) {
  const update = this.getUpdate();
  const currentDate = new Date();

  // Kiểm tra nếu `end_date` bị cập nhật hoặc đã hết hạn
  if (update.end_date !== undefined || this._conditions.end_date !== undefined) {
    const endDate = update.end_date || this._conditions.end_date;
    
    if (new Date(endDate) < currentDate) {
      update.status = "Expired";
    }
  }

  // Kiểm tra nếu quantity <= 0
  if (update.quantity !== undefined && update.quantity <= 0) {
    if (!update.status || update.status === "Active") {
      update.status = "Used_up";
    }
  }

  next();
};


module.exports = { 
  updatedStatus, 
  typeUpdate, 
};