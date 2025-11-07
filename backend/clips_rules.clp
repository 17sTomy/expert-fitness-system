;;; Sistema Experto de Fitness
;;; Reglas para recomendaciones personalizadas

;;; Templates

(deftemplate usuario
   (slot nombre (type STRING))
   (slot edad (type INTEGER))
   (slot sexo (type SYMBOL) (allowed-values masculino femenino))
   (slot peso (type FLOAT))
   (slot altura (type FLOAT))
   (slot nivel (type SYMBOL) (allowed-values novato intermedio avanzado))
   (slot objetivo (type SYMBOL) (allowed-values ganar_musculo perder_grasa mantenimiento))
   (slot frecuencia (type INTEGER))
   (slot equipamiento (type SYMBOL) (allowed-values gimnasio_completo peso_corporal entrenamiento_casa))
   (slot lesiones (type STRING)))

(deftemplate resultados
   (slot imc (type FLOAT))
   (slot tmb (type FLOAT))
   (slot calorias (type INTEGER))
   (slot proteinas (type INTEGER))
   (slot carbohidratos (type INTEGER))
   (slot grasas (type INTEGER))
   (slot agua (type FLOAT))
   (slot sueno (type INTEGER))
   (slot comidas (type INTEGER))
   (slot imc-categoria (type STRING)))

(deftemplate plan-entrenamiento
   (slot tipo-split (type STRING))
   (slot dias-por-semana (type INTEGER)))

(deftemplate consejo
   (slot mensaje (type STRING)))

;;; Reglas para calcular IMC

(defrule calcular-imc
   (usuario (peso ?p) (altura ?a))
   ?r <- (resultados (imc 0.0))
   =>
   (bind ?altura-m (/ ?a 100))
   (bind ?imc (/ ?p (* ?altura-m ?altura-m)))
   (bind ?categoria "Normal")
   (if (< ?imc 18.5) then (bind ?categoria "Bajo Peso"))
   (if (and (>= ?imc 18.5) (< ?imc 25)) then (bind ?categoria "Peso Normal"))
   (if (and (>= ?imc 25) (< ?imc 30)) then (bind ?categoria "Sobrepeso"))
   (if (>= ?imc 30) then (bind ?categoria "Obesidad"))
   (modify ?r (imc ?imc) (imc-categoria ?categoria)))

;;; Reglas para calcular TMB (Tasa Metabólica Basal)

(defrule calcular-tmb-hombre
   (usuario (sexo masculino) (peso ?p) (altura ?a) (edad ?e))
   ?r <- (resultados (tmb 0.0))
   =>
   (bind ?tmb (+ (* 10 ?p) (* 6.25 ?a) (- (* 5 ?e) 5)))
   (modify ?r (tmb ?tmb)))

(defrule calcular-tmb-mujer
   (usuario (sexo femenino) (peso ?p) (altura ?a) (edad ?e))
   ?r <- (resultados (tmb 0.0))
   =>
   (bind ?tmb (+ (* 10 ?p) (* 6.25 ?a) (- (* 5 ?e) 161)))
   (modify ?r (tmb ?tmb)))

;;; Reglas para calcular calorías según objetivo

(defrule calcular-calorias-ganar-musculo
   (usuario (objetivo ganar_musculo) (frecuencia ?f))
   ?r <- (resultados (tmb ?tmb&:(> ?tmb 0)) (calorias 0))
   =>
   (bind ?factor 1.5)
   (if (>= ?f 5) then (bind ?factor 1.7))
   (bind ?calorias (round (* ?tmb ?factor)))
   (bind ?calorias (+ ?calorias 300))
   (modify ?r (calorias ?calorias)))

(defrule calcular-calorias-perder-grasa
   (usuario (objetivo perder_grasa) (frecuencia ?f))
   ?r <- (resultados (tmb ?tmb&:(> ?tmb 0)) (calorias 0))
   =>
   (bind ?factor 1.4)
   (if (>= ?f 5) then (bind ?factor 1.6))
   (bind ?calorias (round (* ?tmb ?factor)))
   (bind ?calorias (- ?calorias 500))
   (modify ?r (calorias ?calorias)))

(defrule calcular-calorias-mantenimiento
   (usuario (objetivo mantenimiento) (frecuencia ?f))
   ?r <- (resultados (tmb ?tmb&:(> ?tmb 0)) (calorias 0))
   =>
   (bind ?factor 1.5)
   (if (>= ?f 5) then (bind ?factor 1.65))
   (bind ?calorias (round (* ?tmb ?factor)))
   (modify ?r (calorias ?calorias)))

;;; Reglas para macronutrientes

(defrule calcular-macros-ganar-musculo
   (usuario (objetivo ganar_musculo) (peso ?p))
   ?r <- (resultados (calorias ?cal&:(> ?cal 0)) (proteinas 0))
   =>
   (bind ?prot (round (* ?p 2.2)))
   (bind ?grasas (round (* ?p 1.0)))
   (bind ?carbs (round (/ (- ?cal (* ?prot 4) (* ?grasas 9)) 4)))
   (modify ?r (proteinas ?prot) (carbohidratos ?carbs) (grasas ?grasas)))

(defrule calcular-macros-perder-grasa
   (usuario (objetivo perder_grasa) (peso ?p))
   ?r <- (resultados (calorias ?cal&:(> ?cal 0)) (proteinas 0))
   =>
   (bind ?prot (round (* ?p 2.4)))
   (bind ?grasas (round (* ?p 0.8)))
   (bind ?carbs (round (/ (- ?cal (* ?prot 4) (* ?grasas 9)) 4)))
   (modify ?r (proteinas ?prot) (carbohidratos ?carbs) (grasas ?grasas)))

