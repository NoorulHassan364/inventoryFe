import { AuthProvider } from './auth';

const ContextProvider = ({ children }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>

    )
}

export default ContextProvider;