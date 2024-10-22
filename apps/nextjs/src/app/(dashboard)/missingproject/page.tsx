import Link from "next/link";

export default function MissingProject() {
  return (
    <>
      <p>No project has been selected</p>
      <Link href="/projects">Click here to navigate to projects page</Link>
    </>
  );
}
