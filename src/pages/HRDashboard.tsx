import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CandidateRow } from "@/components/CandidateRow";
import { 
  Search, 
  Users, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Download,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Sample data - In production, this would come from the database
const sampleCandidates = [
  { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", registrationNo: "REG001", domain: "Frontend Developer", score: 85, recommendation: "recommended" as const, date: "2024-01-15" },
  { id: 2, name: "Priya Patel", phone: "+91 87654 32109", registrationNo: "REG002", domain: "HR Services", score: 72, recommendation: "recommended" as const, date: "2024-01-15" },
  { id: 3, name: "Amit Kumar", phone: "+91 76543 21098", registrationNo: "REG003", domain: "Backend Developer", score: 45, recommendation: "not_recommended" as const, date: "2024-01-14" },
  { id: 4, name: "Sneha Reddy", phone: "+91 65432 10987", registrationNo: "REG004", domain: "Business Analyst", score: 68, recommendation: "recommended" as const, date: "2024-01-14" },
  { id: 5, name: "Vikram Singh", phone: "+91 54321 09876", registrationNo: "REG005", domain: "QA Tester", score: 55, recommendation: "not_recommended" as const, date: "2024-01-13" },
  { id: 6, name: "Ananya Gupta", phone: "+91 43210 98765", registrationNo: "REG006", domain: "Finance", score: 91, recommendation: "recommended" as const, date: "2024-01-13" },
  { id: 7, name: "Karthik Nair", phone: "+91 32109 87654", registrationNo: "REG007", domain: "Software Developer", score: 78, recommendation: "recommended" as const, date: "2024-01-12" },
  { id: 8, name: "Deepa Menon", phone: "+91 21098 76543", registrationNo: "REG008", domain: "Management", score: 38, recommendation: "not_recommended" as const, date: "2024-01-12" },
];

const HRDashboard = () => {
  const navigate = useNavigate();
  const { user, isHR, loading, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "recommended" | "not_recommended">("all");

  useEffect(() => {
    if (!loading && (!user || !isHR)) {
      navigate("/hr-auth");
    }
  }, [user, isHR, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/hr-auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !isHR) {
    return null;
  }

  const filteredCandidates = sampleCandidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.phone.includes(searchQuery);
    
    const matchesFilter = 
      filter === "all" || candidate.recommendation === filter;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: sampleCandidates.length,
    recommended: sampleCandidates.filter(c => c.recommendation === "recommended").length,
    notRecommended: sampleCandidates.filter(c => c.recommendation === "not_recommended").length,
    avgScore: Math.round(sampleCandidates.reduce((acc, c) => acc + c.score, 0) / sampleCandidates.length)
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container max-w-7xl flex justify-between items-center py-4 px-6">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl py-8 px-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="animate-slide-up" style={{ animationDelay: "0ms" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Candidates</p>
                  <p className="text-3xl font-display font-bold text-foreground">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="text-primary" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "50ms" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recommended</p>
                  <p className="text-3xl font-display font-bold text-accent">{stats.recommended}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-accent" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Not Recommended</p>
                  <p className="text-3xl font-display font-bold text-destructive">{stats.notRecommended}</p>
                </div>
                <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                  <XCircle className="text-destructive" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-3xl font-display font-bold text-foreground">{stats.avgScore}%</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-primary" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Candidates List */}
        <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Candidate Performance</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Search by name, ID, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={filter === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filter === "recommended" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter("recommended")}
                  >
                    Recommended
                  </Button>
                  <Button 
                    variant={filter === "not_recommended" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter("not_recommended")}
                  >
                    Not Recommended
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Download size={16} />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <CandidateRow
                    key={candidate.id}
                    name={candidate.name}
                    phone={candidate.phone}
                    registrationNo={candidate.registrationNo}
                    domain={candidate.domain}
                    score={candidate.score}
                    recommendation={candidate.recommendation}
                    date={candidate.date}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No candidates found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HRDashboard;
