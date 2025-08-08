import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormBuilderPage from './features/formBuilder/FormBuilderPage';
import FormPreviewPage from './features/formPreview/FormPreviewPage';
import MyFormsPage from './features/myForms/MyFormsPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';

const theme = createTheme();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<FormBuilderPage />} />
              <Route path="/create" element={<FormBuilderPage />} />
              <Route path="/preview" element={<FormPreviewPage />} />
              <Route path="/preview/:formId" element={<FormPreviewPage />} />
              <Route path="/myforms" element={<MyFormsPage />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;