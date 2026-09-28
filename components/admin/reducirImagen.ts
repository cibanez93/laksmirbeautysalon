// Reduce las fotos en el navegador antes de subirlas (máximo 1600 píxeles, formato JPEG),
// para que pesen poco (~300 KB) y quepan en el límite de subida.
const LADO_MAXIMO = 1600;

async function reducir(archivo: File): Promise<File> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(bitmap.width * escala);
  lienzo.height = Math.round(bitmap.height * escala);
  lienzo.getContext("2d")!.drawImage(bitmap, 0, 0, lienzo.width, lienzo.height);
  const blob = await new Promise<Blob>((ok, mal) => lienzo.toBlob((b) => (b ? ok(b) : mal(new Error("No se pudo procesar"))), "image/jpeg", 0.82));
  return new File([blob], "foto.jpg", { type: "image/jpeg" });
}

// Reduce las fotos elegidas en los campos indicados del formulario.
// Devuelve false si alguna no se ha podido leer.
export async function reducirImagenes(formData: FormData, campos: string[]): Promise<boolean> {
  try {
    for (const campo of campos) {
      const archivo = formData.get(campo);
      if (archivo instanceof File && archivo.size > 0) formData.set(campo, await reducir(archivo));
    }
    return true;
  } catch {
    return false;
  }
}
