import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {apiUrl, fetchJson} from "../../services/api.js";
import {useNavigate} from "react-router-dom";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast.jsx";

const schema = z.object({
    username: z.string().min(3, "Le nom d'utilisateur doit avoir au moins 3 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
});

function CreateUser() {
    const {register, handleSubmit, watch, formState: {errors}} = useForm({
        resolver: zodResolver(schema)
    });

    const {showSuccess, showError} = useToast()
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await fetchJson(apiUrl("/sign-up"), "POST", data);
            showSuccess("Utilisateur créé avec succès !");
            navigate('/users')
        } catch (err) {
            console.error("Erreur lors de la création de l'utilisateur :", err);
            showError("Erreur lors de la création de l'utilisateur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="darkBody container pr-10 p-6 bg-white rounded-md">
            <h1 className="text-2xl font-bold mb-4">Créer un utilisateur</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block font-medium">Nom d'utilisateur</label>
                    <input
                        {...register("username")}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Entrez le nom d'utilisateur"
                    />
                    {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Entrez l'email"
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>

                <div className="relative">
                    <label className="block font-medium">Mot de passe</label>
                    <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Entrez le mot de passe"
                    />
                    <button
                        type="button"
                        className="absolute top-9 right-3"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <AiFillEyeInvisible/> : <AiFillEye/>}
                    </button>
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

                <div className="relative">
                    <label className="block font-medium">Confirmer le mot de passe</label>
                    <input
                        {...register("confirmPassword")}
                        type={showPassword ? "text" : "password"}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Confirmez le mot de passe"
                    />
                    <button
                        type="button"
                        className="absolute top-9 right-3"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <AiFillEyeInvisible/> : <AiFillEye/>}
                    </button>
                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
                >
                    {loading ? "Création..." : "Créer l'utilisateur"}
                </button>
            </form>
        </div>
    );
}

export default CreateUser;
