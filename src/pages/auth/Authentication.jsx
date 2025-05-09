import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa";
import {axiosConf} from "../../services/api";
import {useAuthStore} from "../../stores/useAuthStore.js";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast.jsx";

const LoginSchema = z.object({
  email: z
    .string()
    .min(2, { message: "Non d'utilisater ou adresse e-mail invalide" }),
  password: z.string().min(4, { message: "Le mot de passe est incorrecte" }),
});

export default function Authentication() {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setToken = useAuthStore((state) => state.setToken);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const {
    register: loginRegister,
    handleSubmit: loginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosConf.post("/sign-in", {
        email: data.email,
        password: data.password,
      });
      if (response?.status >= 200 && response.status < 300 && response.data) {
        setIsAuthenticated(true);
        await setToken(response.data?.token || null);
        if (token) {
          showSuccess("Connexion réussie ! Bienvenue.");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Échec de la connexion :", error);
      showError(
        "Une erreur est survenue lors de la connexion. Veuillez réessayer."
      );
    }
    setIsLoading(false);
    resetLogin();
  };


  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="overflow-hidden LoginbgImg h-screen w-screen">
      <div className="bg-black/80 h-screen flex flex-col justify-center items-center p-4 md:p-8 lg:p-16">
        <div className="w-full max-w-md p-5 bg-gradient-to-l from-black/85 to-gray-300/20 rounded-lg">
          <div className="text-center py-2 text-gray-900">
            <div className="mb-4 flex flex-col justify-center items-center py-2">
              <img
                src="../public/UTOPIA-B.png"
                alt="UTOPIA-B"
                className="w-20 h-20 rounded-full"
              />
                <span className="text-2xl font-bold text-white">
                  Connectez-vous à SOOATEL
                </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-middle"
                role="status"
              >
                <span className="sr-only">Chargement...</span>
              </div>
            </div>
          ) : (
            <>
                <form
                  onSubmit={loginSubmit(handleLogin)}
                  className="flex flex-col gap-4 text-white"
                >
                  <FormField
                    label="Votre e-mail"
                    type="text"
                    placeholder="nom@mail.com"
                    register={loginRegister}
                    errors={loginErrors}
                    name="email"
                  />
                  <PasswordInput
                    showPassword={showLoginPassword}
                    toggleShowPassword={() =>
                      setShowLoginPassword(!showLoginPassword)
                    }
                    register={loginRegister}
                    name="password"
                    errors={loginErrors}
                  />
                  <button
                    type="submit"
                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-gray-300/80 text-white rounded-lg"
                  >
                    Connexion
                  </button>
                  <span >
                    <Link
                      to="/authentification/forgot-password"
                      className="text-blue-500 hover:underline">
                      Mot de passe oublié ?
                    </Link>
                  </span>
                </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, type, placeholder, register, errors, name }) {
  return (
    <>
      <label className="text-lg font-semibold text-white">{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-gray-800/50 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-blue-500"
      />
      {errors[name] && (
        <p className="text-sm text-red-400">{errors[name]?.message}</p>
      )}
    </>
  );
}

function PasswordInput({
  showPassword,
  toggleShowPassword,
  register,
  placeholder = "Votre mot de passe",
  name,
  errors,
  label = "Mot de passe",
}) {
  return (
    <>
      <label className="text-lg font-semibold text-white">{label}</label>
      <div className="relative">
        <input
          {...register(name)}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-gray-800/50 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <div
          className="absolute top-3 right-4 cursor-pointer"
          onClick={toggleShowPassword}
        >
          {showPassword ? (
            <FaRegEyeSlash className="text-white" />
          ) : (
            <FaRegEye className="text-white" />
          )}
        </div>
      </div>
      {errors[name] && (
        <p className="text-sm text-red-400">{errors[name]?.message}</p>
      )}
    </>
  );
}
