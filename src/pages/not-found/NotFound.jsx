import {FaArrowLeft} from 'react-icons/fa';

export default function NotFound() {
    return (
        <div className="container bg-white w-[1109px] darkBody mx-auto p-10 pb-14">
            <main className="flex items-center justify-center">
                <div className="flex flex-col items-center max-w-md space-y-6">
                    <div>
                        <img
                            src="/error.png"
                            alt="En cours de développement"
                            className="max-w-full w-[400px] h-auto"
                        />
                    </div>
                    <p className="text-center text-gray-600">
                        Vous avez soit essayé un chemin douteux, soit vous êtes arrivé ici par erreur. Quoi qu'il en
                        soit, essayez
                        d'utiliser la navigation.
                    </p>
                    <button onClick={() => window.history.back()}
                          className="inline-flex items-center px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
                        <FaArrowLeft size={24} className="mr-2"/>
                        Retour à l'accueil
                    </button>
                </div>
            </main>
        </div>
    );
}
