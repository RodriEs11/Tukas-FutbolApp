# Sistema de Rating de Jugadores (Tukas v2)

Este documento explica cómo se calcula la "media" global (estilo FIFA/EA FC) de un jugador en la aplicación y cómo funciona el sistema de niveles (tiers).

## Fórmula de Cálculo

El rating de un jugador es un número entre **1 y 99**. Se basa en tres componentes principales y requiere que el jugador haya disputado al menos **3 partidos** para poder obtener una valoración.

La fórmula otorga un peso máximo teórico de 100 puntos, distribuidos de la siguiente manera:

### 1. Factor de Victorias (Máximo: 45 puntos)
Mide el porcentaje de éxito del jugador en los partidos que ha disputado.
- **Cálculo:** `(Partidos Ganados / Partidos Jugados) × 45`
- *Ejemplo:* Si un jugador gana el 100% de sus partidos, suma 45 puntos. Si gana el 50%, suma 22.5 puntos.

### 2. Factor Goleador (Máximo: 30 puntos)
Recompensa la capacidad goleadora del jugador. Tiene un tope (cap) para evitar que los promedios irreales (ej: 5 goles por partido) rompan la escala.
- **Cálculo:** `Goles por Partido × 15` (Cerrado a un máximo de 30)
- *Ejemplo:* Para conseguir los 30 puntos completos, un jugador necesita promediar al menos 2 goles por partido. Un promedio de 1 gol por partido otorga 15 puntos.

### 3. Factor de Regularidad (Máximo: 25 puntos)
Premia a los jugadores más constantes de la liga/grupo, comparando su cantidad de partidos jugados contra el jugador que más ha jugado.
- **Cálculo:** `(Partidos Jugados por el Jugador / Partidos del Jugador con Más Presencias) × 25`
- *Ejemplo:* Si el jugador que más partidos jugó en todo el sistema tiene 20 partidos, ese jugador recibe los 25 puntos. Alguien que jugó 10 partidos recibirá 12.5 puntos.

### Cálculo Final
`Rating = Factor de Victorias + Factor Goleador + Factor de Regularidad`
*(El resultado se redondea al número entero más cercano y se limita entre 1 y 99)*

---

## Sistema de Tiers (Niveles)

Dependiendo del rating obtenido, el jugador recibe un "Tier" que cambia drásticamente el diseño visual de su carta (colores, brillos y estilos).

| Tier | Rango de Media | Descripción y Diseño |
| :--- | :---: | :--- |
| **Sin Clasificar** | `--` | Para jugadores con menos de 3 partidos. Carta gris oscura y misteriosa ("bloqueada"). |
| **Bronce** | `1 - 59` | Jugadores iniciales o de bajo rendimiento. Estilo cobrizo y marrón madera. |
| **Plata** | `60 - 74` | Jugadores promedio. Estilo gris plateado acerado. |
| **Oro** | `75 - 84` | Jugadores destacados. Diseño dorado clásico y brillante. |
| **Élite** | `85 - 99` | Los mejores jugadores de la liga. Tema premium oscuro con detalles cyan neón (estilo TOTY). |

## Consideraciones Adicionales
- El sistema penaliza indirectamente la inactividad. A medida que otros jugadores juegan más partidos, el "Jugador con Más Presencias" aumenta, haciendo que el *Factor de Regularidad* de los jugadores inactivos disminuya.
- Es muy difícil alcanzar un rating superior a 90, ya que requiere ser el goleador del equipo, mantener un alto porcentaje de victorias y jugar casi todos los partidos.
