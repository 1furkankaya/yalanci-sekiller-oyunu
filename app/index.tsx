import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // layout mount edilsin diye yönlendirmeyi küçük bir gecikmeyle yap
    const timeout = setTimeout(() => {
      router.replace('/DifficultyScreen');
    }, 0); // 0 ms bile yeterli

    return () => clearTimeout(timeout); // temizlik
  }, []);

  return null;
}
