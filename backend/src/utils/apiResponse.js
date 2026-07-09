function successResponse(res, message, data = null, count = null) {
  const response = {
    success: true,
    message
  };

  if (count !== null) {
    response.count = count;
  }

  if (data !== null) {
    response.data = data;
  }

  return res.status(200).json(response);
}

function errorResponse(res, statusCode, message) {
  return res.status(statusCode).json({
    success: false,
    message
  });
}

module.exports = {
  successResponse,
  errorResponse
};
