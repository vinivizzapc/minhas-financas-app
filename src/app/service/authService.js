import LocalStorageService from './local-storageService';

import jwt from 'jsonwebtoken';
import ApiService from '../apiservice';

export const USUARIO_LOGADO = '_usuario_logado';
export const TOKEN = 'access_token';

export default class AuthService {

    static isUsuarioAutenticado() {
        const token = LocalStorageService.obterItem(TOKEN);
        const decodedToken = jwt.decode(token);
        if(decodedToken) {
            const expiration = decodedToken.exp;
            const isTokenInvalido = Date.now() >= (expiration * 1000);
            return !isTokenInvalido;
        } else {
            return false;
        }

    }
    
    static removerUsuarioAutenticado() {
        LocalStorageService.removerItem(USUARIO_LOGADO);
        LocalStorageService.removerItem(TOKEN);
    }
    
    static logar(usuario, token) {
        LocalStorageService.adicionarItem(USUARIO_LOGADO, usuario);
        LocalStorageService.adicionarItem(TOKEN, token);
        ApiService.registrarToken(token);
    }

    static obterUsuarioAutenticado() {
        return LocalStorageService.obterItem(USUARIO_LOGADO);
    }

    static refreshSession() {
        
        const token = LocalStorageService.obterItem(TOKEN);
        const usuario = AuthService.obterUsuarioAutenticado();
        AuthService.logar(usuario, token);
        return usuario;
    }

}