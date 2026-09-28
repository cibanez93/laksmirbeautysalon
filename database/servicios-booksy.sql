-- Servicios de Laksmir Beauty copiados de su página de Booksy (septiembre 2026)
-- Para ejecutarlo: File > Open SQL Script, y luego el rayo ⚡ (ejecuta todo el archivo)

USE laksmir;

-- PELUQUERIA
INSERT INTO servicios (nombre, descripcion, precio, duracion_min, orden) VALUES
  ('CORTE DE CABALLERO', '', 18.00, 45, 110),
  ('CORTAR EN SECO', 'Cortar en seco sin lavar', 22.00, 30, 120),
  ('CORTE DE INFANTIL', 'Incluye: lavado y productos de acabado.', 22.00, 30, 130),
  ('RECOGIDOS', '', 45.00, 45, 140),
  ('LAVAR + PEINAR (Cabello corto)', 'La largura del cabello podría variar el precio.', 20.00, 30, 150),
  ('LAVAR + PEINAR (Media melena)', '', 23.00, 30, 160),
  ('LAVAR + PEINAR (Cabello Largo)', 'Si el cabello es muy largo o hay mucha cantidad se cobrará un suplemento de 10€', 29.00, 60, 170),
  ('CORTAR + LAVAR + PEINAR(Cualquier largo)', '', 41.50, 60, 180),
  ('MECHAS + PEINAR (cabello corto)', 'Aplicación de mechas, cortar , lavar y peinar', 85.00, 180, 190),
  ('MECHAS + PEINAR (Cabello largo)', '', 130.00, 240, 200),
  ('MECHAS ESPECIALES + PEINAR(Cualquier largo)', 'Cualquier tipo de mechas babylights, balayages etc. Podría existir algún coste adicional según los matices elegidos para la elección del color perfecto.', 178.90, 210, 210),
  ('EXPERIENCIA BRÛLÉE', 'La experiencia más completa para conseguir una melena exclusiva y personalizada.

Incluye consulta personalizada, diagnóstico capilar, visagismo, diseño del color, balayage premium, realce de color, matización, tratamiento reparador y acabado profesional.

Plazas limitadas para garantizar una atención totalmente personalizada.

 Solo disponible tras valoración previa en cabellos con historial de color complejo.', 380.00, 300, 220),
  ('COLOR DE RAÍZ + PEINAR(cualquier largo)', 'Si el cabello es muy largo o tiene mucha cantidad se cobrará un suplemento de 10€', 48.50, 90, 230),
  ('COLOR DE RAÍZ + CORTAR + PEINAR', '', 65.00, 90, 240),
  ('BARROS DE RAÍZ + PEINAR', 'La coloración con barros es una alternativa 100% natural y respetuosa con tu cabello y cuero cabelludo. Aporta color sin dañar la fibra capilar, nutre y fortalece desde la raíz, realza el brillo y aporta cuerpo al cabello.
Además, ayuda a equilibrar el cuero cabelludo, mejorando alteraciones como exceso de grasa, caspa, irritaciones o sensibilidad.
Ideal para quienes buscan una opción saludable, libre de químicos agresivos y con resultados naturales y duraderos.', 58.50, 90, 250),
  ('METODO CURLY', 'Limpieza de iniciación + Hidratación + Definición de rizos', 48.00, 60, 260),
  ('ALISADO CAPILAR (taninoplastia)', 'Tratamiento Orgánico para alisar el cabello e hidratarlo en profundidad', 150.00, 150, 270),
  ('TRATAMIENTOS CAPILARES', 'tratamientos específicos para tu cabello, tambien contamos con un tratamiento exclusivo para la descamación (PEELING CAPILAR)', 22.00, 15, 280);

-- TRATAMIENTOS FACIALES
INSERT INTO servicios (nombre, descripcion, precio, duracion_min, orden) VALUES
  ('DIAGNÓSTICO FACIAL', 'Avanzado equipo de diagnóstico facial que incorpora las últimas tecnologías de captación y análisis de imágenes multi-espectrales en 3D para realizar un estudio inteligente de la piel en apenas 15 segundos.', NULL, 15, 210),
  ('RADIOFRECUENCIA FACIAL', 'Tratamientos específicos faciales ,
 Podemos combinar diferentes combos. Radiofrecuencia facial médica que trabaja tanto la parte más interna como externa de la piel.', 65.00, 40, 220),
  ('LIMPIEZA FACIAL PURIFYING BASICA', 'El procedimiento clásico de limpieza de cutis, tradicional y muy completa. Indicada para las pieles más sensibles.
Tiene una duración de 60 minutos durante los que se exfolia y elimina de forma manual células muertas, comedones y posibles quistes sebáceos.
Se trabaja descongestionando, tonificando y masajeando el rostro. Usando mascarillas que nutrirán la piel devolviéndole su equilibrio.', 60.00, 60, 230),
  ('LIMPIEZA FACIAL PROFUNDA CON APARATOLOGIA', 'Limpieza facial profesional

PURIFYING es un exclusivo plan de belleza de acción purificante-oxigenante que revoluciona los protocolos de higiene facial con Cosmetic Drone Technology y oxígeno puro.
Purifying Treatment es mucho más que una limpieza; revolucionario y único tratamiento que purifica la piel a todos los niveles.
A nivel externo, elimina el manto de impurezas superficiales y facilita la extracción de comedones. A nivel interno, detoxifica las células, las oxigena y energiza prolongando su vida y consiguiendo que funcionen al 100%.
PURIFYING TREATMENT combina tecnología médica y cosmética profesional para oxigenar y purificar la piel, consiguiendo que esta vuelva a respirar.', 65.00, 60, 240),
  ('TRATAMIENTO PERSONALIZADO FACIAL', 'Primero realizaremos un diagnóstico facial exhaustivo para determinar el estado de la piel y sus imperfecciones (manchas, acné, arrugas, flacidez…) y nos interesaremos por lo que más le preocupe al cliente. A partir de ahí podemos combinar nuestros tratamientos de la manera más efectiva. La aparatología es aparte, si no el precio seria de 90€  
Nuestra clave es individualizar cada caso y proporcionar al cliente lo que requiere de manera segura', 65.00, 60, 250),
  ('TRATAMIENTO Q10 ANTI-EDAD', 'REGENERADOR. Anti-edad.

Es un innovador tratamiento profesional de alto poder perfeccionador con estrategia antiarrugas X4 que rellena, regenera y alisa la piel, e inhibe los movimientos faciales repetitivos gracias a su extraordinario efecto bótox y una combinación avanzada de activos multifunción.  
Fórmula única rica en alfa-hidroxiácidos, activos efecto bótox, exquisitos aceites ricos en nutrientes y elementos botánicos avanzados para conseguir una piel visiblemente más joven, elástica, redensificada y libre de arrugas.', 65.00, 60, 260),
  ('TRATAMIENTO DESPIGMENTANTE (NACAR)', 'Indicado para todo tipo de piel. especialmente que presenten manchas, tono apagado y busquen aportar una intensa luminosidad al rostro aportando un intenso cuidado anti-edad.

Elimina la capa superficial de manchas, aclarandolas.Disminuye sustancialmente los aportes adicionales de melanina al área hiperpigmentada evitando que se agudicen y aparezcan nuevas manchas.Retrasa el envejecimiento y repara el daño a nivel celular. Bono de cinco sesiones hasta un 25% dto.', 65.00, 60, 270),
  ('TRATAMIENTO PARA PIELES IRRITADAS Y SENSIBLES', 'AgeDefense es un exclusivo tratamiento facial en fases monodosis con un avanzado sistema global 360° con PRO & PREBIOTIC TECHNOLOGY junto a los beneficios de PREBIOTIC IONISABLE MASK, máscara de 4ta generación única en el mundo que permite el uso de la técnica de ionización y de electroporación gracias a su capacidad transmisora de corriente.
Tratamiento de belleza formulado a base de prebióticos, probióticos y otros activos naturales tecnológicamente avanzados, con los que AgeDefense actúa de un modo revolucionario. Refuerza la primera barrera de defensa de la piel aportando un cuidado global, gracias a la acción de sus innovadores activos naturales.', 65.00, 60, 280),
  ('TRATAMIENTO ILUMINADOR  VITAMINA C', 'REVITALIZANTE. Anti-edad.

TRATAMIENTO FACIAL REVITALIZANTE PROFESIONAL PERSONALIZADO EN FASES MONODOSIS JUNTO CON LOS BENEFICIOS DE LA ALGAE PEEL-OFF GOLD MASK 2080. Máscara facial de alta tecnología con Oro de 24K que nutre, revitaliza y reafirma la piel.
Inyección de vitaminas y minerales. Los oligoelementos esenciales que la piel necesita para restablecer el equilibrio perdido por el paso del tiempo.
Los tratamientos en cabina CASMARA son la mejor opción en cosmética profesional para proporcionar cuidados de la piel específicos para conseguir una piel perfecta.', 65.00, 60, 290),
  ('TRATAMIENTO PARA PIELES GRASAS', 'REAFIRMANTE. Anti-edad.

TRATAMIENTO FACIAL REAFIRMANTE PROFESIONAL PERSONALIZADO EN FASES MONODOSIS JUNTO CON LOS BENEFICIOS DE LA ALGAE PEEL-OFF IONISABLE OCEAN MIRACLE MASK 3010. Máscara facial de alta tecnología con Alga Wakame de acción ultra reafirmante. Máscara de nueva generación que permite el uso de la técnica de ionización y de electroporación gracias a su capacidad transmisora de corriente. Recomendada para evitar y corregir la flacidez facial.
Los tratamientos en cabina CASMARA, son la mejor opción en cosmética profesional para proporcionar cuidados de la piel específicos para conseguir una piel perfecta.', 65.00, 60, 300),
  ('REJUVENECEDOR GLOBAL DE OJOS', 'REJUVENECEDOR GLOBAL DE OJOS

Eye Perfection es un avanzado tratamiento profesional de acción rejuvenecedora global cuidadosamente formulado para tratar el contorno ocular. Trata todos los signos que envejecen la mirada como flacidez, bolsas, ojeras y arrugas periorbitales (patas de gallo y arrugas en el entrecejo).
Un revolucionario tratamiento de alta eficacia no irritativo que fusiona activos naturales y tecnologías pioneras para rejuvenecer la mirada y embellecerla desde la primera sesión.
Combina factores de crecimiento, extractos botánicos medicinales y tecnología propia inspirada en la carboxiterapia capaz de rejuvenecer el contorno ocular desde la primera sesión.
Una fórmula exclusiva que aporta cuidados y sensaciones únicas; porque una sesión de Eye Perfection no es solo una intensa sesión de belleza rejuvenecedora, sino que además aporta relax y bienestar que sumerge en una auténtica experiencia holística.', 65.00, 60, 310),
  ('DERMAPEN FACIAL', 'El precio puede variar según el tratamiento. Desde 70 a 90 euros.', 89.00, 60, 320),
  ('PEELING QUIMICO CASMARA', '', 89.00, 60, 330);

-- TRATAMIENTOS CORPORALES
INSERT INTO servicios (nombre, descripcion, precio, duracion_min, orden) VALUES
  ('PHARMA PRESS (Presoterapia Médica)', '📢 La presoterápia es un tratamiento estético corporal muy solicitado por los clíentes ya que ayuda a tratar la retención de líquidos y la celulitis.
Resultados desde la primera sesión: 
🔹 Redefine las piernas.
🔹 Reduce el Volumen.
🔹 Previene la aparición de varices.
🔹 Mejora visiblemente el aspecto de la piel.', 18.00, 30, 310),
  ('RADIOFRECUENCIA CORPORAL', '', 75.00, 30, 320),
  ('MADEROTERAPIA+PRESOTERAPIA', '**La maderoterapia consiste en una serie de masajes para tonificar el cuerpo, minimizar la retención de líquidos, tratar la grasa localizada, y estimular la producción de elastina. + Presoterapia que la utilizaremos combatir la retención de líquidos, eliminar la celulitis y activar el sistema circulatorio**.', 58.00, 60, 330),
  ('RADIOFRECUENCIA + PRESOTERAPIA', 'técnica segura y eficaz para eliminar la celulitis, puede trabajar desde capas profundas de la piel. **Estimula la circulación en la zona tratada favoreciendo el drenaje de la grasa y reduciendo la posibilidad de que vuelva a suceder**. Favorece la eliminación de líquidos y toxinas acumulados en la zona.', 80.00, 60, 340);

-- MANICURA
INSERT INTO servicios (nombre, descripcion, precio, duracion_min, orden) VALUES
  ('MANICURA RUSA( limpieza profunda sin esmaltar)', 'Cortar, limar y manicura profunda con torno.', 30.00, 30, 410),
  ('MANICURA SEMI EXPRES (SIN REFUERZO)', 'Empujar cutícula, cortar, limar y esmaltar.', 28.00, 30, 420),
  ('UÑAS SEMIPERMANENTE+REFUERZO', '', 35.00, 60, 430),
  ('UÑAS SEMI + REFUERZO', '', 35.00, 75, 440),
  ('MºRUSA+SEMIPERMANENTE', 'Cortar, limar, manicura rusa, nivelación y esmaltar.', 49.00, 90, 450),
  ('ESCULPIDO DE UÑAS (S-L) ( Alargamiento)', 'Cortar, limar, limpieza cutícula y alargamiento con gel, acrigel o acrílico.', 55.00, 120, 460),
  ('MANTENIMIENTO DE ESCULPIDO DE UÑAS', 'Cortar, limar, manicura rusa, relleno de gel o acrigel.', 40.00, 90, 470),
  ('MANICURA BASICA', 'Cortar, limar y apartar cutícula.', 15.00, 15, 480),
  ('MANICURA INFANTIL(decoración sencilla)', 'Limar, esmaltar y decoración sencilla.', 17.00, 30, 490),
  ('REPARACION DE UNA UÑA', 'Si necesitas arreglarte una o dos uñas reserva este servicio- Solo será GRATUITO el servicio si estas en PLAZO. 7 días como máximo de haberte realizado el servicio. el precio puede variar según si hay que alargar o no.', 2.00, 10, 500),
  ('RECONSTRUCCION DE UÑA ROTA', '', 4.00, 15, 510),
  ('RETIRADA DE UÑAS SEMIPERMANENTES', '', 10.00, 10, 520),
  ('RETIRADA DE UÑAS DE GEL, ACRIGEL, ACRILICO..', '', 15.00, 20, 530);

-- MAQUILLAJE PROFESIONAL
INSERT INTO servicios (nombre, descripcion, precio, duracion_min, orden) VALUES
  ('MAQUILLAJE PARA NOVIAS', '', 150.00, 90, 510),
  ('MAQUILLAJE PARA EVENTOS', '', 45.00, 60, 520);

-- MASAJES
INSERT INTO servicios (nombre, descripcion, precio, duracion_min, orden) VALUES
  ('MASAJE RELAX', '', 55.00, 50, 610),
  ('MASAJE ANTICELULÍTICO', '', 43.00, 60, 620),
  ('MASAJE DE PIES', '', 30.00, 20, 630);

-- DISEÑO DE MIRADA
INSERT INTO servicios (nombre, descripcion, precio, duracion_min, orden) VALUES
  ('COMBO LAMINADO DE CEJAS Y LIFTING DE PESTAÑAS', '', 78.00, 90, 710),
  ('LIFTING DE PESTAÑAS Y TINTE', 'OPCIONAL BOTOX (+6 EUROS SUPLEMENTO)', 48.00, 60, 720),
  ('LAMINACION DE CEJAS', 'incluye henna para diseño de las cejas y depilación con hilo.', 48.00, 60, 730),
  ('TATUAJE DE HENNA PARA CEJAS Y DEPILACION CON HILO', '', 30.00, 60, 740),
  ('TINTE DE CEJAS', '', 15.00, 15, 750),
  ('DEPILACIÓN CON HILO', '', 10.00, 5, 760),
  ('TINTE DE PESTAÑAS', '', 15.00, 10, 770);

-- PEDICURA
INSERT INTO servicios (nombre, descripcion, precio, duracion_min, orden) VALUES
  ('PEDICURA COMPLETA+ESMALTADO SEMI(Incluye durezas)', '', 48.00, 60, 810),
  ('PEDICURA BASICA+ESMALTADO SEMI (Sin durezas)', 'cortar, limar, cutícula, esmaltar permanente, exfoliación y masaje.', 42.00, 60, 820),
  ('PEDICURA BASICA+ESMALTADO NORMAL(Duración 10dias)', 'Cortar, limar, cutícula y esmaltar (sin agua)', 30.00, 30, 830),
  ('PEDICURA COMPLETA(Solo limpieza sin esmaltar)', 'Cortar, limar, cutícula, durezas, exfoliación y masaje.', 35.00, 40, 840),
  ('MASAJE RELAJANTE DE PIES', '', 35.00, 30, 850),
  ('Pedicura Básica (Cortar y limar)', '', 15.00, 15, 860),
  ('PEDICURA RITUAL LAKSMIR', 'Tratamiento completo de cuidado profundo para pies.

Incluye trabajo técnico de uñas y cutículas, eliminación de durezas, tratamiento de exfoliación, masaje relajante en pies y gemelos. Terminado con un esmaltado perfecto.', 55.00, 90, 870);

-- DEPILACION CORPORAL
INSERT INTO servicios (nombre, descripcion, precio, duracion_min, orden) VALUES
  ('DEPILACION CON CERA', '', 10.00, 10, 910);
