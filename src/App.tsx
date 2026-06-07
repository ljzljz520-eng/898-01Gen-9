import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import ReadingClubDetail from "@/pages/ReadingClubDetail";
import CreateReadingClub from "@/pages/CreateReadingClub";
import Review from "@/pages/Review";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reading-club/:id" element={<ReadingClubDetail />} />
          <Route path="/create" element={<CreateReadingClub />} />
          <Route path="/reading-club/:id/review" element={<Review />} />
        </Routes>
      </Layout>
    </Router>
  );
}
