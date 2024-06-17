'use client';

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/user.models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { motion } from 'framer-motion';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      if (typeof message._id === 'string') {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        toast({
          title: response.data.message,
        });
        onMessageDelete(message._id);
      } else {
        console.error("message._id is not a string");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mb-4"
    >
      <Card className="bg-gray-800 text-white rounded-lg shadow-lg">
        <CardHeader className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">{message.content}</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="p-1 rounded-full hover:bg-red-600">
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-800 text-white rounded-lg shadow-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg font-semibold">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This action cannot be undone. This will permanently delete this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 text-white rounded-lg hover:bg-red-500">
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="text-sm text-gray-400">
            {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}