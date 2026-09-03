# Sistema de Cálculo de Puntajes y Rating de Jugadores (Tukas v2)

Este documento detalla de manera exhaustiva y matemática cómo se calculan las estadísticas, los puntajes y la **media global (rating)** de las cartas de jugador en Tukas v2, diferenciando claramente entre **Jugadores de Campo** y **Arqueros**.

---

## 📌 1. Requisitos Previos y Condiciones Generales

1. **Estado de Partidos**:
   - Solo se computan partidos cuyo estado sea finalizado (`status === 'played'`).
   - Los partidos programados (`scheduled`) o cancelados (`cancelled`) son ignorados por completo.
2. **Asistencia**:
   - Solo se contabiliza la participación si el jugador asistió al encuentro (`attended === true`).
3. **Mínimo de Partidos para Clasificar (Media/Rating)**:
   - Para obtener una media calculada en su carta, el jugador debe contar con al menos **`RATING_MIN_MATCHES = 3` partidos jugados**.
   - Si tiene menos de 3 partidos o no hay partidos jugados en el grupo, su media figurará como no clasificada (`--`, Tier *Sin Clasificar*).
4. **Identificación de la Posición**:
   - Se toma el campo `position` de la tabla `user_profiles` utilizando la función `isGoalkeeper(position)`.
   - Se considera **Arquero** si la posición es `"Arquero"`, `"Portero"` o `"Goalkeeper"` (insensible a mayúsculas/minúsculas). De lo contrario, se procesa como **Jugador de Campo**.

---

## ⚽ 2. Jugadores de Campo

Las cartas de los jugadores de campo se enfocan en su capacidad ofensiva, regularidad y victorias.

### A. Estadísticas Mostradas en la Carta (Grid 2x2)

| Indicador | Label | Descripción | Formato |
| :--- | :---: | :--- | :---: |
| **Goles por Partido** | `GOL` | Promedio de goles marcados por partido: `goles / partidos_jugados` | `0.0` (1 decimal) |
| **Puntos de Tabla** | `PTS` | Puntos acumulados según resultados: `(victorias × 3) + (empates × 1)` | Entero |
| **Porcentaje de Victorias** | `VIC` | Porcentaje de partidos ganados: `(victorias / partidos_jugados) × 100` | Entero (`%`) |
| **Partidos Jugados** | `PJ` | Cantidad de partidos jugados y finalizados | Entero |

### B. Cálculo de la Media Global (Rating de 1 a 99)

El rating combina 3 componentes con un peso máximo teórico de 100 puntos:

$$\text{Rating} = \text{Factor de Victorias} + \text{Factor Goleador} + \text{Factor de Regularidad}$$

1. **Factor de Victorias (Máximo: 45 puntos)**:
   $$\text{winComponent} = \left(\frac{\text{Partidos Ganados}}{\text{Partidos Jugados}}\right) \times 45$$
2. **Factor Goleador (Máximo: 30 puntos)**:
   $$\text{golesPorPartido} = \frac{\text{Goles Marcados}}{\text{Partidos Jugados}}$$
   $$\text{goalComponent} = \min(\text{golesPorPartido} \times 15,\, 30)$$
   *(Nota: Se alcanza el tope de 30 puntos con 2.0 goles por partido).*
3. **Factor de Regularidad (Máximo: 25 puntos)**:
   $$\text{regularidad} = \frac{\text{Partidos Jugados por el Jugador}}{\text{Partidos del Jugador con Más Presencias de la Liga}}$$
   $$\text{regularityComponent} = \text{regularidad} \times 25$$

$$\text{Rating Final} = \max(1, \min(99, \text{round}(\text{winComponent} + \text{goalComponent} + \text{regularityComponent})))$$

---

## 🧤 3. Arqueros (Porteros)

Los arqueros cuentan con una identidad estadística defensiva propia. Se reemplaza el factor de goles por el rendimiento de goles concedidos (**Valla Menos Vencida**) y se agrega el registro de **Arcos en Cero**.

### A. Criterio de Participación como Arquero
- Para computar las estadísticas defensivas exclusivas, se consideran los partidos finalizados en los que el jugador efectivamente ocupó la posición de arquero (`pitch_position === 'gk'`).
- Los goles recibidos por el arquero corresponden a los goles anotados por el equipo rival en dicho partido:
  - Si el arquero integró el Equipo A: $\text{Goles Recibidos} = \text{score\_team\_b}$.
  - Si el arquero integró el Equipo B: $\text{Goles Recibidos} = \text{score\_team\_a}$.

### B. Tabla de Puntuación: Valla Menos Vencida (Por Partido)

Por cada partido finalizado disputado como arquero, se asignan puntos según la cantidad de goles que recibió su equipo:

| Goles Recibidos por el Equipo | Puntos Otorgados |
| :---: | :---: |
| **0 goles** (Arco en cero) | **10 puntos** |
| **1 gol** | **8 puntos** |
| **2 goles** | **6 puntos** |
| **3 goles** | **4 puntos** |
| **4 goles** | **2 puntos** |
| **5 o más goles** | **0 puntos** |

### C. Estadísticas Mostradas en la Carta del Arquero (Grid 2x2)

