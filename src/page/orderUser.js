import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

const OrderUser = () => {
  const [order, setOrder] = useState({});
  const [orderedUser, setOrderedUser] = useState({});
  const socket = useRef(io.connect("https://localhost:8000"));
  const api = "https://localhost:8000/api";
  const driverId = "61b21986fb24d4630cde57f3";
  const userId = "61b9d556623081424535539c";
  const orderId2 = "61e546882144710e2a09f536";
  const orderId1 = "61e7d047e47494212506a9f1";
  const restId = "61a22579df47ac41b506f5d6";
  const deliveryId = "61e8343288ca8e094471fdd0";
  const userToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWI5ZDU1NjYyMzA4MTQyNDUzNTUzOWMiLCJpYXQiOjE2NDI1OTkxNzl9.WLs3K8J2MTsQ-PBQbOiqj2WFI8I388LR9YFLXo0gt0M";

  useEffect(() => {
    socket.current.emit("addUser", userId)
    socket.current.on("getUsers", (users) => {
      console.log("online users", users)
    })
  }, [userId])

  // useEffect(() => {
  //   socket.current = io.connect("https://localhost:8000");
  //   socket.current.on("getMessage", (data) => {
  //     console.log("data", data);
  //   });
  // }, []);

  useEffect(() => {
    const getOrderHandler = async () => {
      const res = await axios.get(`${api}/order/${orderId1}/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setOrder(res.data[0]);
      setOrderedUser(res.data[0].user);
    };
    getOrderHandler();
  }, []);

  useEffect(() => {
    socket.current.on("getOrder", (data) => {
      console.log("data ---", data);
      const orderObj = {...order};
      orderObj.deliveryStatus = data.status;
      setOrder(orderObj)
      console.log(orderObj)
    });
  }, [order]);

  return (
    <div>
      <h1>Order Tracker Screen For User</h1>
      <div>
        <h2>Order Details --</h2>
        <ul>
          <li>createdAt: {order.createdAt}</li>
          <li>deliveryId: {order.deliveryId}</li>
          <li>FoodPrice: {order.foodPrice}</li>
          <li>DeliveryPrice: {order.deliveryPrice}</li>
          <li>ItemsDelivered: {order.itemsDelivered}</li>
          <li>Order ID: <strong>{order._id}</strong></li>
          <li>
            <h3>deliveryStatus: {order.deliveryStatus}</h3>
          </li>
          <ol>
            User Details ---
            <li>First Name -- {orderedUser.firstName}</li>
            <li>Last Name --- {orderedUser.lastName} </li>
            <li>ID --- {orderedUser._id}</li>
          </ol>
        </ul>
      </div>
      <br />
      <br /> <br /> <br />
    </div>
  );
};

export default OrderUser;
