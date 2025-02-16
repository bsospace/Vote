import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';
import config from "@/config/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// สร้าง axios instance
export const axiosInstance = axios.create({
  baseURL: `${config.apiUrl}`, // URL ของ API ที่ต้องการ
  timeout: 10000, // กำหนด timeout ในการร้องขอ (10 วินาที)
  headers: {
    'Content-Type': 'application/json', // ตั้งค่า headers เริ่มต้น
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // ถ้ามีการใช้ token
  }
});