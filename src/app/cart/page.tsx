const [txVerifyStatus, setTxVerifyStatus] = useState<"idle" | "loading" | "success" | "error" | "pending">("idle");
const [txVerifyData, setTxVerifyData] = useState<{amount?: number; from?: string; confirmations?: number; timestamp?: string; error?: string;}>({});
const [installationStatus, setInstallationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
const [installationError, setInstallationError] = useState("");
const [installationResults, setInstallationResults] = useState<{success: string[], failed: string[], timestamp: string}>({success: [], failed: [], timestamp: ""});

/* ── Installation handler - calls API after successful payment ── */
const handleInstallSkills = async (agentId: string, skillsToInstall: typeof items) => {
  setInstallationStatus("loading");
  setInstallationError("");
  
  try {
    const res = await fetch("/api/skills/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId: agentId,
        skills: skillsToInstall.map(s => ({ id: s.id, name: s.name })),
        txHash: txId,
        timestamp: new Date().toISOString(),
      }),
    });
    
    const data = await res.json();
    
    if (data.success) {
      setInstallationStatus("success");
      setInstallationResults({
        success: data.installedSkills || skillsToInstall.map(s => s.name),
        failed: data.failedSkills || [],
        timestamp: new Date().toISOString(),
      });
      return true;
    } else {
      setInstallationStatus("error");
      setInstallationError(data.error || "Error instalando los skills. Intenta de nuevo.");
      return false;
    }
  } catch (error) {
    setInstallationStatus("error");
    setInstallationError(`Error de conexión: ${error instanceof Error ? error.message : "Desconocido"}`);
    console.error("Installation error:", error);
    return false;
  }
};

const handleRetryInstallation = async () => {
  if (selectedAgentId && purchasedItems.length > 0) {
    const success = await handleInstallSkills(selectedAgentId, purchasedItems);
    if (success) {
      setTimeout(() => setStep("complete"), 1500);
    }
  }
};

const handleStartInstall = async () => {
  if (!selectedAgentId || purchasedItems.length === 0) {
    setInstallationError("Selecciona un agente y asegúrate que hay skills para instalar");
    return;
  }
  
  setInstallIndex(0);
  setInstallProgress(0);
  setStep("installing");
  
  // Call actual installation API after animation starts
  setTimeout(async () => {
    const success = await handleInstallSkills(selectedAgentId, purchasedItems);
    if (!success) {
      console.error("Skill installation failed");
    }
  }, 500);
};

<h2 className="text-2xl font-bold text-white">
  {installationStatus === "success" ? "¡Instalación Completa!" : installationStatus === "error" ? "Error en la Instalación" : "Finalizando..."}
</h2>
<p className="text-sm text-white/80 mt-2">
  {installationStatus === "success" 
    ? `${installationResults.success.length} skills instalados en ${agentName}`
    : installationStatus === "error"
    ? `No pudimos instalar los skills. ${installationError}`
    : "Por favor espera..."}
</p>
{installationStatus === "error" && (
  <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-4">
    <p className="text-sm text-red-700 font-semibold mb-2">❌ Error: {installationError}</p>
    <button
      onClick={handleRetryInstallation}
      className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all"
    >
      🔄 Reintentar Instalación
    </button>
  </div>
)}
