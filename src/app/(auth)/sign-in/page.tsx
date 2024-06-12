'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { motion } from 'framer-motion';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

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
            Welcome Back to VeilChat
          </h1>
          <p className="mb-4 text-gray-300">Sign in to continue your secret conversations</p>
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
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email/Username</FormLabel>
                  <Input
                    {...field}
                    className="w-full border-gray-700 bg-gray-900 text-white rounded-md shadow-sm focus:ring focus:ring-purple-500"
                  />
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
                  <Input
                    type="password"
                    {...field}
                    className="w-full border-gray-700 bg-gray-900 text-white rounded-md shadow-sm focus:ring focus:ring-purple-500"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:ring focus:ring-purple-300" type="submit">
              Sign In
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
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-purple-500 hover:text-purple-400">
              Sign up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
