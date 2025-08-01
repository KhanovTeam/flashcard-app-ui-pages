import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './components/AuthProvider.tsx';
import {LoginPage} from './components/LoginPage';
import {Home} from './components/Home.tsx';
import {PrivateRoute} from './components/PrivateRoute.tsx';
import RegisterPage from './components/RegisterPage';
import { MySets } from './components/MySets.tsx';
import { Layout } from './components/Layout';
import FlashcardSetForm from './components/FlashcardSetForm.tsx';
import { FlashcardSet } from './components/FlashcardSet.tsx';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route element={<Layout />}>
                        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>}/>
                        <Route path="/my-sets" element={<PrivateRoute><MySets /></PrivateRoute>}/>
                        <Route path="/add-flashcard-set" element={<PrivateRoute><FlashcardSetForm /></PrivateRoute>} />
                        <Route path="/flashcard-set/:id" element={<PrivateRoute><FlashcardSet /></PrivateRoute>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
