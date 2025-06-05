import { StyleSheet } from 'react-native';

export const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Alterado para branco como no seu original, se preferir o cinza claro, use '#f0f4f7'
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30, // Mantido
  },
  logo: {
    width: 200,
    height: 180,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20, 
    alignItems: 'center', 
  },
  input: {
    height: 50, 
    width: '85%',
    borderWidth: 1,
    borderColor: '#DDD', 
    borderRadius: 10, 
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    fontSize: 16, 
  },
  loginButton: {
    height: 50,
    width: '85%', 
    backgroundColor: '#007BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
 
  loginButtonDisabled: {
    height: 50,
    width: '85%',
    backgroundColor: '#A9A9A9', 
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 1, 
  },
  biometricButton: {
    height: 50, // Mantido
    width: '85%', // Mantido
    backgroundColor: '#34C759', // Mantido (verde para biométrico)
    borderRadius: 10, // Mantido
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, // Mantido
    flexDirection: 'row', // Mantido
    gap: 10, // Mantido (ou `marginLeft: 10` para o texto/ícone se `gap` não for suportado em todas as versões)
    elevation: 3, // Mantido
  },
  // Estilo para o botão biométrico quando desabilitado
  biometricButtonDisabled: {
    height: 50,
    width: '85%',
    backgroundColor: '#b2dfdb', // Um verde mais pálido/acinzentado para desabilitado
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    gap: 10,
    elevation: 1,
  },
  buttonText: {
    color: '#FFF', // Mantido
    fontWeight: '600', // Mantido
    fontSize: 16, // Mantido
  },
  // Estilos para o link/botão de "Cadastre-se"
  registerButton: {
    marginTop: 25, // Aumentei um pouco o espaço
    paddingVertical: 10, // Adiciona uma área de toque maior
  },
  registerButtonText: {
    color: '#007BFF', // Azul para o link
    fontSize: 16,
    fontWeight: '500', // Um pouco menos de peso que o texto do botão
    textDecorationLine: 'underline', // Sublinhado para parecer mais com um link
  },
});