const Validator = require('joi');

const customValidationTypes = {
  mongoDbId: (() => {
    return Validator.string().alphanum().length(24);
  })(),
};

module.exports = {
  validator(type) {
    if (type) {
      if (customValidationTypes[type]) {
        return customValidationTypes[type];
      }
      throw new TypeError(`Provided validation type ${type} is not valid`);
    }
    return Validator;
  },

  createValidationSchema(data) {
    return Validator.object().keys(data);
  },

  validateIncomingRequest(request, validationSchema) {
    const requestBody = request.body || {};
    const requestQuery = request.query || {};
    const requestParams = request.params || {};

    const output = { success: true, error: null };

    const dataSource = Object.assign(requestBody, requestQuery, requestParams);
    const { error } = Validator.validate(dataSource, validationSchema, { abortEarly: false });

    if (!error) {
      return output;
    }

    output.error = mapValidationError(error);
    output.success = false;

    return output;
  },
};


const mapValidationError = (errorObject) => {
  return errorObject.details.map((singleError) => {
    return {
      message: singleError.message,
      path: singleError.path,
    };
  });
};