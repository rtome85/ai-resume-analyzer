import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"

export const meta = () => ([
    {title: 'Resumind | Auth'}, 
    {name: 'description', content: 'Log into your account'}
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);

    }, [auth.isAuthenticated, next])

    const handleGuestLogin = () => {
        // Set guest mode in the store
        auth.setGuestMode(true);
        // Navigate to the next page or home
        navigate(next || '/');
    }

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log In to Continue Your Job Journey</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            <button className="auth-button animate-pulse">
                                <p>Signing you in...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={auth.signOut}>
                                        <p>Log out</p>
                                    </button>
                                ) : (
                                    <>
                                        <button className="auth-button" onClick={auth.signIn}>
                                            <p>Log In</p>
                                        </button>
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-gray-300" />
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="bg-white px-2 text-gray-500">or</span>
                                            </div>
                                        </div>
                                        <button 
                                            className="auth-button bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300" 
                                            onClick={handleGuestLogin}
                                        >
                                            <p>Continue as Guest</p>
                                        </button>
                                        <p className="text-xs text-gray-500 text-center mt-2">
                                            Guest sessions are temporary and data will be lost when you close the browser
                                        </p>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth 