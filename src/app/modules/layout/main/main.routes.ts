import { Route } from "@angular/router";
import { authGuard } from "../../../modules/auth/guards/auth.guard";

export const routes: Route[] = [
    {
        path: "",
        loadComponent: () => import("./main.component").then((m) => m.MainComponent),
        children: [
            {
                path: "home",
                loadComponent: () => import("../../pages/home/home.component").then((m) => m.HomeComponent)
            },
            {
                path: "login",
                loadComponent: () => import("../../auth/screens/login/login.component").then((m) => m.LoginComponent)
            },
            {
                path: "users",
                loadComponent: () => import("../../pages/users/users.component").then((m) => m.UsersComponent),
                canActivate: [authGuard]
            },
            {
                path: "",
                redirectTo: "home",
                pathMatch: "full"
            }
        ]
    }
];