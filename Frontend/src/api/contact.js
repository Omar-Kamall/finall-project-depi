import axios from "axios";

const Api = "https://jinstore-lac.vercel.app/api"

// send Data To Admin => email => (omarkamall.dev)
export const contact = async ({name , email , message}) => {
  try {
    const res = await axios.post(`${Api}/contact` , {name , email , message});
    return res.data;
  } catch (error) {
    throw new Error(error.res.message);
  }
}