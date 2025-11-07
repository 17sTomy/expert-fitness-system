import { Card, CardBody, CardHeader, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip } from '@nextui-org/react'
import { Recommendation } from '../types'

interface ResultsProps {
  recommendations: Recommendation
  onReset: () => void
}

export default function Results({ recommendations, onReset }: ResultsProps) {
  const { perfil, plan_nutricional, plan_entrenamiento, consejos } = recommendations

  const getIMCColor = (categoria: string) => {
    switch (categoria) {
      case 'Bajo Peso': return 'warning'
      case 'Peso Normal': return 'success'
      case 'Sobrepeso': return 'warning'
      case 'Obesidad': return 'danger'
      default: return 'default'
    }
  }

  const getIMCPosition = (imc: number) => {
    // Rangos: <18.5 (Bajo), 18.5-25 (Normal), 25-30 (Sobrepeso), 30+ (Obesidad)
    // Anchos de barra: 18.5%, 24.9%, 20%, 36.6% (suman 100%)
    if (imc < 18.5) {
      // Rango amarillo: 0 a 18.5%
      return (imc / 18.5) * 18.5
    } else if (imc < 25) {
      // Rango verde: 18.5% a 43.4%
      const progress = (imc - 18.5) / (25 - 18.5)
      return 18.5 + (progress * 24.9)
    } else if (imc < 30) {
      // Rango naranja: 43.4% a 63.4%
      const progress = (imc - 25) / (30 - 25)
      return 43.4 + (progress * 20)
    } else {
      // Rango rojo: 63.4% a 100%
      const progress = Math.min((imc - 30) / 10, 1) // Cap at 40 IMC
      return 63.4 + (progress * 36.6)
    }
  }

  const getWorkoutTypeTooltip = (tipo: string) => {
    if (tipo.includes('Full Body')) return 'Todo el cuerpo en una sesión. Ideal para principiantes y frecuencias bajas.'
    if (tipo.includes('Upper')) return 'Tren superior: pecho, espalda, hombros y brazos.'
    if (tipo.includes('Lower')) return 'Tren inferior: piernas completas (cuádriceps, isquios, glúteos) y core.'
    if (tipo.includes('Push') || tipo.includes('Empuje')) return 'Ejercicios de empuje: pecho, hombros y tríceps.'
    if (tipo.includes('Pull') || tipo.includes('Tirón')) return 'Ejercicios de tirón: espalda y bíceps.'
    if (tipo.includes('Legs') || tipo.includes('Piernas')) return 'Piernas completas y core. Máximo volumen para tren inferior.'
    return 'Rutina de entrenamiento personalizada'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/95 backdrop-blur shadow-2xl">
        <CardBody className="p-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">¡Hola {perfil.nombre}! 👋</h1>
                <p className="text-gray-600 mt-1">Aquí están tus recomendaciones personalizadas</p>
              </div>
            </div>
            <Button
              color="default"
              variant="bordered"
              onClick={onReset}
              startContent={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
            >
              Volver
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-blue-600 font-medium">IMC</div>
              <Tooltip 
                content="Índice de Masa Corporal: relación entre peso y altura que indica si estás en un rango saludable"
                placement="top"
                showArrow
              >
                <button className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold hover:bg-blue-600 transition-colors">
                  ?
                </button>
              </Tooltip>
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-3">{perfil.imc}</div>
            <Chip color={getIMCColor(perfil.imc_categoria)} size="sm" variant="flat" className="mb-3">
              {perfil.imc_categoria}
            </Chip>
            
            {/* IMC Visual Bar */}
            <div className="mt-3 space-y-1">
              {/* Números arriba */}
              <div className="flex justify-between text-[9px] text-gray-600 font-medium">
                <span>0</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
              
              {/* Barra de colores con tooltips */}
              <div className="flex h-2 rounded-full overflow-hidden shadow-sm border border-blue-100">
                <Tooltip content="Bajo Peso (< 18.5)" placement="bottom" showArrow>
                  <div className="bg-yellow-400 hover:brightness-110 transition-all cursor-help" style={{width: '18.5%'}}></div>
                </Tooltip>
                <Tooltip content="Peso Normal (18.5 - 25)" placement="bottom" showArrow>
                  <div className="bg-green-500 hover:brightness-110 transition-all cursor-help" style={{width: '24.9%'}}></div>
                </Tooltip>
                <Tooltip content="Sobrepeso (25 - 30)" placement="bottom" showArrow>
                  <div className="bg-orange-400 hover:brightness-110 transition-all cursor-help" style={{width: '20%'}}></div>
                </Tooltip>
                <Tooltip content="Obesidad (> 30)" placement="bottom" showArrow>
                  <div className="bg-red-500 hover:brightness-110 transition-all cursor-help" style={{width: '36.6%'}}></div>
                </Tooltip>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <CardBody className="p-6">
            <div className="text-sm text-purple-600 font-medium mb-1">Nivel</div>
            <div className="text-3xl font-bold text-purple-700 mb-1">{perfil.nivel}</div>
            <div className="text-xs text-purple-600">
              {perfil.nivel === 'Novato' && 'Menos de 6 meses'}
              {perfil.nivel === 'Intermedio' && '6 meses - 2 años'}
              {perfil.nivel === 'Avanzado' && 'Más de 2 años'}
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <CardBody className="p-6">
            <div className="text-sm text-green-600 font-medium mb-1">Frecuencia</div>
            <div className="text-3xl font-bold text-green-700">{perfil.frecuencia}</div>
            <div className="text-xs text-green-600 mt-1">por semana</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <CardBody className="p-6">
            <div className="text-sm text-orange-600 font-medium mb-1">Objetivo</div>
            <div className="text-lg font-bold text-orange-700 mb-1">{perfil.objetivo}</div>
            <div className="text-xs text-orange-600">
              {perfil.objetivo === 'Ganar Músculo' && 'Hipertrofia muscular'}
              {perfil.objetivo === 'Perder Grasa' && 'Déficit calórico'}
              {perfil.objetivo === 'Mantenimiento' && 'Mantener forma física'}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Nutritional Plan */}
      <Card className="bg-white/95 backdrop-blur shadow-xl">
        <CardHeader className="pb-4 pt-6 px-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Plan Nutricional Diario</h2>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                <span className="text-sm font-medium text-red-700">Calorías Diarias</span>
              </div>
              <div className="text-3xl font-bold text-red-600">{plan_nutricional.calorias_diarias}</div>
              <div className="text-xs text-red-600 mt-1">kcal/día</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span className="text-sm font-medium text-blue-700">Agua Diaria</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">{plan_nutricional.agua_diaria}L</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className="text-sm font-medium text-purple-700">Horas de Sueño</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">{plan_nutricional.horas_sueno}</div>
              <div className="text-xs text-purple-600 mt-1">horas por noche</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-yellow-700">Comidas</span>
              </div>
              <div className="text-3xl font-bold text-yellow-600">{plan_nutricional.comidas}</div>
              <div className="text-xs text-yellow-600 mt-1">comidas/día</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Distribución de Macronutrientes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-gray-600">Proteínas</div>
                  <Tooltip 
                    content="Esenciales para construcción muscular y recuperación. 4 kcal por gramo."
                    placement="top"
                    showArrow
                  >
                    <button className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold hover:bg-red-600">
                      ?
                    </button>
                  </Tooltip>
                </div>
                <div className="text-2xl font-bold text-red-600">{plan_nutricional.proteinas}g</div>
                <div className="text-xs text-gray-500 mt-1">{Math.round((plan_nutricional.proteinas * 4 / plan_nutricional.calorias_diarias) * 100)}% del total</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-gray-600">Carbohidratos</div>
                  <Tooltip 
                    content="Principal fuente de energía para entrenamientos intensos. 4 kcal por gramo."
                    placement="top"
                    showArrow
                  >
                    <button className="w-4 h-4 rounded-full bg-yellow-500 text-white flex items-center justify-center text-[10px] font-bold hover:bg-yellow-600">
                      ?
                    </button>
                  </Tooltip>
                </div>
                <div className="text-2xl font-bold text-yellow-600">{plan_nutricional.carbohidratos}g</div>
                <div className="text-xs text-gray-500 mt-1">{Math.round((plan_nutricional.carbohidratos * 4 / plan_nutricional.calorias_diarias) * 100)}% del total</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-gray-600">Grasas</div>
                  <Tooltip 
                    content="Necesarias para hormonas y absorción de vitaminas. 9 kcal por gramo."
                    placement="top"
                    showArrow
                  >
                    <button className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold hover:bg-green-600">
                      ?
                    </button>
                  </Tooltip>
                </div>
                <div className="text-2xl font-bold text-green-600">{plan_nutricional.grasas}g</div>
                <div className="text-xs text-gray-500 mt-1">{Math.round((plan_nutricional.grasas * 9 / plan_nutricional.calorias_diarias) * 100)}% del total</div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Workout Plan */}
      <Card className="bg-white/95 backdrop-blur shadow-xl">
        <CardHeader className="pb-4 pt-6 px-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Plan de Entrenamiento</h2>
          </div>
        </CardHeader>
        <CardBody className="p-6 space-y-6">
          {plan_entrenamiento.map((dia, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {dia.dia}: {dia.tipo}
                </h3>
                <Tooltip content={getWorkoutTypeTooltip(dia.tipo)} placement="left" showArrow>
                  <button className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold">
                    ?
                  </button>
                </Tooltip>
              </div>
              <div className="overflow-x-auto">
                <Table removeWrapper aria-label={`Ejercicios ${dia.dia}`}>
                  <TableHeader>
                    <TableColumn className="bg-gray-50 text-gray-700 font-semibold">EJERCICIO</TableColumn>
                    <TableColumn className="bg-gray-50 text-gray-700 font-semibold text-center">SERIES</TableColumn>
                    <TableColumn className="bg-gray-50 text-gray-700 font-semibold text-center">REPS</TableColumn>
                    <TableColumn className="bg-gray-50 text-gray-700 font-semibold text-center">DESCANSO</TableColumn>
                    <TableColumn className="bg-gray-50 text-gray-700 font-semibold">NOTAS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {dia.ejercicios.map((ejercicio, exIndex) => (
                      <TableRow key={exIndex}>
                        <TableCell className="font-medium text-gray-800">{ejercicio.ejercicio}</TableCell>
                        <TableCell className="text-center">
                          <Chip color="primary" size="sm" variant="flat">{ejercicio.series}</Chip>
                        </TableCell>
                        <TableCell className="text-center">
                          <Chip color="secondary" size="sm" variant="flat">{ejercicio.reps}</Chip>
                        </TableCell>
                        <TableCell className="text-center text-gray-600">{ejercicio.descanso}</TableCell>
                        <TableCell className="text-gray-500 text-sm">{ejercicio.notas || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Consejos */}
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 shadow-xl">
        <CardHeader className="pb-4 pt-6 px-6 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-amber-800">Consejos Personalizados</h2>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 gap-3">
            {consejos.map((consejo, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-amber-200 flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-lg mt-0.5">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 flex-1">{consejo}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Footer */}
      <div className="text-center pb-8">
        <Button
          color="primary"
          size="lg"
          onClick={onReset}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
          startContent={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
        >
          Nueva Consulta
        </Button>
      </div>
    </div>
  )
}

