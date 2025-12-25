import Link from "next/link";
import './globals.css';

export default function HomePage() {
  return (
    <main>
      <h1 className={'text-headline-h1'}>Home</h1>

      <nav>
        <ul>
          <li>
            <Link href="/presets">Presets</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
