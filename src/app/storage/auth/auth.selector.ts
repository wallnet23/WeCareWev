import { createFeatureSelector, createSelector } from '@ngrx/store';
import { User } from './user.model';

export const selectAuthState = createFeatureSelector<User>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: User) => { return state } 
);

export const isAuthenticated = createSelector(
  selectAuthState,
  (state: User) => { 
    return state.isAuthenticated;
  }
);