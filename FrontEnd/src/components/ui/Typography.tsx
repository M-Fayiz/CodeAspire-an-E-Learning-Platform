export function H1({ children, color }: { children: string; color: string }) {
  return (
    <h1
      className={`scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance ${color}`}
    >
      {children}
    </h1>
  );
}
