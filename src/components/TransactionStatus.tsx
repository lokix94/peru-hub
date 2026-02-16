"use client";

interface TransactionStatusProps {
  status: "idle" | "loading" | "success" | "error" | "pending";
  amount?: number;
  from?: string;
  confirmations?: number;
  timestamp?: string;
  error?: string;
  onRetry?: () => void;
}

export default function TransactionStatus({
  status,
  amount,
  from,
  confirmations,
  timestamp,
  error,
  onRetry,
}: TransactionStatusProps) {
  if (status === "idle") return null;

  /* ── Loading ── */
  if (status === "loading") {
    return (
      <div
        style={{
          background: "#181A20",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid #2B3139",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid #2B3139",
              borderTop: "3px solid #F0B90B",
              borderRadius: "50%",
              animation: "txSpin 1s linear infinite",
            }}
          />
        </div>
        <p
          style={{
            color: "#F0B90B",
            fontSize: "14px",
            fontWeight: 600,
            marginBottom: "4px",
          }}
        >
          🔍 Verificando transacción en la blockchain...
        </p>
        <p style={{ color: "#5E6673", fontSize: "11px" }}>
          Consultando BNB Smart Chain vía BSCScan
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "6px",
            marginTop: "12px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#F0B90B",
                animation: `txPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes txSpin { to { transform: rotate(360deg); } }
          @keyframes txPulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1.2); } }
        `}</style>
      </div>
    );
  }

  /* ── Success ── */
  if (status === "success") {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #0d2818 0%, #0a1f14 100%)",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid #166534",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(34, 197, 94, 0.2)",
              border: "2px solid #22c55e",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "28px" }}>✅</span>
          </div>
          <p
            style={{
              color: "#4ade80",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            ¡Pago verificado!
          </p>
          <p
            style={{
              color: "#86efac",
              fontSize: "12px",
            }}
          >
            Transacción confirmada en BNB Smart Chain
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "8px",
            }}
          >
            {amount !== undefined && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#86efac", fontSize: "12px" }}>
                  💰 Monto
                </span>
                <span
                  style={{
                    color: "#4ade80",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  ${amount.toFixed(2)} USDT
                </span>
              </div>
            )}
            {from && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#86efac", fontSize: "12px" }}>
                  📤 Desde
                </span>
                <span
                  style={{
                    color: "#bbf7d0",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                >
                  {from.slice(0, 8)}...{from.slice(-6)}
                </span>
              </div>
            )}
            {confirmations !== undefined && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#86efac", fontSize: "12px" }}>
                  🔗 Confirmaciones
                </span>
                <span
                  style={{
                    color: "#4ade80",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {confirmations}
                </span>
              </div>
            )}
            {timestamp && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#86efac", fontSize: "12px" }}>
                  🕐 Fecha
                </span>
                <span style={{ color: "#bbf7d0", fontSize: "11px" }}>
                  {new Date(timestamp).toLocaleString("es-PE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Pending (waiting for confirmations) ── */
  if (status === "pending") {
    return (
      <div
        style={{
          background: "#181A20",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid #854d0e",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(234, 179, 8, 0.2)",
              border: "2px solid #eab308",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "24px" }}>⏳</span>
          </div>
          <p
            style={{
              color: "#fbbf24",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Esperando confirmaciones...
          </p>
          <p style={{ color: "#5E6673", fontSize: "11px", marginTop: "4px" }}>
            {confirmations !== undefined
              ? `${confirmations}/3 confirmaciones. Intenta de nuevo en unos segundos.`
              : "La transacción fue encontrada pero aún necesita confirmaciones."}
          </p>
        </div>
        {amount !== undefined && (
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <span style={{ color: "#fbbf24", fontSize: "13px", fontWeight: 600 }}>
              ${amount.toFixed(2)} USDT detectados
            </span>
          </div>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "10px",
              borderRadius: "10px",
              background: "rgba(234, 179, 8, 0.15)",
              border: "1px solid #854d0e",
              color: "#fbbf24",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🔄 Reintentar verificación
          </button>
        )}
      </div>
    );
  }

  /* ── Error ── */
  return (
    <div
      style={{
        background: "#181A20",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid #991b1b",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "rgba(239, 68, 68, 0.2)",
            border: "2px solid #ef4444",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "24px" }}>❌</span>
        </div>
        <p
          style={{
            color: "#f87171",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          No se pudo verificar la transacción
        </p>
        {error && (
          <p
            style={{
              color: "#fca5a5",
              fontSize: "12px",
              marginTop: "6px",
              lineHeight: "1.4",
            }}
          >
            {error}
          </p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid #991b1b",
            color: "#f87171",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🔄 Reintentar
        </button>
      )}
    </div>
  );
}
