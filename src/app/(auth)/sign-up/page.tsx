'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import ApiResponse from '@/types/ApiResponse';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const checkUsernameUnique = useCallback(async () => {
    if (username) {
      setIsCheckingUsername(true);
      setUsernameMessage('');
      try {
        const response = await axios.get(`/api/check-username-unique?username=${username}`);
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    }
  }, [username]);

  useEffect(() => {
    checkUsernameUnique();
  }, [username, checkUsernameUnique]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: "Account created",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error in signup of user");
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Signup failed",
        description: axiosError.response?.data.message ?? "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-70"></div>
        <div className="absolute inset-0 bg-noise"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Join VeilChat
          </h1>
          <p className="mb-4 text-gray-300">Sign up to start your anonymous adventure</p>
        </motion.div>
        <Form {...form}>
          <motion.form
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Username</FormLabel>
                  <Input
                    placeholder='Enter Username'
                    {...field}
                    className="w-full border-gray-700 bg-gray-900 text-white rounded-md shadow-sm focus:ring focus:ring-purple-500"
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin text-white" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${usernameMessage === 'Username is unique'
                        ? 'text-green-500'
                        : 'text-red-500'
                        }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <Input {...field} className="w-full border-gray-700 bg-gray-900 text-white rounded-md shadow-sm focus:ring focus:ring-purple-500" />
                  <p className='text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <Input type="password" {...field} className="w-full border-gray-700 bg-gray-900 text-white rounded-md shadow-sm focus:ring focus:ring-purple-500" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:ring focus:ring-purple-300' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </motion.form>
        </Form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-4"
        >
          <p className="text-gray-300">
            Already a member?{' '}
            <Link href="/sign-in" className="text-purple-500 hover:text-purple-400">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignUp;