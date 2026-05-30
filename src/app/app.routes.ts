import { Routes } from '@angular/router';
import { Explore } from './explore/explore';
import { Settings } from './settings/settings'; // <-- Importamos el nuevo componente

export const routes: Routes = [
  { 
    path: 'explore', 
    component: Explore 
  },
  { 
    path: 'settings', 
    component: Settings // <-- Añadimos la ruta
  },
  { 
    path: '', 
    redirectTo: 'explore', 
    pathMatch: 'full' 
  }
];