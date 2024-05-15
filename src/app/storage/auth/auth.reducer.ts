import { createReducer, on } from '@ngrx/store';
import { login, logout} from './auth.actions';
import { User } from './user.model';

export const initialState: User = {
    email: 'none',
    password: 'none',
    authorizations: 'none',
    isAuthenticated: false
}

export const authReducer = createReducer(
    initialState,
    on(login, (state, action) => ({...state, 
        email: action.username,
        password: action.password,
        authorizations: action.authorizations,
        isAuthenticated: true })),
    on(logout, state => ({...state, email: 'none', password: 'none', authorizations: 'none', isAuthenticated: false}))
)