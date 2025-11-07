import { useState } from 'react'
import { Card, CardBody, CardHeader, Input, Select, SelectItem, Button, Textarea } from '@nextui-org/react'
import { getRecommendations } from '../api'
import { UserInput, Recommendation } from '../types'

interface UserFormProps {
  setRecommendations: (recs: Recommendation) => void
  setLoading: (loading: boolean) => void
  loading: boolean
}

export default function UserForm({ setRecommendations, setLoading, loading }: UserFormProps) {
  const [formData, setFormData] = useState<UserInput>({
    nombre: '',
    edad: 25,
    sexo: 'masculino',
    peso: 70,
    altura: 170,
    nivel_fitness: 'novato',
    objetivo: 'ganar_musculo',
    frecuencia_semanal: 3,
    acceso_equipamiento: 'gimnasio_completo',
    lesion: {
      tipo: 'ninguna',
      zona: 'ninguna'
    }
  })

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const recommendations = await getRecommendations(formData)
      setRecommendations(recommendations)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al obtener recomendaciones')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full bg-white/95 backdrop-blur shadow-2xl">
      <CardHeader className="flex flex-col gap-2 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-2xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Sistema Experto de Fitness</h1>
            <p className="text-gray-600 mt-1">Obtén recomendaciones personalizadas basadas en tu perfil y objetivos</p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              variant="bordered"
              startContent={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            <Input
              type="number"
              label="Edad"
              value={formData.edad.toString()}
              onChange={(e) => setFormData({ ...formData, edad: parseInt(e.target.value) || 0 })}
              required
              variant="bordered"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Sexo"
              selectedKeys={[formData.sexo]}
              onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
              variant="bordered"
            >
              <SelectItem key="masculino" value="masculino">Masculino</SelectItem>
              <SelectItem key="femenino" value="femenino">Femenino</SelectItem>
            </Select>

            <Input
              type="number"
              label="Peso (kg)"
              value={formData.peso.toString()}
              onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) || 0 })}
              required
              variant="bordered"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="number"
              label="Altura (cm)"
              value={formData.altura.toString()}
              onChange={(e) => setFormData({ ...formData, altura: parseFloat(e.target.value) || 0 })}
              required
              variant="bordered"
            />

            <Select
              label="Nivel de Fitness"
              selectedKeys={[formData.nivel_fitness]}
              onChange={(e) => setFormData({ ...formData, nivel_fitness: e.target.value })}
              variant="bordered"
              description="Selecciona tu nivel de experiencia en entrenamiento"
              startContent={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            >
              <SelectItem key="novato" value="novato">
                Novato - Menos de 6 meses entrenando
              </SelectItem>
              <SelectItem key="intermedio" value="intermedio">
                Intermedio - 6 meses a 2 años de experiencia
              </SelectItem>
              <SelectItem key="avanzado" value="avanzado">
                Avanzado - Más de 2 años entrenando
              </SelectItem>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="number"
              label="Frecuencia de Entrenamiento (días/semana)"
              value={formData.frecuencia_semanal.toString()}
              onChange={(e) => setFormData({ ...formData, frecuencia_semanal: parseInt(e.target.value) || 0 })}
              required
              min={1}
              max={7}
              variant="bordered"
              startContent={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />

            <Select
              label="Objetivo Principal"
              selectedKeys={[formData.objetivo]}
              onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
              variant="bordered"
              startContent={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              }
            >
              <SelectItem key="ganar_musculo" value="ganar_musculo">Ganar Músculo</SelectItem>
              <SelectItem key="perder_grasa" value="perder_grasa">Perder Grasa</SelectItem>
              <SelectItem key="mantenimiento" value="mantenimiento">Mantenimiento</SelectItem>
            </Select>
          </div>

          <Select
            label="Acceso a Equipamiento"
            selectedKeys={[formData.acceso_equipamiento]}
            onChange={(e) => setFormData({ ...formData, acceso_equipamiento: e.target.value })}
            variant="bordered"
            startContent={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          >
            <SelectItem key="gimnasio_completo" value="gimnasio_completo">Gimnasio Completo</SelectItem>
            <SelectItem key="peso_corporal" value="peso_corporal">Peso Corporal</SelectItem>
            <SelectItem key="entrenamiento_casa" value="entrenamiento_casa">Entrenamiento en Casa</SelectItem>
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Tipo de Lesión"
              selectedKeys={[formData.lesion?.tipo || 'ninguna']}
              onChange={(e) => {
                const newTipo = e.target.value
                setFormData({ 
                  ...formData, 
                  lesion: { 
                    tipo: newTipo,
                    zona: newTipo === 'ninguna' ? 'ninguna' : formData.lesion?.zona 
                  } 
                })
              }}
              variant="bordered"
              description="Selecciona si tienes alguna lesión o molestia"
            >
              <SelectItem key="ninguna" value="ninguna">Ninguna</SelectItem>
              <SelectItem key="lesion" value="lesion">Lesión</SelectItem>
              <SelectItem key="quiebre" value="quiebre">Quiebre/Fractura</SelectItem>
              <SelectItem key="fisura" value="fisura">Fisura</SelectItem>
              <SelectItem key="desgarro" value="desgarro">Desgarro Muscular</SelectItem>
              <SelectItem key="molestia" value="molestia">Molestia</SelectItem>
              <SelectItem key="dolor" value="dolor">Dolor</SelectItem>
            </Select>

            <Select
              label={formData.lesion?.tipo === 'desgarro' ? 'Músculo Afectado' : 'Zona Afectada'}
              selectedKeys={[formData.lesion?.zona || 'ninguna']}
              onChange={(e) => setFormData({ ...formData, lesion: { ...formData.lesion, zona: e.target.value } })}
              variant="bordered"
              description={
                formData.lesion?.tipo === 'desgarro' 
                  ? 'Selecciona el músculo con desgarro'
                  : formData.lesion?.tipo === 'molestia' || formData.lesion?.tipo === 'dolor'
                    ? 'Selecciona músculo o articulación'
                    : 'Selecciona la zona afectada'
              }
              isDisabled={formData.lesion?.tipo === 'ninguna'}
            >
              <SelectItem key="ninguna" value="ninguna">Ninguna</SelectItem>
              
              {/* Músculos - para desgarro, molestia, dolor */}
              {(formData.lesion?.tipo === 'desgarro' || formData.lesion?.tipo === 'molestia' || formData.lesion?.tipo === 'dolor') && (
                <>
                  <SelectItem key="biceps" value="biceps">💪 Bíceps</SelectItem>
                  <SelectItem key="triceps" value="triceps">💪 Tríceps</SelectItem>
                  <SelectItem key="pectoral" value="pectoral">💪 Pectoral</SelectItem>
                  <SelectItem key="dorsales" value="dorsales">💪 Dorsales</SelectItem>
                  <SelectItem key="deltoides" value="deltoides">💪 Deltoides (Hombro)</SelectItem>
                  <SelectItem key="cuadriceps" value="cuadriceps">💪 Cuádriceps</SelectItem>
                  <SelectItem key="femorales" value="femorales">💪 Femorales (Isquios)</SelectItem>
                  <SelectItem key="gemelos" value="gemelos">💪 Gemelos</SelectItem>
                </>
              )}
              
              {/* Articulaciones - solo para molestia y dolor */}
              {(formData.lesion?.tipo === 'molestia' || formData.lesion?.tipo === 'dolor') && (
                <>
                  <SelectItem key="hombro" value="hombro">🦴 Hombro</SelectItem>
                  <SelectItem key="codo" value="codo">🦴 Codo</SelectItem>
                  <SelectItem key="muneca" value="muneca">🦴 Muñeca</SelectItem>
                  <SelectItem key="cadera" value="cadera">🦴 Cadera</SelectItem>
                  <SelectItem key="rodilla" value="rodilla">🦴 Rodilla</SelectItem>
                  <SelectItem key="tobillo" value="tobillo">🦴 Tobillo</SelectItem>
                </>
              )}
              
              {/* Zonas generales - para lesión, quiebre, fisura */}
              {(formData.lesion?.tipo === 'lesion' || formData.lesion?.tipo === 'quiebre' || formData.lesion?.tipo === 'fisura') && (
                <>
                  <SelectItem key="hombro" value="hombro">Hombro</SelectItem>
                  <SelectItem key="codo" value="codo">Codo</SelectItem>
                  <SelectItem key="muneca" value="muneca">Muñeca</SelectItem>
                  <SelectItem key="espalda_baja" value="espalda_baja">Espalda Baja</SelectItem>
                  <SelectItem key="cadera" value="cadera">Cadera</SelectItem>
                  <SelectItem key="rodilla" value="rodilla">Rodilla</SelectItem>
                  <SelectItem key="tobillo" value="tobillo">Tobillo</SelectItem>
                </>
              )}
            </Select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg"
            isLoading={loading}
            startContent={
              !loading && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              )
            }
          >
            {loading ? 'Generando Recomendaciones...' : 'Obtener Recomendaciones'}
          </Button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Las recomendaciones son orientativas. Consulta con un profesional de la salud antes de comenzar cualquier programa de ejercicios.
        </p>
      </CardBody>
    </Card>
  )
}

