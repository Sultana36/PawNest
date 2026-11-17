import { useContext, useState } from 'react';
import { AuthContext } from './Provider/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router';
import { auth } from '../../firebase.init';
import AuthShell from './Shared/AuthShell';
import { inputClass, labelClass } from './Shared/authStyles';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
    const { setUser, userLogin } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const result = await userLogin(email, password);
            const user = result.user;

            await user.reload();

            if (!user.emailVerified) {
                toast.error("Please verify your email before logging in.", { position: "top-center" });
                await auth.signOut();
                return;
            }

            setUser(user);
            toast.success("Login successful!", { position: "top-center" });
            navigate('/');
        } catch (error) {
            console.error(error.message);
            toast.error("Login Failed", { position: "top-center" });
        }
    };

    return (
        <>
            <ToastContainer theme="dark"></ToastContainer>

            <AuthShell
                title="Welcome back"
                subtitle="Log in to adopt, donate, and manage your pets."
                artTitle="Good to see you again"
                artText="Someone is waiting to meet you."
                footer={
                    <>
                        New to PawNest?{' '}
                        <Link to="/register" className="font-semibold text-caramel hover:underline">
                            Create an account
                        </Link>
                    </>
                }
            >
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className={labelClass}>Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className={inputClass}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className={labelClass}>Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={`${inputClass} pr-12`}
                                placeholder="Your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-cream mt-2 w-full justify-center">
                        Log in
                    </button>
                </form>
            </AuthShell>
        </>
    );
};

export default Login;