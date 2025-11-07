# 🧠 Sistema de Reglas CLIPS - Explicación Detallada

## ¿Qué es CLIPS?

CLIPS (C Language Integrated Production System) es un motor de sistemas expertos basado en reglas. Permite implementar lógica de inferencia para tomar decisiones basadas en hechos y condiciones.

## Templates Definidos

### 1. Template `usuario`
Almacena toda la información del usuario:
- **nombre**: Nombre del usuario
- **edad**: Edad en años
- **sexo**: masculino o femenino
- **peso**: Peso en kilogramos
- **altura**: Altura en centímetros
- **nivel**: novato, intermedio, o avanzado
- **objetivo**: ganar_musculo, perder_grasa, o mantenimiento
- **frecuencia**: Días de entrenamiento por semana
- **equipamiento**: gimnasio_completo, peso_corporal, o entrenamiento_casa
- **lesiones**: Descripción de lesiones o limitaciones

### 2. Template `resultados`
Almacena los cálculos y recomendaciones:
- **imc**: Índice de Masa Corporal
- **tmb**: Tasa Metabólica Basal (calorías que quemas en reposo)
- **calorias**: Calorías diarias recomendadas
- **proteinas**: Gramos de proteína al día
- **carbohidratos**: Gramos de carbohidratos al día
- **grasas**: Gramos de grasas al día
- **agua**: Litros de agua al día
- **sueno**: Horas de sueño recomendadas
- **comidas**: Número de comidas al día
- **imc-categoria**: Clasificación del IMC

### 3. Template `plan-entrenamiento`
Define el tipo de rutina:
- **tipo-split**: Full Body, Upper/Lower, o Push/Pull/Legs
- **dias-por-semana**: Frecuencia de entrenamiento

### 4. Template `consejo`
Almacena consejos personalizados:
- **mensaje**: Texto del consejo

## Reglas Principales

### 📊 Cálculo de IMC

```clips
(defrule calcular-imc ...)
```

**Función**: Calcula el Índice de Masa Corporal usando la fórmula:
```
IMC = peso (kg) / [altura (m)]²
```

**Categorías**:
- Bajo Peso: < 18.5
- Peso Normal: 18.5 - 24.9
- Sobrepeso: 25 - 29.9
- Obesidad: ≥ 30

### 🔥 Cálculo de TMB (Tasa Metabólica Basal)

#### Para Hombres:
```
TMB = (10 × peso) + (6.25 × altura) - (5 × edad) + 5
```

#### Para Mujeres:
```
TMB = (10 × peso) + (6.25 × altura) - (5 × edad) - 161
```

Estas fórmulas son la ecuación de Mifflin-St Jeor, considerada una de las más precisas.

### 🍽️ Cálculo de Calorías

Las calorías se calculan multiplicando el TMB por un factor de actividad:

#### Ganar Músculo:
- 3-4 días: TMB × 1.5 + 300 calorías
- 5+ días: TMB × 1.7 + 300 calorías

#### Perder Grasa:
- 3-4 días: TMB × 1.4 - 500 calorías
- 5+ días: TMB × 1.6 - 500 calorías

#### Mantenimiento:
- 3-4 días: TMB × 1.5
- 5+ días: TMB × 1.65

### 🥩 Cálculo de Macronutrientes

#### Proteínas:
- **Ganar músculo**: 2.2g por kg de peso corporal
- **Perder grasa**: 2.4g por kg de peso corporal
- **Mantenimiento**: 2.0g por kg de peso corporal

#### Grasas:
- **Ganar músculo**: 1.0g por kg de peso corporal
- **Perder grasa**: 0.8g por kg de peso corporal
- **Mantenimiento**: 1.0g por kg de peso corporal

#### Carbohidratos:
Se calculan con las calorías restantes:
```
Carbohidratos (g) = (Calorías totales - Proteínas×4 - Grasas×9) / 4
```

**Por qué estos valores:**
- Proteínas: 4 calorías por gramo
- Grasas: 9 calorías por gramo
- Carbohidratos: 4 calorías por gramo

### 💧 Agua y Sueño

#### Agua:
- Base: 35ml por kg de peso corporal
- Más activo (5+ días): +500ml adicionales

#### Sueño:
- Base: 8 horas
- Muy activo (6+ días): 9 horas

### 🏋️ Plan de Entrenamiento

#### Full Body (< 4 días/semana):
- Todo el cuerpo en cada sesión
- Ideal para principiantes
- Máxima frecuencia de estímulo

#### Upper/Lower (4-5 días/semana):
- Día 1: Parte superior
- Día 2: Parte inferior
- Día 3: Parte superior
- Día 4: Parte inferior
- Balance entre volumen y frecuencia

#### Push/Pull/Legs (6 días/semana):
- Push: Pecho, hombros, tríceps
- Pull: Espalda, bíceps
- Legs: Piernas, core
- Máximo volumen por grupo muscular

### 💡 Sistema de Consejos

Los consejos se generan automáticamente basándose en:

1. **IMC**: Consejos sobre peso saludable
2. **Objetivo**: Estrategias específicas para tu meta
3. **Nivel**: Recomendaciones según experiencia
4. **Generales**: Hidratación, consistencia, descanso

## Ejemplo de Ejecución

### Input:
```python
{
  "nombre": "Juan",
  "edad": 25,
  "sexo": "masculino",
  "peso": 70,
  "altura": 170,
  "nivel_fitness": "intermedio",
  "objetivo": "ganar_musculo",
  "frecuencia_semanal": 4,
  "acceso_equipamiento": "gimnasio_completo"
}
```

### Proceso CLIPS:

1. **Assert usuario fact** ✓
2. **Calcular IMC**: 70 / (1.7)² = 24.2 → Peso Normal ✓
3. **Calcular TMB**: (10×70) + (6.25×170) - (5×25) + 5 = 1,743 kcal ✓
4. **Calcular calorías**: 1,743 × 1.5 + 300 = 2,914 kcal ✓
5. **Calcular macros**:
   - Proteínas: 70 × 2.2 = 154g
   - Grasas: 70 × 1.0 = 70g
   - Carbos: (2,914 - 616 - 630) / 4 = 417g ✓
6. **Agua**: (70 × 35) / 1000 = 2.45L ✓
7. **Sueño**: 8 horas ✓
8. **Plan**: Upper/Lower (4 días) ✓
9. **Consejos**: Ganar músculo + Intermedio + Generales ✓

### Output:
```json
{
  "imc": 24.2,
  "calorias": 2914,
  "proteinas": 154,
  "carbohidratos": 417,
  "grasas": 70,
  "agua": 2.45,
  "sueno": 8,
  "plan": "Upper/Lower",
  "consejos": [...]
}
```

## Ventajas del Sistema CLIPS

1. **Separación de lógica**: Las reglas están separadas del código
2. **Fácil mantenimiento**: Modificar reglas sin cambiar código Python
3. **Transparencia**: Las decisiones son explicables
4. **Escalabilidad**: Fácil agregar nuevas reglas
5. **Sistema experto real**: Usa técnicas de IA simbólica

## Modificar las Reglas

Para modificar el comportamiento del sistema, edita `backend/clips_rules.clp`:

```clips
;; Ejemplo: Cambiar calorías para ganar músculo
(defrule calcular-calorias-ganar-musculo
   (usuario (objetivo ganar_musculo) (frecuencia ?f))
   ?r <- (resultados (tmb ?tmb&:(> ?tmb 0)) (calorias 0))
   =>
   (bind ?factor 1.5)
   (if (>= ?f 5) then (bind ?factor 1.7))
   (bind ?calorias (round (* ?tmb ?factor)))
   (bind ?calorias (+ ?calorias 500))  ; Cambiado de 300 a 500
   (modify ?r (calorias ?calorias)))
```

¡El sistema se actualizará automáticamente!


