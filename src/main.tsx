
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Apply Minecraft font to the entire application
document.body.classList.add('font-minecraft', 'minecraft-text');

createRoot(document.getElementById("root")!).render(<App />);
