/** @format */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginWithGoogle, registerUser } from "../../redux/actions/users";
import { useHistory } from "react-router";
import "./Register.scss";
import axios from "axios";
import { SERVER_URL } from "../../redux/actions/actionNames";

import Swal from "sweetalert2";
import GoogleLogin from "react-google-login";

const Register = () => {
  function validate(input) {
    const hasSpecialCharRegExName = new RegExp(/^[a-zA-Z\s]*$/g);
    const hasSpecialCharRegExLastname = new RegExp(/^[a-zA-Z\s]*$/g);
    const emailRegEx = new RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    let errors = {};
    if (!input.name) {
      errors.name = "El nombre es requerido!";
    }
    if (!hasSpecialCharRegExName.test(input.name)) {
      errors.name = "El nombre no puede tener números o caracteres especiales";
    }
    if (!input.lastName) {
      errors.lastName = "El apellido es requerido!";
    }
    if (!hasSpecialCharRegExLastname.test(input.lastName)) {
      errors.lastName =
        "El apellido no puede tener números o caracteres especiales";
    }
    if (!input.email) {
      errors.email = "El email es requerido!";
    }
    if (!emailRegEx.test(input.email)) {
      errors.email = "Se requiere un email valido";
    }
    if (emailsDb) {
      errors.email = (
        <p>
          Email ya ingresado en la base de datos, ¿Quieres{" "}
          <Link to={"/login"} className="underline">
            iniciar sesión?
          </Link>
        </p>
      );
    }
    if (!input.password) {
      errors.password = "La contraseña es requerida!";
    }
    if (!input.password) {
      errors.password = "La contraseña es requerida!";
    }
    if (!input.confirmPassword) {
      errors.confirmPassword = "La confirmación de la contraseña es requerida!";
    }
    if (input.password !== input.confirmPassword) {
      errors.password = "No coinciden las contraseñas!";
    }
    return errors;
  }

  const dispatch = useDispatch();
  const history = useHistory();

  const initialState = {
    email: "",
    password: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    confirmPassword: "",
    hasEstablishment: false,
    isAdmin: false,
  };
  const [userInfo, setUserInfo] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [emailsDb, setEmailsDb] = useState(null);

  useEffect(() => {
    if (userInfo.email) {
      axios
        .get(`${SERVER_URL}/users/checkedEmail`, {
          params: { email: userInfo.email },
        })
        .then((res) => {
          setEmailsDb(res.data);
        })
    }
  }, [userInfo.email]);

  const responseSuccess = (response) => {
    dispatch(loginWithGoogle(response));
    Swal.fire({
      title: `Sesión iniciada`,
    });
    history.push("/");
  };

  const responseFailure = (response) => {
    Swal.fire({
      title: `Hubo un error`,
    });
  };
  const handleChange = (e) => {
    e.preventDefault();
    setUserInfo((userInfo) => ({
      ...userInfo,
      [e.target.name]: e.target.value,
    }));

    setErrors(
      validate({
        ...userInfo,
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      errors.hasOwnProperty("name") ||
      errors.hasOwnProperty("lastName") ||
      errors.hasOwnProperty("email") ||
      errors.hasOwnProperty("password") ||
      errors.hasOwnProperty("confirmPassword")
    ) {
      Swal.fire({
        icon: "error",
        text: "Faltan completar campos obligatorios",
      });
    } else {
      dispatch(registerUser(userInfo));
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Registro exitoso",
        showConfirmButton: false,
        timer: 1500,
      });

      history.push("/login");
      setUserInfo(initialState);
    }
  };

  return (
    <div>
      <h1 className="flex justify-center text-xl text-indigo-800 dark:text-white">
        Registrate
      </h1>
      <br />
      <div className="">
        <div className="flex justify-center cursor-pointer">
          <div className="flex justify-center text-green-400 bg-slate-500 h-10 w-24 items-center rounded-md">
            <GoogleLogin
              clientId="325119971427-qq0udfk49hkpt0qrbbhfia9bbo6vjs8u.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={responseSuccess}
              onFailure={responseFailure}
              cookiePolicy={"single_host_origin"}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <form
            className="md:w-3/5 lg:w-2/5 flex-col justify-center items-center mx-5 border-grey-400 border-2 mt-10 bg-white drop-shadow-md backdrop-blur-3xl rounded-md px-3 py-3"
            onSubmit={handleSubmit}
          >
            <div className="relative ">
              <input
                className="w-full peer placeholder-transparent h-10   border-b-2 border-grey-300 focus:outline-none focus:border-indigo-600 bg-transparent"
                type="text"
                name="name"
                value={userInfo.name}
                placeholder="Escribe tu nombre"
                autoComplete="off"
                id="nombre"
                onChange={handleChange}
              ></input>
              <label
                className="absolute left-0 -top-3.5 
                                            text-gray-600 text-sm 
                                            peer-placeholder-shown:text-base 
                                            peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:top-2 transition-all 
                                            peer-focus:-top-3.5 peer-focus:text-gray-600
                                            peer-focus:text-sm
                                            cursor-text"
                htmlFor="nombre"
              >
                Nombre{" "}
              </label>
            </div>
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
            <div className="relative mt-3">
              <input
                className="w-full peer placeholder-transparent h-10   border-b-2 border-grey-300 focus:outline-none focus:border-indigo-600 bg-transparent"
                type="text"
                name="lastName"
                value={userInfo.lastName}
                placeholder="Escribe tu Apellido"
                autoComplete="off"
                id="apellido"
                onChange={handleChange}
              ></input>
              <label
                className="absolute left-0 -top-3.5 
                                            text-gray-600 text-sm 
                                            peer-placeholder-shown:text-base 
                                            peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:top-2 transition-all 
                                            peer-focus:-top-3.5 peer-focus:text-gray-600
                                            peer-focus:text-sm
                                            cursor-text"
                htmlFor="apellido"
              >
                Apellido{" "}
              </label>
            </div>
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName}</p>
            )}

            <div className="relative mt-3">
              <input
                className="w-full peer placeholder-transparent h-10   border-b-2 border-grey-300 focus:outline-none focus:border-indigo-600 bg-transparent"
                type="email"
                name="email"
                value={userInfo.email}
                placeholder="Escribe tu Email"
                autoComplete="off"
                id="mail"
                onChange={handleChange}
              ></input>
              <label
                className="absolute left-0 -top-3.5 
                                            text-gray-600 text-sm 
                                            peer-placeholder-shown:text-base 
                                            peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:top-2 transition-all 
                                            peer-focus:-top-3.5 peer-focus:text-gray-600
                                            peer-focus:text-sm
                                            cursor-text"
                htmlFor="mail"
              >
                Email{" "}
              </label>
            </div>
            {errors.email && (
              <h1 className="text-xs text-red-500">{errors.email}</h1>
            )}
            <div className="relative mt-3">
              <input
                className="w-full peer placeholder-transparent h-10   border-b-2 border-grey-300 focus:outline-none focus:border-indigo-600 bg-transparent"
                type="password"
                name="password"
                value={userInfo.password}
                placeholder="Escribe tu contraseña"
                autoComplete="off"
                id="pw"
                onChange={handleChange}
              ></input>
              <label
                className="absolute left-0 -top-3.5 
                                            text-gray-600 text-sm 
                                            peer-placeholder-shown:text-base 
                                            peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:top-2 transition-all 
                                            peer-focus:-top-3.5 peer-focus:text-gray-600
                                            peer-focus:text-sm
                                            cursor-text"
                htmlFor="pw"
              >
                Contraseña{" "}
              </label>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
            <div className="relative mt-3">
              <input
                className="w-full peer placeholder-transparent h-10   border-b-2 border-grey-300 focus:outline-none focus:border-indigo-600 bg-transparent"
                type="password"
                name="confirmPassword"
                value={userInfo.confirmPassword}
                placeholder="Confirma la contraseña"
                autoComplete="off"
                id="pw2"
                onChange={handleChange}
              ></input>
              <label
                className="absolute left-0 -top-3.5 
                                            text-gray-600 text-sm 
                                            peer-placeholder-shown:text-base 
                                            peer-placeholder-shown:text-gray-400
                                            peer-placeholder-shown:top-2 transition-all 
                                            peer-focus:-top-3.5 peer-focus:text-gray-600
                                            peer-focus:text-sm
                                            cursor-text"
                htmlFor="pw2"
              >
                Confirma la Contraseña{" "}
              </label>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}

            <div>
              <button
                className="mt-5 w-full bg-indigo-400 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Registrarse
              </button>
            </div>
            <div>
              <p className="mt-3 text-md text-indigo-600">
                ¿Ya estas registrado? <Link to="/login">Ingresa aquí</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
