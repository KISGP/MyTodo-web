import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import App from '@/App.tsx';

import '@/styles/index.css';

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<NextUIProvider>
			<NextThemesProvider attribute='class' themes={['light', 'dark']} defaultTheme='light' enableSystem={false}>
				<App />
			</NextThemesProvider>
		</NextUIProvider>
	</BrowserRouter>
);
