import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0/client';

export const AuthMethod = { None: "none", Auth0: "auth0" };

export const getAuthMethod = () => process.env.NEXT_PUBLIC_AUTH_METHOD;

export const getUser = () => {
    if (getAuthMethod() === AuthMethod.Auth0) {
      return useUser();
    } else {
      return {
        user: {
          name: 'Anonymous Neoconverse User',
          email: 'anon.neoconverse@neo4j.com',
        },
        error: null, 
        isLoading: false
      }
    }
}

export const securePage = (Component) => {

    let component = null;
    console.log(`securePage getAuthMethod: ${getAuthMethod()}`);
    if (getAuthMethod() === AuthMethod.Auth0) {
        console.log('securePage Auth0 on, Component wrapped with withPageAuthRequired')
        component = withPageAuthRequired(Component) 
    } else {
        console.log('securePage Auth0 off, returning unwrapped component')
        component = Component
    }
    
    return component;
}
  
  

