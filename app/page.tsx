import MediaGenerator from './components/MediaGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <MediaGenerator />
      </div>
    </main>
  );
}
