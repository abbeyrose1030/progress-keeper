import { useState, useEffect } from 'react'
import ProgressSlider from './components/ProgressSlider'
import './App.css'

interface Client {
  id: string;
  name: string;
  progress: number;
  notes: string;
}

interface AppProps {
  title?: string;
}

const STORAGE_KEY = 'progress-tracker-data';
const TITLE_STORAGE_KEY = 'progress-tracker-title';

const defaultClients: Client[] = [
  { id: '1', name: 'Acme Corp Website', progress: 0, notes: '' },
  { id: '2', name: 'TechStart Mobile App', progress: 0, notes: '' },
  { id: '3', name: 'Global Finance Dashboard', progress: 0, notes: '' },
  { id: '4', name: 'EcoShop E-commerce', progress: 0, notes: '' },
  { id: '5', name: 'HealthTrack Platform', progress: 0, notes: '' },
  { id: '6', name: 'SmartHome Integration', progress: 0, notes: '' },
  { id: '7', name: 'EduLearn Platform', progress: 0, notes: '' },
  { id: '8', name: 'FoodDelivery App', progress: 0, notes: '' },
  { id: '9', name: 'FitnessTracker Pro', progress: 0, notes: '' },
  { id: '10', name: 'TravelPlanner System', progress: 0, notes: '' },
  { id: '11', name: 'RealEstate Portal', progress: 0, notes: '' },
  { id: '12', name: 'EventManager Suite', progress: 0, notes: '' },
];

function App({ title = 'Your Project Here' }: AppProps) {
  const [clients, setClients] = useState<Client[]>(() => {
    // Load data from localStorage on initial render
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : defaultClients;
  });

  const [currentTitle, setCurrentTitle] = useState(() => {
    const savedTitle = localStorage.getItem(TITLE_STORAGE_KEY);
    return savedTitle || title;
  });

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(currentTitle);

  // Save to localStorage whenever clients data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  // Save title to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(TITLE_STORAGE_KEY, currentTitle);
  }, [currentTitle]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditedTitle(currentTitle);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleSubmit = () => {
    if (editedTitle.trim()) {
      setCurrentTitle(editedTitle);
    } else {
      setEditedTitle(currentTitle);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditedTitle(currentTitle);
      setIsEditingTitle(false);
    }
  };

  const handleProgressChange = (clientId: string, progress: number) => {
    setClients(clients.map(client => 
      client.id === clientId ? { ...client, progress } : client
    ));
  };

  const handleNameChange = (clientId: string, newName: string) => {
    setClients(clients.map(client => 
      client.id === clientId ? { ...client, name: newName } : client
    ));
  };

  const handleNotesChange = (clientId: string, newNotes: string) => {
    setClients(clients.map(client => 
      client.id === clientId ? { ...client, notes: newNotes } : client
    ));
  };

  return (
    <div className="app">
      <div className="title-container">
        {isEditingTitle ? (
          <input
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleSubmit}
            onKeyDown={handleTitleKeyPress}
            className="title-input"
            autoFocus
          />
        ) : (
          <h1 onClick={handleTitleClick} className="editable-title">
            {currentTitle}
          </h1>
        )}
      </div>
      <div className="sliders-container">
        {clients.map(client => (
          <ProgressSlider
            key={client.id}
            clientName={client.name}
            initialProgress={client.progress}
            initialNotes={client.notes}
            onProgressChange={(progress) => handleProgressChange(client.id, progress)}
            onNameChange={(newName) => handleNameChange(client.id, newName)}
            onNotesChange={(notes) => handleNotesChange(client.id, notes)}
          />
        ))}
      </div>
    </div>
  )
}

export default App
