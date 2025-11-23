# Hướng dẫn Deploy lên Vercel

## ✅ Đã sẵn sàng deploy

### Build thành công
- ✅ Tất cả lỗi TypeScript đã được sửa
- ✅ Build thành công không có lỗi
- ✅ File `vercel.json` đã được tạo

### Các bước deploy:

1. **Commit và push code lên GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy lên Vercel:**
   - Truy cập https://vercel.com
   - Đăng nhập và chọn "Import Project"
   - Kết nối với repository GitHub của bạn
   - Vercel sẽ tự động detect framework (Vite)
   - Build Command: `npm run build` (mặc định)
   - Output Directory: `dist` (mặc định)
   - Install Command: `npm install` (mặc định)

3. **Cấu hình Environment Variables (nếu cần):**
   - Vào Settings > Environment Variables
   - Thêm các biến môi trường cần thiết:
     - `VITE_API_BASE_URL`: URL của backend API
     - Các biến khác nếu cần

4. **Deploy:**
   - Click "Deploy"
   - Đợi quá trình build hoàn tất
   - Site sẽ được deploy tự động

### Cấu trúc Project:
- Framework: Vite + React + TypeScript
- Build output: `dist/`
- Router: React Router với SPA routing
- File cấu hình: `vercel.json` đã được tạo với rewrite rules cho SPA

### Lưu ý:
- Đảm bảo backend API đã được deploy và CORS đã được cấu hình đúng
- Cập nhật `VITE_API_BASE_URL` trong environment variables trên Vercel
- File `vercel.json` đã được cấu hình để redirect tất cả routes về `index.html` cho SPA routing

