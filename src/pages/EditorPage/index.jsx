import { usePageTitle } from "@/hooks/usePageTitle"

function EditorPage() {
  usePageTitle("Slide Editor")
  return <h1 className="text-2xl font-bold p-8">Editor Page</h1>;
}

export default EditorPage;
