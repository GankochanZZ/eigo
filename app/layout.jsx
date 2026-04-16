import './globals.css';

export const metadata = {
  title: '鑑真英語',
  description: '理由も問う4択問題アプリ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
