const orderService = require('../services/orderService');
const sseService = require('../services/sseService');
const whatsappService = require('../services/whatsappService');
const { successResponse } = require('../utils/response');

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const order = await orderService.createOrder(userId, req.body);
    const orderWithUser = await orderService.getOrderById(order.id);
    
    // Admin notification via SSE
    sseService.notifyAdmins({ type: 'NEW_ORDER', order: orderWithUser });

    // Send WhatsApp notification
    const userPhone = orderWithUser.user?.phone;
    if (userPhone) {
      whatsappService.sendWhatsAppMessage(
        userPhone, 
        `Halo! Order Printopia Anda dengan ID ${order.id} Sekarang dalam status pending dan sedang menunggu untuk di process.`
      );
    }

    return successResponse(res, 201, 'Order berhasil dibuat', order);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getOrdersByUser(userId);
    return successResponse(res, 200, 'Daftar order berhasil diambil', orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      const error = new Error('Tidak memiliki akses');
      error.statusCode = 403;
      throw error;
    }

    return successResponse(res, 200, 'Detail order berhasil diambil', order);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    return successResponse(res, 200, 'Semua order berhasil diambil', orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user.id;

    const order = await orderService.updateOrderStatus(id, status, adminId);
    
    // SSE Realtime Update to User
    sseService.notifyUser(order.userId, { type: 'ORDER_STATUS_UPDATE', order });

    // Send WhatsApp Notification if processing, completed or ready
    if (status === 'processing' || status === 'completed' || status === 'ready') {
      const userPhone = order.user?.phone;
      if (userPhone) {
        let waMessage = '';
        if (status === 'processing') {
          waMessage = `Halo! Order Printopia Anda dengan ID ${order.id} Sekarang sedang di prosess.`;
        } else if (status === 'ready') {
          if (order.pickupMethod === 'pickup') {
            waMessage = `Halo! Order Printopia Anda dengan ID ${order.id} Telah selesai dan siap di ambil dengan biaya Rp. ${order.totalPrice}`;
          } else {
            waMessage = `Halo! Order Printopia Anda dengan ID ${order.id} Telah selesai dan siap untuk di antar dengan biaya Rp. ${order.totalPrice}, mohon untuk berada di alamat.`;
          }
        } else if (status === 'completed') {
          waMessage = `Halo! Order Printopia Anda dengan ID ${order.id} telah diselesaikan. Terima kasih telah menggunakan Printopia!`;
        }

        if (waMessage) {
          whatsappService.sendWhatsAppMessage(userPhone, waMessage);
        }
      }
    }

    return successResponse(res, 200, 'Status order berhasil diupdate', order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
