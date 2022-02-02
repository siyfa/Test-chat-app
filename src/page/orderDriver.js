import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState, useRef, } from "react";

const OrderDriver = () => {
    const [delivery, setDelivery] = useState({})
    const socket = useRef(io.connect("https://localhost:8000"));
    const api = "https://localhost:8000/api";
    const driverId = "61b21986fb24d4630cde57f3";
    const userId = "61b9d556623081424535539c";
    const orderId2 = "61e546882144710e2a09f536";
    const orderId1 = "61e7d047e47494212506a9f1";
    const restId = "61a22579df47ac41b506f5d6";
    const deliveryId = "61e8343288ca8e094471fdd0";
    const driverToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWIyMTk4NmZiMjRkNDYzMGNkZTU3ZjMiLCJpYXQiOjE2NDI1OTI3MDN9.JVPFVtJTyqupLqw7NzD0YAj8fV-Mj8v9afx0sPMKU8g";

    useEffect(() => {
        socket.current.emit("addUser", driverId)
        socket.current.on("getUsers", (users) => {
            console.log("online users", users)
        })
    }, [userId])

    useEffect(() => {
        const fecthDelivery = async () => {
            let res = await axios.get(`${api}/delivery/${driverId}/${deliveryId}`, {
                headers: {
                    Authorization: `Bearer ${driverToken}`,
                },
            })
            setDelivery(res.data)
        }
        fecthDelivery()
    }, [])

    const updateOrder = async (id) => {
        const res = await axios.get(
            `${api}/delivery/update/pickedup/${driverId}/${deliveryId}/${id}/${restId}`,
            {
                headers: {
                    Authorization: `Bearer ${driverToken}`,
                },
            }
        );

        console.log(res.data);

        const resFetch = await axios.get(`${api}/order/${id}/${driverId}`, {
            headers: {
                Authorization: `Bearer ${driverToken}`,
            }
        })
        const user = resFetch.data[0].user._id
        const status = resFetch.data[0].deliveryStatus
        socket.current.emit("updateOrderTracker", {
            receiverId: user,
            status,
        });
        console.log('order --',status)
    };

    const reverseSimulation = async () => {
        await axios.get(`${api}/delivery/reverse/simulate/${driverId}/${deliveryId}`, {
            headers: {
                Authorization: `Bearer ${driverToken}`,
            },
        })
        window.location.reload();
    }

    return (
        <div>
            <h1>Delivery Screen for Driver</h1>
            <button onClick={reverseSimulation}>Reverse Delivery</button>
            <br /> <br /> <br /> <br />
            <div>
                <h2>Delivery --</h2>
                <ul>
                    <li>Driver name -  {delivery.driverName}</li>
                    <li>Driver ID -  {delivery.driverId}</li>
                    <li>Status  - <strong>{delivery.overallStatus}</strong></li>
                    <li>Package Counter - {delivery.packageCounter}</li>
                    {delivery.orders?.map((order) => (
                        <ol key={order.order}>
                            <h3>Order Details</h3>
                            <li>order ID - {order.order}</li>
                            <li>Order Status - <strong>{order.orderStatus}</strong></li>
                            <li>Order user - {order.user}</li>
                            <button onClick={()=>updateOrder(order.order)}>Update Order</button>
                            <hr />
                        </ol>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderDriver;
