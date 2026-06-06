let clients = [];

const addClient = (req, res, userId, role) => {
  const newClient = { userId, role, res };
  clients.push(newClient);

  req.on('close', () => {
    clients = clients.filter(c => c.res !== res);
  });
};

const removeClient = (res) => {
  clients = clients.filter(c => c.res !== res);
};

const notifyUser = (userId, data) => {
  clients.forEach(client => {
    if (client.userId === userId) {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  });
};

const notifyAdmins = (data) => {
  clients.forEach(client => {
    if (client.role === 'admin') {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  });
};

module.exports = {
  addClient,
  removeClient,
  notifyUser,
  notifyAdmins,
  clients
};
