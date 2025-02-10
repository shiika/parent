import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadChildren: () => import("./modules/layout/main/main.routes").then((m) => m.routes)
    }
];
