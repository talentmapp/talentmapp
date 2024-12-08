// This is the server component that handles the route.
// It extracts the 'q' query parameter from searchParams and passes it to the Home component as 'initialQuery'.

export default function SearchPage({ searchParams }) {
  // Extract 'q' from the query parameters
  const initialQuery = searchParams?.q ?? "";

  // Render the Home client component, passing initialQuery as a prop
  return <Home initialQuery={initialQuery} />;
}

// Import the Home client component. Make sure Home.js is in the same directory.
// Because Home is a client component, we must import it after the export default to avoid SSR issues.
import Home from "./Home";
