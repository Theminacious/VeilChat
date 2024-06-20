'use client'
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import {ApiResponse} from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Account verified',
        description: response.data.message,
      });

      router.replace(`/sign-in`);
    } catch (error) {
      console.error('Error in signup of user', error);
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: 'Verification failed',
        description: axiosError.response?.data.message ?? 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg"
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-white">
            Verify Your Account
          </h1>
          <p className="mb-4 text-gray-400">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Verification Code</FormLabel>
                  <Input {...field} className="w-full border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring focus:ring-blue-500" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-300">
                Verify
              </Button>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
};

export default VerifyAccount;
