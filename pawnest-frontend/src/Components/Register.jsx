import { useContext, useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from './Provider/AuthProvider';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { sendEmailVerification } from 'firebase/auth';
import { API_URL } from '../api';
import AuthShell from './Shared/AuthShell';
import { errorClass, inputClass, labelClass } from './Shared/authStyles';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
    const { createUser, setUser, updateUserProfile } = useContext(AuthContext);
    const [passworderror, setPassworderror] = useState("");
    const [emailerror, setEmailerror] = useState("");
    const [phoneerror, setPhoneerror] = useState("");
    const [nameerror, setNameerror] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const conpassword = e.target.conpassword.value;
        const phone = e.target.phone.value;
        const city = e.target.city.value;

        setNameerror("");
        setEmailerror("");
        setPhoneerror("");
        setPassworderror("");

        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const nameRegex = /^[A-Za-z ]+$/;

        if (phone.length !== 11) {
            setPhoneerror("Please Enter a valid Phone Number");
            return;
        }

        if (!passwordRegex.test(password)) {
            setPassworderror("Password must include at least one uppercase letter(A-Z), a number(0-9), a special character(!@#$%^&*), and be at least 6 characters long.");
            return;
        }

        if (!nameRegex.test(name)) {
            setNameerror("Invalid Name");
            return;
        }

        if (!emailRegex.test(email)) {
            setEmailerror("Invalid Email Format");
            return;
        }

        if (password !== conpassword) {
            setPassworderror("Password and Confirm Password did not match");
            toast.error("Password and Confirm Password did not match", { position: 'top-center' });
            return;
        }

        try {
            const result = await createUser(email, password);
            const user = result.user;

            await sendEmailVerification(user);
            toast.info("Verification email sent! Please check your inbox.", {
                position: "top-center",
                autoClose: 2000,
                onClose: () => navigate("/login")
            });

            await updateUserProfile({
                displayName: name,
            });

            setUser({ ...user, displayName: name });

            const userInfo = { name, email, phone, city };
            const res = await axios.post(`${API_URL}/users`, userInfo);

            if (res.data.insertedId) {
                e.target.reset();
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
            if (error.code === "auth/email-already-in-use") {
                toast.error("This Email is Already Taken", { position: "top-center" });
            } else {
                toast.error("Registration failed. Please try again.", { position: "top-center" });
            }
        }
    };

    return (
        <>
            <ToastContainer theme="dark"></ToastContainer>

            <AuthShell
                title="Join PawNest"
                subtitle="Create your account in less than a minute."
                artTitle="Join the PawNest family"
                artText="Adopt, donate, and help pets find a loving home."
                footer={
                    <>
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-caramel hover:underline">
                            Log in
                        </Link>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className={labelClass}>Name</label>
                            <input id="name" name="name" type="text" className={inputClass} placeholder="Your name" required />
                            {nameerror && <p className={errorClass}>{nameerror}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" className={labelClass}>Phone number</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                pattern="[0-9]{11}"
                                className={inputClass}
                                placeholder="11 digit phone number"
                                required
                            />
                            {phoneerror && <p className={errorClass}>{phoneerror}</p>}
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="email" className={labelClass}>Email</label>
                            <input id="email" name="email" type="email" className={inputClass} placeholder="you@example.com" required />
                            {emailerror && <p className={errorClass}>{emailerror}</p>}
                        </div>

                        <div>
                            <label htmlFor="city" className={labelClass}>City</label>
                            <input id="city" name="city" type="text" className={inputClass} placeholder="Your city" required />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="password" className={labelClass}>Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className={`${inputClass} pr-12`}
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="conpassword" className={labelClass}>Confirm password</label>
                            <div className="relative">
                                <input
                                    id="conpassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="conpassword"
                                    className={`${inputClass} pr-12`}
                                    placeholder="Confirm password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream"
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {passworderror && <p className={errorClass}>{passworderror}</p>}
                    <p className="text-sm text-cream/55">
                        Use at least 6 characters, with one uppercase letter, one number, and one special character (!@#$%^&*).
                    </p>

                    <button type="submit" className="btn-cream mt-2 w-full justify-center">
                        Create account
                    </button>
                </form>
            </AuthShell>
        </>
    );
};

export default Register;