module.exports = promisieToResolve =>
  new Promise((resolve) => {
    promisieToResolve
      .then((data) => {
        resolve({
          success: true,
          data,
        });
      })
      .catch((data) => {
        resolve({
          success: false,
          data,
        });
      });
  });
