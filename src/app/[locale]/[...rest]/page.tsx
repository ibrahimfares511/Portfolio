import { notFound } from "next/navigation";

/** Any path inside a language that has no page → the 404 below. */
export default function CatchAll() {
  notFound();
}
