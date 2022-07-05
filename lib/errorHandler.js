const errorHandler = (error, cb) => {
  if (error) {
    try {
      let errorsArray = JSON.parse(error.message).errors;
      errorsArray.forEach(error => {
        let type = Object.keys(error);
        let message = error[type];
        cb({ [type]: message });
      });
    } catch (err) {
      console.log(error);
    }
  }
};

export default errorHandler;
