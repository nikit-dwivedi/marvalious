const axios = require("axios").default;
const res = require("express/lib/response");
require("dotenv").config();
const authorization = process.env.AUTHORIZATION;
const apiKey = process.env.APIKEY;
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;
const textlocalapi = process.env.TEXTLOCALAPI;

let encodedData = Buffer.from(clientId + ":" + clientSecret).toString("base64");
let authorizationHeaderString = "Basic " + encodedData;

{
  "code", "status", "message", "data";
}
async function axiosResponse(response) {
  if (response.status == 200) {
    return response.data;
  } else {
    return false;
  }
}
module.exports = {
  post: async (endpoint, dataa) => {
    let config = {
      method: "post",
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic QUlLU0w0VDZNSkpBSDMyNjY0RkNOR1NUMTZGSkVWSUQ6NjdEUEk4SzJIMU1MQU1KNUhPWjc4UlVVQ1FCSEg2QkI=",
      },
      data: { id_no: dataa },
    };
    return axios(config)
      .then(function (response) {
        return axiosResponse(response);
      })
      .catch(function (error) {
        // console.log(error)
        return axiosResponse(error);
      });
  },
  get: async (endpoint) => {
    let config = {
      method: "get",
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "1.0",
        "x-api-key": apiKey,
        Authorization: authorization,
      },
    };
    return axios(config)
      .then(function (response) {
        return axiosResponse(response);
      })
      .catch(function (error) {
        return axiosResponse(error);
      });
  },
  textLocalSms: async (number, otp) => {
    let config = {
      method: "get",
      url:
        `https://api.textlocal.in/send/?apikey=${textlocalapi}=&numbers=${number}&sender=FABLOP&message=` +
        encodeURIComponent(
          `Greetings from Fablo, ${otp} is your verification code to login into Fablo Platforms.`
        ),
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "1.0",
        "x-api-key": apiKey,
        Authorization: authorization,
      },
    };
    return axios(config)
      .then(function (response) {
        return axiosResponse(response);
      })
      .catch(function (error) {
        return axiosResponse(error);
      });
  },
};
