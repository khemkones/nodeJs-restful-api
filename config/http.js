response = (res, statusCode, status, message, data, token) => {
  res.send({
    statusCode: statusCode,
    status: status,
    message: message,
    data: data,
    token: token,
  });
};

module.exports = {
  response,
};
