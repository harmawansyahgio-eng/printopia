const prisma = require('../config/database');
const { calculatePrice } = require('../utils/pricing');

const createOrder = async (userId, data) => {
  const {
    fileName,
    fileUrl,
    pageCount,
    printType,
    paperSize,
    copies,
    pickupMethod,
    deliveryAddress
  } = data;

  const { getSettings } = require('../utils/settings');
  
  const documentPrice = calculatePrice(pageCount, printType, paperSize, copies);
  let totalPrice = documentPrice;
  
  const settings = getSettings();
  if (pickupMethod === 'delivery') {
    totalPrice += settings.delivery.delivery.price; // Dynamic delivery fee
  }

  const order = await prisma.order.create({
    data: {
      userId,
      fileName,
      fileUrl,
      pageCount: parseInt(pageCount),
      printType,
      paperSize,
      copies: parseInt(copies),
      pickupMethod,
      deliveryAddress: pickupMethod === 'delivery' ? deliveryAddress : null,
      totalPrice
    }
  });

  // Log status change
  await prisma.orderStatusLog.create({
    data: {
      orderId: order.id,
      fromStatus: 'none',
      toStatus: 'pending',
      changedBy: 'system'
    }
  });

  return order;
};

const getOrdersByUser = async (userId) => {
  return await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

const getOrderById = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { statusLogs: true, user: true }
  });

  if (!order) {
    const error = new Error('Order tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return order;
};

const updateOrderStatus = async (orderId, newStatus, adminId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { user: true } });
  if (!order) {
    const error = new Error('Order tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const oldStatus = order.status;

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
    include: { user: true }
  });

  await prisma.orderStatusLog.create({
    data: {
      orderId: order.id,
      fromStatus: oldStatus,
      toStatus: newStatus,
      changedBy: adminId
    }
  });

  return updatedOrder;
};

const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: { user: { select: { name: true, email: true, phone: true } } },
    orderBy: { createdAt: 'desc' }
  });
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  getAllOrders
};
