import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'; // Firebase core
import { provideAuth, getAuth } from '@angular/fire/auth'; // Optional: For authentication
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; // Optional: For Firestore
import { environment } from '../enviroments/enviroment'; // Adjust path if necessary

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)), // Initialize Firebase
    provideAuth(() => getAuth()), // Optional
    provideFirestore(() => getFirestore()), // Optional
  ]
};
