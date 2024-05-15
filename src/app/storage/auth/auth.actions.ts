import { createAction, props } from '@ngrx/store'

export const login = createAction(
    '[Auth] Login',
    props<{ username: string; password: string, authorizations: string }>()
  );

export const logout = createAction('[Auth] logout');