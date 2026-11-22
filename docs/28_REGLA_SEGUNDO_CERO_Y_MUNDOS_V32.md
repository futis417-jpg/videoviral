# ⚡ REGLA DEL SEGUNDO 0 + 6 MUNDOS Y 6 PERSONAJES NUEVOS (v32)

## 1. SE DEBE ENTENDER DE QUÉ TRATA EL VÍDEO DESDE EL SEGUNDO 0 (`V32.Frame0`)
Un usuario en TikTok/Reels decide en **0.4 segundos** si desliza o se queda.
**PROHIBIDO** empezar en negro o con un personaje hablando sin contexto visual.
En `t = 0.00s` (Frame 0) DEBE aparecer inmediatamente:
1. **El mundo/escena o prop protagonista** del tema (ej. aula, espacio, hospital, supermercado, coche en agua).
2. **Un titular de claridad instantánea** usando `V32.Frame0`:
   - `V32.Frame0.drawInstantTopicColdOpen(ctx, "PSICOLOGÍA", "NO HAGAS ESTO", "El truco que usa el 90%", t)`
   - `V32.Frame0.drawVsSplitHook(ctx, "LO QUE CREES", "LA REALIDAD", t)`
   - `V32.Frame0.drawSecretFileHook(ctx, "CASO #1971", "SOBREVIVIÓ A 3KM", t)`

## 2. 6 ESCENAS COMPLETAS YA HECHAS (`V32.Worlds`) + 6 PERSONAJES NUEVOS (`V32.MoreCast`)
- **Mundos listos (`V32.Worlds`):** `drawClassroomWorld`, `drawSpaceOrbitWorld`, `drawHospitalLabWorld`, `drawSupermarketWorld`, `drawCourtroomWorld`, `drawCityRooftopWorld`.
- **Personajes nuevos (`V32.MoreCast`, 12 en total con `V30.Cast`):** `drawDoctor`, `drawAstronaut`, `drawChef`, `drawStudent`, `drawPolice`, `drawRobotAI`.
- **Movimientos listos (`V32.Moves`):** `runAcross`, `popFromBottom`, `floatOrbit`, `shakePanic`, `slideInLeft`, `zoomPulse`.
