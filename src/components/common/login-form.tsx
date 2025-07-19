"use client";

import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app, db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Preloader } from "./preloader";
import ErrorBoundary from "./error-boundary";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from 'next/image';

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

interface FirebaseError extends Error {
  code: string;
}

interface LockoutState {
  attempts: number;
  lockoutEndTime: number | null;
  multiplier: number;
}

const INITIAL_LOCKOUT_DURATION = 60000; // 1 minute in milliseconds

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockoutState, setLockoutState] = useState<LockoutState>({ attempts: 0, lockoutEndTime: null, multiplier: 1 });
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('loginLockout');
    if (saved) {
      setLockoutState(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const checkLockout = () => {
      if (lockoutState.lockoutEndTime) {
        const now = Date.now();
        if (now < lockoutState.lockoutEndTime) {
          setRemainingTime(Math.ceil((lockoutState.lockoutEndTime - now) / 1000));
          return true;
        } else {
          // Reset lockout if time has expired
          const newState = { ...lockoutState, lockoutEndTime: null };
          setLockoutState(newState);
          localStorage.setItem('loginLockout', JSON.stringify(newState));
        }
      }
      return false;
    };

    if (checkLockout()) {
      const timer = setInterval(() => {
        if (!checkLockout()) {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutState]);

  const handleFailedAttempt = () => {
    const newAttempts = lockoutState.attempts + 1;
    if (newAttempts >= 3) {
      const duration = INITIAL_LOCKOUT_DURATION * lockoutState.multiplier;
      const newState = {
        attempts: 0,
        lockoutEndTime: Date.now() + duration,
        multiplier: lockoutState.multiplier * 2
      };
      setLockoutState(newState);
      localStorage.setItem('loginLockout', JSON.stringify(newState));
    } else {
      const newState = { ...lockoutState, attempts: newAttempts };
      setLockoutState(newState);
      localStorage.setItem('loginLockout', JSON.stringify(newState));
    }
  };

  const resetLockout = () => {
    const newState = { attempts: 0, lockoutEndTime: null, multiplier: 1 };
    setLockoutState(newState);
    localStorage.setItem('loginLockout', JSON.stringify(newState));
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    
    try {
      const auth = getAuth(app);
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().userRole === "admin") {
        resetLockout();
        window.location.href = "/dashboard";
      } else {
        await signOut(auth);
        setError("Access denied: Admins only.");
        handleFailedAttempt();
      }
    } catch (error) {
      const firebaseError = error as FirebaseError;
      // Log the error for debugging but don't let it bubble up
      console.log(`Authentication failed for email: ${values.email}`, {
        code: firebaseError.code,
        message: firebaseError.message
      });
      
      // Handle specific Firebase auth errors
      switch (firebaseError.code) {
        case 'auth/invalid-credential':
          setError("The email or password you entered is incorrect. Please check your credentials and try again.");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again.");
          break;
        case 'auth/user-not-found':
          setError("No account found with this email address.");
          break;
        case 'auth/too-many-requests':
          setError("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.");
          break;
        case 'auth/invalid-email':
          setError("Please enter a valid email address.");
          break;
        case 'auth/user-disabled':
          setError("This account has been disabled. Please contact support.");
          break;
        case 'auth/network-request-failed':
          setError("Network error. Please check your internet connection and try again.");
          break;
        case 'auth/timeout':
          setError("Request timed out. Please try again.");
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
          console.log('Unhandled auth error:', firebaseError.code, firebaseError.message);
      }
      
      handleFailedAttempt();
      form.resetField("password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex items-center justify-center h-screen">
        <Card className="mx-auto max-w-md relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-10">
              <Preloader className="w-24 h-24" />
            </div>
          )}
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Image src="/assets/images/logo.png" alt="GenRide Logo" width={64} height={64} />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to GenRide</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {lockoutState.lockoutEndTime && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Too many failed attempts. Please wait {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')} before trying again.
                  <Progress value={(remainingTime / (INITIAL_LOCKOUT_DURATION * lockoutState.multiplier / 1000)) * 100} className="mt-2" />
                </AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="text-sm text-muted-foreground mb-2">
                  {isClient && lockoutState.attempts > 0 && !lockoutState.lockoutEndTime && (
                    <p>Failed attempts: {lockoutState.attempts}/3</p>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !!lockoutState.lockoutEndTime}>
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