(defrule calcular-macros-mantenimiento
   (usuario (objetivo mantenimiento) (peso ?p))
   ?r <- (resultados (calorias ?cal&:(> ?cal 0)) (proteinas 0))
   =>
   (bind ?prot (round (* ?p 2.0)))
   (bind ?grasas (round (* ?p 1.0)))
   (bind ?carbs (round (/ (- ?cal (* ?prot 4) (* ?grasas 9)) 4)))
   (modify ?r (proteinas ?prot) (carbohidratos ?carbs) (grasas ?grasas)))

;;; Reglas para agua y sueño

(defrule calcular-agua-sueno
   (usuario (peso ?p) (frecuencia ?f))
   ?r <- (resultados (agua 0.0))
   =>
   (bind ?agua (/ (* ?p 35) 1000))
   (if (>= ?f 5) then (bind ?agua (+ ?agua 0.5)))
   (bind ?sueno 8)
   (if (>= ?f 6) then (bind ?sueno 9))
   (modify ?r (agua ?agua) (sueno ?sueno)))

;;; Reglas para número de comidas

(defrule comidas-ganar-musculo
   (usuario (objetivo ganar_musculo))
   ?r <- (resultados (comidas 0))
   =>
   (modify ?r (comidas 5)))

(defrule comidas-perder-grasa
   (usuario (objetivo perder_grasa))
   ?r <- (resultados (comidas 0))
   =>
   (modify ?r (comidas 4)))

(defrule comidas-mantenimiento
   (usuario (objetivo mantenimiento))
   ?r <- (resultados (comidas 0))
   =>
   (modify ?r (comidas 4)))

;;; Reglas para plan de entrenamiento

(defrule plan-frecuencia-baja
   (usuario (frecuencia ?f&:(< ?f 4)))
   =>
   (assert (plan-entrenamiento (tipo-split "Full Body") (dias-por-semana ?f))))

(defrule plan-frecuencia-media
   (usuario (frecuencia ?f&:(and (>= ?f 4) (<= ?f 5))))
   =>
   (assert (plan-entrenamiento (tipo-split "Upper/Lower") (dias-por-semana ?f))))

(defrule plan-frecuencia-alta
   (usuario (frecuencia ?f&:(> ?f 5)))
   =>
   (assert (plan-entrenamiento (tipo-split "Push/Pull/Legs") (dias-por-semana 6))))

;;; Consejos según IMC

(defrule consejo-bajo-peso
   (resultados (imc-categoria "Bajo Peso"))
   =>
   (assert (consejo (mensaje "Tu IMC indica bajo peso. Considera aumentar tu ingesta calórica y consultar con un profesional."))))

(defrule consejo-sobrepeso
   (resultados (imc-categoria "Sobrepeso"))
   =>
   (assert (consejo (mensaje "Tu IMC indica sobrepeso. Un déficit calórico moderado y ejercicio regular te ayudarán."))))

(defrule consejo-obesidad
   (resultados (imc-categoria "Obesidad"))
   =>
   (assert (consejo (mensaje "Tu IMC indica obesidad. Es importante consultar con un profesional de la salud antes de comenzar."))))

;;; Consejos según objetivo

(defrule consejo-ganar-musculo
   (usuario (objetivo ganar_musculo))
   =>
   (assert (consejo (mensaje "Para ganar músculo: entrena con pesos progresivos, descansa adecuadamente y mantén superávit calórico."))))

(defrule consejo-perder-grasa
   (usuario (objetivo perder_grasa))
   =>
   (assert (consejo (mensaje "Para perder grasa: mantén déficit calórico, prioriza proteína y combina cardio con entrenamiento de fuerza."))))

;;; Consejos según nivel

(defrule consejo-novato
   (usuario (nivel novato))
   =>
   (assert (consejo (mensaje "Como principiante, enfócate en aprender la técnica correcta antes de aumentar peso."))))

;;; Consejos según edad

(defrule consejo-menor-13
   (usuario (edad ?e&:(< ?e 13)))
   =>
   (assert (consejo (mensaje "A tu edad, NO deberías entrenar fuerza. Es mejor practicar deportes específicos y consultar con un médico antes de cualquier programa de ejercicios."))))

(defrule consejo-adolescente
   (usuario (edad ?e&:(and (>= ?e 13) (<= ?e 17))))
   =>
   (assert (consejo (mensaje "Como adolescente, es fundamental entrenar bajo supervisión de un entrenador calificado que te enseñe las técnicas correctas para no afectar tu crecimiento."))))

(defrule consejo-adulto-joven
   (usuario (edad ?e&:(and (>= ?e 18) (<= ?e 39))))
   =>
   (assert (consejo (mensaje "Estás en la mejor etapa para ganar masa muscular. Entrena con intensidad y realiza semanas de descarga cada 6-8 semanas para optimizar recuperación."))))

(defrule consejo-adulto-mayor
   (usuario (edad ?e&:(> ?e 39)))
   =>
   (assert (consejo (mensaje "A tu edad, ten cuidado con las cargas pesadas. Realiza semanas de descarga más frecuentemente (cada 4-6 semanas) para proteger articulaciones y tendones."))))

(defrule consejo-hidratacion
   =>
   (assert (consejo (mensaje "Mantén una hidratación constante durante todo el día, no solo durante el entrenamiento."))))

(defrule consejo-descanso
   =>
   (assert (consejo (mensaje "El descanso es crucial. Asegúrate de dormir las horas recomendadas para tu recuperación."))))

(defrule consejo-consistencia
   =>
   (assert (consejo (mensaje "La consistencia es clave. Los resultados vienen con el tiempo y la dedicación."))))

