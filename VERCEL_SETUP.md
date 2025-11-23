# 🔧 Hướng dẫn Sửa Lỗi "Không có data" trên Vercel

## ❌ Vấn đề
Khi deploy lên Vercel, trang web báo "không có card nào" mặc dù trên localhost:3000 vẫn hoạt động bình thường.

## 🔍 Nguyên nhân
- Trên **localhost**: App sử dụng relative path `/api/v1` và Vite proxy forward đến `http://localhost:3000/api/v1`
- Trên **Vercel**: Không có proxy, app vẫn gọi `/api/v1` nhưng nó sẽ gọi tới `https://react-english-ten.vercel.app/api/v1` (không tồn tại) thay vì backend server thực sự

## ✅ Giải pháp

### Bước 1: Xác định URL Backend API của bạn

Backend API của bạn đang chạy ở đâu?

**Nếu backend chạy trên localhost:3000:**
- ❌ Không thể dùng trực tiếp trên production vì localhost chỉ truy cập được trong mạng nội bộ
- ✅ Cần deploy backend lên một server public (Render, Railway, Heroku, VPS, etc.)

**Nếu backend đã được deploy:**
- Ghi lại URL đầy đủ của backend API (ví dụ: `https://your-backend.railway.app/api/v1` hoặc `https://api.yourdomain.com/api/v1`)

### Bước 2: Cấu hình Environment Variable trên Vercel

1. **Truy cập Vercel Dashboard:**
   - Vào https://vercel.com
   - Đăng nhập và chọn project `react-english-ten`

2. **Vào Settings:**
   - Click vào project → Chọn tab **"Settings"**

3. **Thêm Environment Variable:**
   - Scroll xuống section **"Environment Variables"**
   - Click **"Add New"**
   - Nhập:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: URL đầy đủ của backend API (ví dụ: `https://your-backend.railway.app/api/v1`)
     - **Environment**: Chọn tất cả (Production, Preview, Development)
   - Click **"Save"**

4. **Redeploy:**
   - Vào tab **"Deployments"**
   - Tìm deployment mới nhất
   - Click vào **"..."** (menu) → **"Redeploy"**
   - Hoặc push một commit mới lên GitHub để trigger auto-deploy

### Bước 3: Đảm bảo Backend cho phép CORS

Backend của bạn cần được cấu hình để cho phép requests từ domain Vercel:

```javascript
// Ví dụ với Express.js
const cors = require('cors');

app.use(cors({
  origin: [
    'https://react-english-ten.vercel.app',
    'http://localhost:5173', // Cho development
  ],
  credentials: true
}));
```

### Bước 4: Kiểm tra lại

1. Đợi deployment hoàn tất
2. Truy cập: https://react-english-ten.vercel.app/dashboard
3. Mở Developer Tools (F12) → Tab **Network**
4. Kiểm tra xem các API requests có đang gọi đúng URL backend không
5. Kiểm tra console có lỗi CORS không

## 📝 Ví dụ Cấu hình

### Backend trên Railway/Render:
```
VITE_API_BASE_URL=https://your-app-name.railway.app/api/v1
```

### Backend trên custom domain:
```
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

### Development (local):
- Không cần set (sẽ dùng proxy tự động từ `vite.config.ts`)

## 🐛 Troubleshooting

### Vẫn không có data sau khi set environment variable?
1. ✅ Đảm bảo đã **Redeploy** sau khi thêm environment variable
2. ✅ Kiểm tra URL backend có đúng không (có `/api/v1` ở cuối)
3. ✅ Kiểm tra backend có đang chạy và accessible từ internet không
4. ✅ Kiểm tra CORS settings trên backend
5. ✅ Mở Developer Tools → Network tab để xem lỗi cụ thể

### Lỗi CORS?
- Cập nhật CORS settings trên backend để cho phép domain Vercel
- Đảm bảo backend trả về header `Access-Control-Allow-Origin` đúng

### Backend chưa deploy?
- Cần deploy backend lên một service như:
  - **Railway**: https://railway.app
  - **Render**: https://render.com
  - **Heroku**: https://heroku.com
  - **VPS/Cloud Server** (AWS, DigitalOcean, etc.)

## 💡 Lưu ý

- Environment variables chỉ có hiệu lực sau khi **redeploy**
- Phải có tiền tố `VITE_` trong tên biến để Vite expose nó ra client-side code
- Backend URL phải là **public URL**, không thể dùng `localhost` trên production

