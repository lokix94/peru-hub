import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/skills/run/asm-explain
 * Herramienta educativa: explica snippets simples de ensamblador (x86 / ARM).
 * No ejecuta código; solo documenta instrucciones conocidas.
 * Body: { code: string, arch?: "x86" | "arm" }
 */

const X86: Record<string, string> = {
  mov: "Copia el valor del operando fuente al destino (move).",
  add: "Suma el operando fuente al destino.",
  sub: "Resta el operando fuente del destino.",
  mul: "Multiplicación entera sin signo.",
  div: "División entera sin signo.",
  push: "Guarda un valor en la pila y ajusta el stack pointer.",
  pop: "Saca un valor de la pila al registro/destino.",
  call: "Llama a una subrutina (guarda dirección de retorno).",
  ret: "Retorna de una subrutina.",
  jmp: "Salto incondicional a una etiqueta/dirección.",
  je: "Salto si igual (ZF=1).",
  jne: "Salto si no igual (ZF=0).",
  cmp: "Compara dos operandos (resta sin guardar; actualiza flags).",
  nop: "No operation — no hace nada; relleno/alineación.",
  xor: "OR exclusivo bit a bit; xor reg,reg pone el registro en 0.",
  and: "AND bit a bit.",
  or: "OR bit a bit.",
  lea: "Load Effective Address — calcula dirección sin acceder a memoria.",
  int: "Interrupción de software (ej. int 0x80 en Linux antiguo).",
  syscall: "Llamada al sistema (x86-64 Linux).",
};

const ARM: Record<string, string> = {
  mov: "Copia un valor inmediato o registro al destino.",
  add: "Suma.",
  sub: "Resta.",
  mul: "Multiplicación.",
  ldr: "Load Register — carga desde memoria.",
  str: "Store Register — guarda en memoria.",
  b: "Branch — salto incondicional.",
  bl: "Branch with Link — llama subrutina (guarda LR).",
  bx: "Branch and exchange (p. ej. retorno bx lr).",
  cmp: "Compara y actualiza flags de condición.",
  and: "AND bit a bit.",
  orr: "OR bit a bit.",
  eor: "XOR bit a bit.",
  nop: "No operation.",
  svc: "Supervisor call — syscall.",
};

function tokenizeLine(line: string): string[] {
  const cleaned = line
    .replace(/;.*$/, "")
    .replace(/\/\/.*$/, "")
    .trim()
    .toLowerCase();
  if (!cleaned) return [];
  return cleaned.split(/[\s,]+/).filter(Boolean);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const code = typeof body.code === "string" ? body.code : "";
    const arch = body.arch === "arm" ? "arm" : "x86";
    const dict = arch === "arm" ? ARM : X86;

    if (code.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Envía código ensamblador en el campo 'code' (mín. 2 caracteres).",
        },
        { status: 400 }
      );
    }

    const lines = code.split("\n").slice(0, 40);
    const explained = lines.map((line, i) => {
      const tokens = tokenizeLine(line);
      const mnemonic = tokens[0] || "";
      const meaning =
        dict[mnemonic] ||
        (mnemonic
          ? `Instrucción '${mnemonic}' no está en el diccionario local (arch=${arch}).`
          : "(línea vacía o solo comentario)");
      return {
        line: i + 1,
        raw: line,
        mnemonic: mnemonic || null,
        meaning,
      };
    });

    const known = explained.filter(
      (e) => e.mnemonic && dict[e.mnemonic]
    ).length;

    return NextResponse.json({
      success: true,
      real: true,
      skill: "asm-explainer",
      educational: true,
      note: "No ejecuta código. Solo explica mnemónicos conocidos.",
      arch,
      lines: explained,
      stats: { totalLines: lines.length, knownMnemonics: known },
    });
  } catch (e) {
    console.error("[asm-explain]", e);
    return NextResponse.json(
      { success: false, error: "Error al analizar el snippet" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    skill: "asm-explainer",
    method: "POST",
    body: {
      arch: "x86",
      code: "mov eax, 1\nxor ebx, ebx\nadd eax, ebx\nret",
    },
  });
}