| Indicador | Label | Descripción | Formato |
| :--- | :---: | :--- | :---: |
| **Valla Menos Vencida** | `VMV` | Promedio de los puntos obtenidos según la tabla en todos sus partidos como arquero: $\frac{\sum \text{Puntos VMV}}{\text{Partidos como Arquero}}$ | `0.0` (1 decimal) |
| **Arcos en Cero** | `ARC` | Total de partidos finalizados como arquero con 0 goles recibidos | Entero |
| **Porcentaje de Victorias** | `VIC` | Porcentaje de partidos ganados: `(victorias / partidos_jugados) × 100` | Entero (`%`) |
| **Partidos Jugados** | `PJ` | Total de partidos jugados | Entero |

#### Ejemplo de Cálculo de VMV y ARC
Si un arquero disputó 5 partidos con los siguientes goles recibidos:
- Partido 1: 0 goles $\rightarrow$ 10 puntos (Arco en cero #1)
- Partido 2: 1 gol $\rightarrow$ 8 puntos
- Partido 3: 2 goles $\rightarrow$ 6 puntos
- Partido 4: 0 goles $\rightarrow$ 10 puntos (Arco en cero #2)
- Partido 5: 3 goles $\rightarrow$ 4 puntos

$$\text{Puntos Totales} = 10 + 8 + 6 + 10 + 4 = 38$$
$$\text{VMV} = \frac{38}{5} = 7.6 \text{ puntos}$$
$$\text{ARC} = 2 \text{ arcos en cero}$$

### D. Cálculo de la Media Global (Rating de 1 a 99 para Arqueros)

En lugar de utilizar los goles por partido, los arqueros utilizan su puntuación de **Valla Menos Vencida**:

$$\text{Rating Arquero} = \text{Factor de Victorias} + \text{Factor Defensivo (VMV)} + \text{Factor de Regularidad}$$

1. **Factor de Victorias (Máximo: 45 puntos)**:
   $$\text{winComponent} = \left(\frac{\text{Partidos Ganados}}{\text{Partidos Jugados}}\right) \times 45$$
2. **Factor Defensivo VMV (Máximo: 30 puntos)**:
   La escala de VMV va de 0 a 10 puntos. Para mantener la paridad con la escala de 30 puntos de rendimiento:
   $$\text{performanceComponent} = \min\left(\left(\frac{\text{VMV}}{10}\right) \times 30,\, 30\right) = \text{VMV} \times 3$$
   - Si $\text{VMV} = 10$ (todos vallas invictas) $\rightarrow 30$ puntos.
   - Si $\text{VMV} = 7.6 \rightarrow 22.8$ puntos.
   - Si $\text{VMV} = 0 \rightarrow 0$ puntos.
   *(Nota: Los goles que el arquero pudiera llegar a marcar personalmente no se consideran en su factor defensivo).*
3. **Factor de Regularidad (Máximo: 25 puntos)**:
   $$\text{regularityComponent} = \left(\frac{\text{Partidos Jugados por el Jugador}}{\text{Partidos del Jugador con Más Presencias}}\right) \times 25$$

$$\text{Rating Final} = \max(1, \min(99, \text{round}(\text{winComponent} + \text{performanceComponent} + \text{regularityComponent})))$$

---

## 🏆 4. Sistema de Tiers (Niveles y Apariencia de Carta)

En base al rating calculado (tanto para jugadores de campo como para arqueros), la carta adquiere un nivel visual (*Tier*):

| Tier | Rango de Rating | Aspecto Visual |
| :--- | :---: | :--- |
| **Sin Clasificar** | `--` (< 3 PJ) | Fondo grafito oscuro, opacidad atenuada, insignia sin clasificar. |
| **Bronce** | `1 - 59` | Acentos cobrizos y bronce, brillos cálidos. |
| **Plata** | `60 - 74` | Tonos platino y gris acerado metálico. |
| **Oro** | `75 - 84` | Acentos dorados clásicos brillantes. |
| **Élite** | `85 - 99` | Fondo oscuro espacial con acentos cian/azul eléctrico (estilo TOTY). |

---

## 📂 5. Referencias en el Código Fuente

- **Tipos TypeScript**: [`src/lib/types/database.ts`](../src/lib/types/database.ts) (`PlayerStats`)
- **Cálculo de Estadísticas y Puntos VMV**: [`src/lib/utils/helpers.ts`](../src/lib/utils/helpers.ts) (`calculatePlayerStats`, `getGoalkeeperMatchPoints`, `isGoalkeeper`)
- **Cálculo de Rating y Tiers**: [`src/lib/utils/rating.ts`](../src/lib/utils/rating.ts) (`calculatePlayerRating`, `getCardTier`)
- **Renderizado Visual de la Carta**: [`src/components/players/PlayerCard.tsx`](../src/components/players/PlayerCard.tsx)
- **Estilos CSS de la Carta**: [`src/app/globals.css`](../src/app/globals.css) (`.player-card`, `.player-card-stats`, `.player-card-stat`)
- **Tests Unitarios**:
  - `src/lib/utils/helpers.test.ts`
  - `src/lib/utils/rating.test.ts`
  - `src/components/players/PlayerCard.test.tsx`
