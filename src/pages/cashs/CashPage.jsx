import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Modal,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { apiUrl, fetchJson } from "../../services/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast";
import { convertDepositWithdraw } from "../../services/convertStatus";
import { convertMethodToPayment } from "../../services/convertMethodToPayment";
import CountUp from "react-countup";
import ProfitsList from "./ProfitsList";
import CashHistory from "./CashHistory";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  amount: z.number().min(0.01, "Le montant doit être positif"),
  transactionType: z.string().min(1, "Type de transaction requis"),
  modeOfTransaction: z.string().min(1, "Mode de paiement requis"),
  description: z
    .string()
    .max(500, "La description ne doit pas dépasser 500 caractères")
    .optional(),
});

const CashPage = () => {
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState([]);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [, setCashDetails] = useState(null);
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [balanceData, statusData, methodsData] = await Promise.all([
        fetchJson(apiUrl("/cash/balance")),
        fetchJson(apiUrl("/cash/status")),
        fetchJson(apiUrl("/payments/method")),
      ]);

      setBalance(balanceData?.balance || 0);
      setMethods(Array.isArray(methodsData) ? methodsData : []);
      setStatus(Array.isArray(statusData) ? statusData : []);
    } catch {
      showError(
        "Une erreur s'est produite lors de la récupération des données."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        amount: parseFloat(data.amount),
      };

      await fetchJson(apiUrl("/cash/transaction"), "POST", formattedData);
      reset();
      setOpenModal(false);
      showSuccess("Transaction réussie !");
      void fetchData();
    } catch (error) {
      console.error("Erreur de transaction", error);
      showError("Erreur lors de la transaction.");
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setCashDetails(null);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const toggleModal = () => {
    setShowDetailsModal(!showDetailsModal);
    navigate("/history")
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 dark:text-white">
      <h1 className="text-2xl font-semibold mb-4">Gestion de la Caisse</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-md flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
            >
              Ajouter une Transaction
            </Button>
            <h2 className="text-xl">
              Solde actuel : <CountUp start={0} separator=" " end={balance} />{" "}
              Ar
            </h2>
            <button
              className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2"
              onClick={toggleModal}
            >
              Voir historique
            </button>
          </div>

          <Modal open={openModal} onClose={handleCloseModal}>
            <Box className="w-full max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
              <Typography variant="h6" className="mb-4 text-center">
                Formulaire de Transaction
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <TextField
                    fullWidth
                    label="Montant"
                    variant="outlined"
                    type="number"
                    {...register("amount", {
                      valueAsNumber: true,
                    })}
                    error={!!errors.amount}
                    helperText={errors.amount ? errors.amount.message : ""}
                    className="mb-4"
                  />
                </div>

                <div>
                  <FormControl fullWidth>
                    <InputLabel>Type de Transaction</InputLabel>
                    <Select
                      label="Type de Transaction"
                      {...register("transactionType")}
                      error={!!errors.transactionType}
                    >
                      {Array.isArray(status) && status.length > 0 ? (
                        status.map((s, i) => (
                          <MenuItem key={i} value={s}>
                            {convertDepositWithdraw(s)}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">Aucun statut disponible</MenuItem>
                      )}
                    </Select>
                    {errors.transactionType && (
                      <p className="text-red-500">
                        {errors.transactionType.message}
                      </p>
                    )}
                  </FormControl>
                </div>

                <div>
                  <FormControl fullWidth>
                    <InputLabel>Mode de Paiement</InputLabel>
                    <Select
                      label="Mode de Paiement"
                      {...register("modeOfTransaction")}
                      error={!!errors.modeOfTransaction}
                    >
                      {Array.isArray(methods) && methods.length > 0 ? (
                        methods.map((method, index) => (
                          <MenuItem key={index} value={method}>
                            {convertMethodToPayment(method)}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">
                          Aucun mode de paiement disponible
                        </MenuItem>
                      )}
                    </Select>
                    {errors.modeOfTransaction && (
                      <p className="text-red-500">
                        {errors.modeOfTransaction.message}
                      </p>
                    )}
                  </FormControl>
                </div>

                <div>
                  <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    {...register("description")}
                    error={!!errors.description}
                    helperText={
                      errors.description ? errors.description.message : ""
                    }
                    className="mb-4"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    onClick={handleCloseModal}
                    variant="outlined"
                    color="secondary"
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Soumettre
                  </Button>
                </div>
              </form>
            </Box>
          </Modal>
        </>
      )}
      <ProfitsList />
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-1/2 DetailsModal">
            <div className="flex flex-row justify-end items-center">
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative text-[30px] hover:text-white cursor-pointer"
                onClick={closeDetailsModal}
              >
                x
              </span>
            </div>
            <CashHistory onClose={closeDetailsModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CashPage;
