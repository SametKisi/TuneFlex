# TuneFlex

MP3 dosyalarının tonunu (pitch) ve hızını doğrudan tarayıcıda değiştirmeni sağlayan bir web uygulaması. Kurulum gerekmez, dosyan hiçbir sunucuya yüklenmez, tüm işlem tarayıcıda yapılır.

## Özellikler

- MP3 dosyası yükleme (yalnızca `.mp3` kabul edilir)
- Pitch ayarı: -12 ile +12 yarım ton arası
- Hız ayarı: 0.25x ile 2x arası (ton bağımsız)
- Gerçek zamanlı dinleme (çal / durdur)
- Ses dalga formu (waveform) ve oynatma ilerleme çizgisi
- İşlenmiş sesi MP3 olarak indirme (192 kbps)
- Mobil uyumlu arayüz

## Teknolojiler

- [React](https://react.dev/) + [Vite](https://vite.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [soundtouchjs](https://github.com/cutterbl/SoundTouchJS): pitch ve tempo işleme
- [@breezystack/lamejs](https://github.com/breezystack/lamejs): MP3 kodlama
- [Phosphor Icons](https://phosphoricons.com/)

## Proje Yapısı

```
TuneFlex/
└── frontend/
    └── src/
        ├── AudioContext.tsx      # Seçilen ses dosyasını sayfalar arası paylaşan context
        ├── Pages/
        │   ├── Home.tsx          # Ana sayfa ve MP3 yükleme
        │   └── Pitch.tsx         # Pitch/hız ayarı, dinleme ve indirme
        ├── component/
        │   └── MainPage.jsx      # Ana sayfa görseli
        └── main.tsx
```

## Kurulum

```bash
git clone https://github.com/SametKisi/TuneFlex.git
cd TuneFlex/frontend
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde açılır.

## Build

```bash
npm run build
```

Build komutu önce `tsc -b` ile tip kontrolü yapar, ardından `vite build` çalıştırır. Çıktı `frontend/dist` klasörüne yazılır.

## Deploy (Vercel)

1. Repoyu Vercel'e içe aktar.
2. **Root Directory** olarak `frontend` seç.
3. Framework Preset: **Vite** (Build Command: `npm run build`, Output Directory: `dist`).
4. Deploy et.

## Nasıl Çalışır?

1. Ana sayfada MP3 dosyası seçilir ve `AudioContext` içinde saklanır.
2. `/pitch` sayfasında dosya Web Audio API ile çözülür ve `PitchShifter` ile çalınır.
3. Pitch ve hız sürgüleri çalma sırasında anlık olarak uygulanır.
4. İndirme sırasında ses baştan sona `SoundTouch` ile işlenir ve parça parça MP3'e kodlanır.

## Notlar

- Tarayıcı Web Audio API desteği gerekir (güncel Chrome, Edge, Firefox, Safari).
- Uzun dosyalarda indirme işlemi birkaç saniye sürebilir.
- Çalma sırasında takılma olursa `Pitch.tsx` içindeki `BUFFER_SIZE` değerini (`4096`, `8192`, `16384`) değiştirerek dene.
