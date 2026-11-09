import { app } from './app';
import { iniciarConsumidorDeEventos } from './messaging/events';

const PORT = process.env.PORT || 3001;

// Sobe o consumidor de eventos (Redis Pub/Sub) junto com o servidor
iniciarConsumidorDeEventos();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});